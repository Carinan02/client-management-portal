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

    $file         = $request->file('file');
    $originalName = $file->getClientOriginalName();

    // Store file contents in DB so the queue worker (separate container)
    // can access it without needing a shared filesystem.
    $import = Import::create([
    'started_by'    => auth()->id(),
    'filename'      => $originalName,
    'file_name'     => $originalName,  // ← add this
    'file_contents' => base64_encode(file_get_contents($file->getRealPath())),
    'stored_path'   => '',
    'status'        => 'Queued',
]);

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
