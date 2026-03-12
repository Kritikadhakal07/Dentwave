<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        DB::insert(
            "INSERT INTO contacts (name, email, phone, message, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['name'],
                $validated['email'],
                $validated['phone'],
                $validated['message'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully!'
        ]);
    }
}
