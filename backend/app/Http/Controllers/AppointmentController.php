<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments.
     */
    public function index()
    {
        $appointments = DB::select("
            SELECT a.*, 
                   u.name as patient_name, 
                   u.email as patient_email,
                   u.phone as patient_phone,
                   d.name as doctor_name,
                   d.specialization as doctor_specialization
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        ");

        // Get services for each appointment
        foreach ($appointments as $appointment) {
            $services = DB::select("
                SELECT s.id, s.name, s.cost, s.duration
                FROM appointment_services aps
                LEFT JOIN services s ON aps.service_id = s.id
                WHERE aps.appointment_id = ?
            ", [$appointment->id]);
            $appointment->services = $services;
        }

        return response()->json($appointments);
    }

    /**
     * Get appointments by user ID.
     */
    public function getByUser($userId)
    {
        $appointments = DB::select("
            SELECT a.*, 
                   d.name as doctor_name,
                   d.specialization as doctor_specialization
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        ", [$userId]);

        foreach ($appointments as $appointment) {
            $services = DB::select("
                SELECT s.id, s.name, s.cost, s.duration
                FROM appointment_services aps
                LEFT JOIN services s ON aps.service_id = s.id
                WHERE aps.appointment_id = ?
            ", [$appointment->id]);
            $appointment->services = $services;
        }

        return response()->json($appointments);
    }

    /**
     * Store a newly created appointment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|string',
            'total_cost' => 'required|numeric',
            'total_duration' => 'required|integer',
            'payment_method' => 'required|string',
            'service_ids' => 'required|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        // Check if time slot is available
        $timeSlotCheck = DB::select("
            SELECT * FROM time_slots 
            WHERE doctor_id = ? 
            AND start_time = ? 
            AND status = 'Available'
        ", [$validated['doctor_id'], $validated['appointment_time']]);

        if (empty($timeSlotCheck)) {
            return response()->json([
                'success' => false,
                'message' => 'Selected time slot is not available'
            ], 422);
        }

        // Insert appointment
        DB::insert(
            "INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, total_cost, total_duration, payment_method, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', NOW(), NOW())",
            [
                $validated['user_id'],
                $validated['doctor_id'],
                $validated['appointment_date'],
                $validated['appointment_time'],
                $validated['total_cost'],
                $validated['total_duration'],
                $validated['payment_method']
            ]
        );

        // Get the newly created appointment
        $appointment = DB::select("SELECT * FROM appointments ORDER BY id DESC LIMIT 1");
        $appointmentId = $appointment[0]->id;

        // Insert appointment services
        foreach ($validated['service_ids'] as $serviceId) {
            DB::insert(
                "INSERT INTO appointment_services (appointment_id, service_id, created_at, updated_at) 
                 VALUES (?, ?, NOW(), NOW())",
                [$appointmentId, $serviceId]
            );
        }

        // Mark time slot as booked
        DB::update(
            "UPDATE time_slots 
             SET status = 'Booked' 
             WHERE doctor_id = ? 
             AND start_time = ?",
            [$validated['doctor_id'], $validated['appointment_time']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'appointment' => $appointment[0]
        ]);
    }

    /**
     * Display the specified appointment.
     */
    public function show($id)
    {
        $appointment = DB::select("
            SELECT a.*, 
                   u.name as patient_name, 
                   u.email as patient_email,
                   u.phone as patient_phone,
                   d.name as doctor_name,
                   d.specialization as doctor_specialization
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?
        ", [$id]);

        if (empty($appointment)) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $services = DB::select("
            SELECT s.id, s.name, s.cost, s.duration
            FROM appointment_services aps
            LEFT JOIN services s ON aps.service_id = s.id
            WHERE aps.appointment_id = ?
        ", [$id]);

        $appointment[0]->services = $services;

        return response()->json($appointment[0]);
    }

    /**
     * Update the specified appointment status.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled,Completed',
        ]);

        $existing = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $oldStatus = $existing[0]->status;

        DB::update(
            "UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?",
            [$validated['status'], $id]
        );

        // If cancelled, free up the time slot
        if ($validated['status'] === 'Cancelled') {
            DB::update(
                "UPDATE time_slots 
                 SET status = 'Available' 
                 WHERE doctor_id = ? 
                 AND start_time = ?",
                [$existing[0]->doctor_id, $existing[0]->appointment_time]
            );
        }

        $appointment = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment[0]
        ]);
    }

    /**
     * Remove the specified appointment.
     */
    public function destroy($id)
    {
        $appointment = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);
        if (empty($appointment)) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $appointment = $appointment[0];

        // Free up the time slot
        DB::update(
            "UPDATE time_slots 
             SET status = 'Available' 
             WHERE doctor_id = ? 
             AND start_time = ?",
            [$appointment->doctor_id, $appointment->appointment_time]
        );

        // Delete appointment services first (foreign key constraint)
        DB::delete("DELETE FROM appointment_services WHERE appointment_id = ?", [$id]);
        
        // Delete appointment
        DB::delete("DELETE FROM appointments WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }
}