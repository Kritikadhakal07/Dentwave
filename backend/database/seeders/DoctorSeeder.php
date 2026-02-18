<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Dr. John Doe',
                'email' => 'doctor1@example.com',
                'password' => Hash::make('password123'),
                'phone' => '9876543210',
                'gender' => 'male',
                'role' => 'doctor',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Jane Smith',
                'email' => 'doctor2@example.com',
                'password' => Hash::make('password123'),
                'phone' => '9876543211',
                'gender' => 'female',
                'role' => 'doctor',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    
}
