<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name'    => fake()->name(),
            'email'        => fake()->unique()->safeEmail(),
            'phone'        => fake()->phoneNumber(),
            'company_name' => fake()->company(),
            'status'       => fake()->randomElement(['lead', 'active', 'inactive']),
            'staff_id'     => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['status' => 'active']);
    }

    public function lead(): static
    {
        return $this->state(fn () => ['status' => 'lead']);
    }
}