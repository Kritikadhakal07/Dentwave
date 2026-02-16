<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    // Insert contact (CREATE)
    public function store(Request $request)
    {
        DB::statement(
            "INSERT INTO contacts (name, email, phone, message, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())",
            [
                $request->name,
                $request->email,
                $request->phone,
                $request->message
            ]
        );

        return response()->json(['message' => 'Contact saved successfully']);
    }

    // Get all contacts (READ)
    public function index()
    {
        $contacts = DB::select("SELECT * FROM contacts ORDER BY id DESC");
        return response()->json($contacts);
    }

    // Get single contact
    public function show($id)
    {
        $contact = DB::select(
            "SELECT * FROM contacts WHERE id = ?",
            [$id]
        );

        return response()->json($contact);
    }

    // Update contact
    public function update(Request $request, $id)
    {
        DB::statement(
            "UPDATE contacts
             SET name = ?, email = ?, phone = ?, message = ?, updated_at = NOW()
             WHERE id = ?",
            [
                $request->name,
                $request->email,
                $request->phone,
                $request->message,
                $id
            ]
        );

        return response()->json(['message' => 'Contact updated successfully']);
    }

    // Delete contact
    public function destroy($id)
    {
        DB::statement(
            "DELETE FROM contacts WHERE id = ?",
            [$id]
        );

        return response()->json(['message' => 'Contact deleted successfully']);
    }
}
