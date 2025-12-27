<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    // List all patients
    public function index() {
        $patients = DB::select('SELECT *, 0 AS appointments, "N/A" AS last_payment FROM patients');
        return response()->json($patients);
    }

    // Add new patient
    public function store(Request $request) {
        $data = $request->only('name','contact','address','status','medical_history');
        DB::insert('INSERT INTO patients (name, contact, address, status, medical_history) VALUES (?, ?, ?, ?, ?)', array_values($data));
        return response()->json(['message' => 'Patient added successfully']);
    }

    // View single patient
    public function show($id) {
        $patient = DB::select('SELECT *, 0 AS appointments, "N/A" AS last_payment FROM patients WHERE id = ?', [$id]);
        return response()->json($patient[0] ?? null);
    }

    // Update patient
    public function update(Request $request, $id) {
        $data = $request->only('name','contact','address','status','medical_history');
        DB::update('UPDATE patients SET name=?, contact=?, address=?, status=?, medical_history=?, updated_at=NOW() WHERE id=?', array_merge(array_values($data), [$id]));
        return response()->json(['message' => 'Patient updated successfully']);
    }

    // Delete patient
    public function destroy($id) {
        DB::delete('DELETE FROM patients WHERE id=?', [$id]);
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}

