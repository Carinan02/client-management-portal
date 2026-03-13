<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $staff    = User::where('role', 'staff')->first();
        $services = Service::all();

        $clients = [
            [
                'full_name'    => 'Money Pakyaw',
                'email'        => 'money@example.com',
                'phone'        => '555-0101',
                'company_name' => 'Gensan',
                'status'       => 'active',
                'staff_id'     => $staff?->id,
            ],
            [
                'full_name'    => 'May Weather',
                'email'        => 'May@example.com',
                'phone'        => '555-0102',
                'company_name' => 'Dallas',
                'status'       => 'lead',
                'staff_id'     => $staff?->id,
            ],
            [
                'full_name'    => 'Naneto Dioniso',
                'email'        => 'Naneto@example.com',
                'phone'        => '555-0103',
                'company_name' => 'Naneto Boxing Co',
                'status'       => 'inactive',
                'staff_id'     => null,
            ],
            [
                'full_name'    => 'David Martinez',
                'email'        => 'david@techcorp.dev',
                'phone'        => '555-0104',
                'company_name' => 'TechCorp',
                'status'       => 'active',
                'staff_id'     => $staff?->id,
            ],
            [
                'full_name'    => 'Eva Brown',
                'email'        => 'eva@creativestudio.co',
                'phone'        => '555-0105',
                'company_name' => 'Creative Studio',
                'status'       => 'lead',
                'staff_id'     => null,
            ],
            [
                'full_name'    => 'David John',
                'email'        => 'david@magma.dev',
                'phone'        => '555-0104',
                'company_name' => 'Magma',
                'status'       => 'active',
                'staff_id'     => $staff?->id,
            ],
            [
                'full_name'    => 'John Doe',
                'email'        => 'Doe@flamigo.dev',
                'phone'        => '555-0104',
                'company_name' => 'flamigo',
                'status'       => 'active',
                'staff_id'     => $staff?->id,
            ],
        ];

        $assignmentStatuses = ['Pending', 'In Progress', 'Completed'];

        foreach ($clients as $clientData) {
            $client = Client::firstOrCreate(['email' => $clientData['email']], $clientData);

            if ($services->isNotEmpty() && $client->services()->count() === 0) {
                $serviceSubset = $services->random(min(rand(1, 3), $services->count()));
                $syncData = [];
                foreach ($serviceSubset as $service) {
                    $syncData[$service->id] = [
                        'status' => $assignmentStatuses[array_rand($assignmentStatuses)],
                    ];
                }
                $client->services()->sync($syncData);
            }
        }
    }
}