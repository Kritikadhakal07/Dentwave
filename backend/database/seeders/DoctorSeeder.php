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
                'name' => 'Dr. Puja Dhital',
                'email' => 'dhitalpuja9@gmail.com',
                'password' => Hash::make('Puja@123'),
                'phone' => '9876543210',
                'gender' => 'female',
                'role' => 'doctor',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Deepa Dhakal',
                'email' => 'deepa.dhakal@aadimcollege.edu.np',
                'password' => Hash::make('Deepa@123'),
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
