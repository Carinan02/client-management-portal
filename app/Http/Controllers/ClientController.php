<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $clients = Client::with(['staff:id,name', 'services:id,name'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('full_name')
            ->paginate(5)
            ->withQueryString();
        
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only('search'),
            'canImport' => auth()->user()->isAdminOrManager(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Clients/Create', [
            'services'   => Service::where('is_active', true)->orderBy('name')->get(['id', 'name', 'description']),
            'staffUsers' => User::where('role', 'staff')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->safe()->except('services'));

        $this->syncServices($client, $request->input('services', []));

        return redirect()->route('clients.index')
            ->with('success', 'Client created successfully.');
    }

    public function edit(Client $client): Response
    {
        $client->load(['services:id,name,is_active']);

        return Inertia::render('Clients/Edit', [
            'client'     => $client,
            'services'   => Service::orderBy('name')->get(['id', 'name', 'description', 'is_active']),
            'staffUsers' => User::where('role', 'staff')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->safe()->except('services'));

        $this->syncServices($client, $request->input('services', []));

        return redirect()->route('clients.index')
            ->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $client->services()->detach();
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Client deleted successfully.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function syncServices(Client $client, array $services): void
    {
        $syncData = [];
        foreach ($services as $service) {
            if (! empty($service['id'])) {
                $syncData[$service['id']] = [
                    'status' => $service['status'] ?? 'pending',
                ];
            }
        }
        $client->services()->sync($syncData);
    }
}