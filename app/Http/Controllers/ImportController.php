<?php

namespace App\Http\Controllers;

use App\Imports\ClientsImport;
use App\Jobs\ProcessClientImport;
use App\Models\Import;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;


class ImportController extends Controller
{
    public function index(){

    }

    public function store(Request $request){
       
     $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx,xls', 'max:20480'],
        ]);

        $file          = $request->file('file');
        $originalName  = $file->getClientOriginalName();
         /* FOR MODULE 5 

        $clientsImport = new ClientsImport();

        try {
            // Run the import synchronously — Excel handles CSV and XLSX transparently
            Excel::import($clientsImport, $file);

            $importedCount = $clientsImport->importedCount();
            $skippedCount  = $clientsImport->skippedCount();

            Import::create([
                'started_by'     => auth()->id(),
                'filename'       => $originalName,
                'status'         => 'Completed',
                'imported_count' => $importedCount,
                'skipped_count'  => $skippedCount,
            ]);

            // Flash a structured summary — the React page renders a result banner
            return redirect()
                ->route('clients.index')
                ->with('import_summary', [
                    'filename' => $originalName,
                    'imported' => $importedCount,
                    'skipped'  => $skippedCount,
                    'status'   => 'Completed',
                ]);

        } catch (\Throwable $e) {
            Import::create([
                'started_by'     => auth()->id(),
                'filename'      => $originalName,
                'status'        => 'Failed',
            ]);

            return redirect()
                ->route('clients.index')
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
                */

        

        $file         = $request->file('file');
        $originalName = $file->getClientOriginalName();

        // Persist the file so the queue worker can read it after the HTTP
        // request has ended (the temp file would otherwise be deleted).
        $storedPath = $file->store('imports', 'local');

        // Create the import record in Queued state before dispatching so the
        // UI can show it immediately on the next page load.
        $import = Import::create([
            'started_by'     => auth()->id(),
            'filename'    => $originalName,
            'stored_path' => $storedPath,
            'status'      => 'Queued',
        ]);

        // Hand off to the queue — returns immediately.
        ProcessClientImport::dispatch($import);

        return redirect()
            ->route('clients.index')
            ->with('success', 'Import started! You can monitor progress in the Imports section below.');
    }



    public function template(){
        $rows = [
                ['full_name', 'email', 'phone', 'company_name', 'status'],
                ['Alice Johnson', 'alice@example.com', '555-0101', 'Acme Corp', 'Lead'],
                ['Bob Williams',  'bob@example.com',   '555-0102', 'Beta LLC',  'Active'],
            ];

            $csv = implode("\n", array_map(fn ($r) => implode(',', $r), $rows)) . "\n";

            return response($csv, 200, [
                'Content-Type'        => 'text/csv',
                'Content-Disposition' => 'attachment; filename="clients_import_template.csv"',
            ]);
    }
    public function latest(): JsonResponse
    {
        $imports = Import::where('started_by', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json($imports);
    }
}
