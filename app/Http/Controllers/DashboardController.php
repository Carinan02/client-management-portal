<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Service;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_clients'  => Client::count(),
                'active_clients' => Client::where('status', 'active')->count(),
                'lead_clients'   => Client::where('status', 'lead')->count(),
                'total_services' => Service::count(),
                'active_services'=> Service::where('is_active', true)->count(),
                'total_users'    => User::count(),
                'active_users'   => User::where('is_active', true)->count(),
            ],
        ]);
    }
}
