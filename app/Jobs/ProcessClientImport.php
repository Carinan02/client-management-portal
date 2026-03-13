<?php

namespace App\Jobs;

use App\Imports\ClientsImport;
use App\Models\Import;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProcessClientImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Retry up to 3 times before marking as permanently failed. */
    public int $tries = 3;

    /** Kill the job if it runs longer than 5 minutes. */
    public int $timeout = 300;

    public function __construct(public readonly Import $import) {}

    public function handle(): void
    {
        // Transition Pending → Processing so the UI badge updates on next poll.
        $this->import->update(['status' => 'Processing']);

        $storedPath = $this->import->stored_path;

        try {
            if (! Storage::disk('local')->exists($storedPath)) {
                throw new \RuntimeException(
                    "Uploaded file not found on disk: {$storedPath}"
                );
            }

            $fullPath      = Storage::disk('local')->path($storedPath);
            $clientsImport = new ClientsImport();

            // Excel::import handles both .csv and .xlsx transparently via
            // the same ClientsImport class used in the old sync flow.
            Excel::import($clientsImport, $fullPath);

            $this->import->update([
                'status'         => 'Completed',
                'imported_count' => $clientsImport->importedCount(),
                'skipped_count'  => $clientsImport->skippedCount(),
            ]);

        } catch (Throwable $e) {
            $this->import->update([
                'status'        => 'Failed',
                'error_message' => $e->getMessage(),
            ]);

            // Re-throw so Laravel marks the attempt as failed and applies
            // the $tries retry policy.
            throw $e;

        } finally {
            // Always remove the temp file — whether we succeeded or failed.
            Storage::disk('local')->delete($storedPath);
        }
    }
}
