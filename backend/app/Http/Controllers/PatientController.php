<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    // List all patients
    public function index()
    {
        $patients = DB::select("
            SELECT 
                p.*,
                COUNT(a.id) AS appointments,
                COALESCE(MAX(a.appointment_date), 'N/A') AS last_appointment
            FROM patients p
            LEFT JOIN appointments a ON a.user_id = p.user_id
            GROUP BY p.id
            ORDER BY p.id DESC
        ");

        return response()->json($patients);
    }

    // Add new patient
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'contact'         => 'required|string|max:20',
            'address'         => 'nullable|string|max:500',
            'status'          => 'required|in:Active,Inactive',
            'medical_history' => 'nullable|string',
        ]);

        DB::insert(
            "INSERT INTO patients (name, contact, address, status, medical_history, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['name'],
                $validated['contact'],
                $validated['address']         ?? null,
                $validated['status'],
                $validated['medical_history'] ?? null,
            ]
        );

        $patient = DB::select("SELECT * FROM patients ORDER BY id DESC LIMIT 1");

        return response()->json([
            'success' => true,
            'message' => 'Patient added successfully',
            'patient' => $patient[0]
        ], 201);
    }

    // View single patient
    public function show($id)
    {
        $patient = DB::select("
            SELECT 
                p.*,
                COUNT(a.id) AS appointments,
                COALESCE(MAX(a.appointment_date), 'N/A') AS last_appointment
            FROM patients p
            LEFT JOIN appointments a ON a.user_id = p.user_id
            WHERE p.id = ?
            GROUP BY p.id
        ", [$id]);

        if (empty($patient)) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'patient' => $patient[0]
        ]);
    }

    // Update patient
    public function update(Request $request, $id)
    {
        // Check if patient exists
        $existing = DB::select("SELECT * FROM patients WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'contact'         => 'required|string|max:20',
            'address'         => 'nullable|string|max:500',
            'status'          => 'required|in:Active,Inactive',
            'medical_history' => 'nullable|string',
        ]);

        DB::update(
            "UPDATE patients 
             SET name = ?, contact = ?, address = ?, status = ?, medical_history = ?, updated_at = NOW() 
             WHERE id = ?",
            [
                $validated['name'],
                $validated['contact'],
                $validated['address']         ?? null,
                $validated['status'],
                $validated['medical_history'] ?? null,
                $id
            ]
        );

        $updated = DB::select("SELECT * FROM patients WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Patient updated successfully',
            'patient' => $updated[0]
        ]);
    }

    // Delete patient
    public function destroy($id)
    {
        // Check if patient exists
        $patient = DB::select("SELECT * FROM patients WHERE id = ?", [$id]);
        if (empty($patient)) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        DB::delete("DELETE FROM patients WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Patient deleted successfully'
        ]);
    }
}