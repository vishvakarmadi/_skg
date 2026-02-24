<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'phone' => '9876543210',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'is_active' => true,
            'email_verified' => true,
            'phone_verified' => true,
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        // Regular user
        User::create([
            'name' => 'User',
            'email' => 'user@gmail.com',
            'phone' => '9876543211',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_active' => true,
            'email_verified' => true,
            'phone_verified' => true,
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        // Additional test customers
        $customers = [
            ['name' => 'Rajesh Sharma', 'email' => 'rajesh@example.com', 'phone' => '9876543212'],
            ['name' => 'Priya Patel', 'email' => 'priya@example.com', 'phone' => '9876543213'],
            ['name' => 'Amit Kumar', 'email' => 'amit@example.com', 'phone' => '9876543214'],
            ['name' => 'Sunita Devi', 'email' => 'sunita@example.com', 'phone' => '9876543215'],
            ['name' => 'Vikram Singh', 'email' => 'vikram@example.com', 'phone' => '9876543216'],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'phone' => $customer['phone'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_active' => true,
                'email_verified' => true,
                'phone_verified' => true,
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
            ]);
        }

        $this->command->info('Users seeded: admin@gmail.com / user@gmail.com (password: password)');
    }
}
