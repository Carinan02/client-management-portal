<?php

namespace App\Jobs;

use App\Imports\ClientsImport;
use App\Models\Import;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProcessClientImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(public readonly Import $import) {}

    public function handle(): void
    {
        $this->import->update(['status' => 'Processing']);

        try {
            if (empty($this->import->file_contents)) {
                throw new \RuntimeException("No file contents found in database.");
            }

            $extension = pathinfo($this->import->file_name, PATHINFO_EXTENSION);
            $tmpPath   = tempnam(sys_get_temp_dir(), 'import_') . '.' . $extension;

            file_put_contents($tmpPath, base64_decode($this->import->file_contents));

            $clientsImport = new ClientsImport();
            Excel::import($clientsImport, $tmpPath);

            $this->import->update([
                'status'         => 'Completed',
                'imported_count' => $clientsImport->importedCount(),
                'skipped_count'  => $clientsImport->skippedCount(),
                'file_contents'  => null,
            ]);

        } catch (Throwable $e) {
            $this->import->update([
                'status'        => 'Failed',
                'error_message' => $e->getMessage(),
            ]);
            throw $e;

        } finally {
            if (isset($tmpPath) && file_exists($tmpPath)) {
                unlink($tmpPath);
            }
        }
    }
}