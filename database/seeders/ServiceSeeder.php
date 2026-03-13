<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'Hair Cut','description' => 'Hair Cut 100 only','is_active' => true],
            ['name' => 'Massage','description' => 'Full Body Massage for only 500','is_active' => true],
            ['name' => 'Foot Spa','description' => 'Foor Spa for 30 mins for only 250','is_active' => false],
            ['name' => 'Pedicure','description' => 'Pedicure Service for only 150','is_active' => true],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['name' => $service['name']], $service);
        }
    }
}
