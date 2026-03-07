<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;



class AppointmentController extends Controller
{
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

        foreach ($appointments as $appointment) {
            $services = DB::select("
                SELECT s.id, s.name, s.cost, s.duration
                FROM appointments_services aps
                LEFT JOIN services s ON aps.service_id = s.id
                WHERE aps.appointment_id = ?
            ", [$appointment->id]);
            $appointment->services = $services;
        }

        return response()->json($appointments);
    }

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
                FROM appointments_services aps
                LEFT JOIN services s ON aps.service_id = s.id
                WHERE aps.appointment_id = ?
            ", [$appointment->id]);
            $appointment->services = $services;
        }

        return response()->json($appointments);
    }

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

        // Check for time slot conflicts (with 5-minute buffer)
        $bufferTime = 5;
        $requiredDuration = $validated['total_duration'] + $bufferTime;
        
        $appointmentStart = $this->timeToMinutes($validated['appointment_time']);
        $appointmentEnd = $appointmentStart + $requiredDuration;

        $conflicts = DB::select("
            SELECT * FROM appointments 
            WHERE doctor_id = ? 
            AND appointment_date = ? 
            AND status != 'Cancelled'
        ", [$validated['doctor_id'], $validated['appointment_date']]);

        foreach ($conflicts as $existing) {
            $existingStart = $this->timeToMinutes($existing->appointment_time);
            $existingEnd = $existingStart + (int)$existing->total_duration + $bufferTime;

            // Check if times overlap
            if ($appointmentStart < $existingEnd && $appointmentEnd > $existingStart) {
                return response()->json([
                    'success' => false,
                    'message' => 'This time slot conflicts with an existing appointment'
                ], 422);
            }
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

        $appointment = DB::select("SELECT * FROM appointments ORDER BY id DESC LIMIT 1");
        $appointmentId = $appointment[0]->id;

        // Insert appointment services
        foreach ($validated['service_ids'] as $serviceId) {
            DB::insert(
                "INSERT INTO appointments_services (appointment_id, service_id, created_at, updated_at) 
                 VALUES (?, ?, NOW(), NOW())",
                [$appointmentId, $serviceId]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'appointment' => $appointment[0]
        ]);
    }

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
            FROM appointments_services aps
            LEFT JOIN services s ON aps.service_id = s.id
            WHERE aps.appointment_id = ?
        ", [$id]);

        $appointment[0]->services = $services;

        return response()->json($appointment[0]);
    }



public function update(Request $request, $id)
{
    $validated = $request->validate([
        'status' => 'required|in:Pending,Confirmed,Cancelled,Completed',
    ]);

    $existing = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);
    if (empty($existing)) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    $appointment = $existing[0];

    // Soft delete logic — when admin sets status to Cancelled
    if ($validated['status'] === 'Cancelled') {

        // Check if a completed Khalti payment exists for this appointment
        $payment = \App\Models\Payment::where('appointment_id', $id)
            ->where('status', 'Completed')
            ->where('gateway', 'Khalti')
            ->first();

        // Build notification message
        $refundNote = $payment
            ? "Your appointment has been cancelled by the admin. Since you paid via Khalti, please contact support for your refund of Rs. " . number_format($payment->amount, 2) . "."
            : "Your appointment has been cancelled by the admin.";

        // Create in-app notification for the user
        \App\Models\Notification::create([
            'user_id' => $appointment->user_id,
            'title'   => 'Appointment Cancelled',
            'message' => $refundNote,
            'type'    => 'danger',
        ]);

        // Soft delete: mark appointment as Cancelled
        DB::update(
            "UPDATE appointments SET status = 'Cancelled', updated_at = NOW() WHERE id = ?",
            [$id]
        );

        $updated = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);

        return response()->json([
            'success'      => true,
            'message'      => 'Appointment cancelled. User has been notified.',
            'refund_notice' => $payment
                ? 'Khalti payment detected. User notified to contact support for refund of Rs. ' . number_format($payment->amount, 2) . '.'
                : null,
            'appointment'  => $updated[0],
        ]);
    }

    // Normal status update (Confirmed, Completed, Pending)
    DB::update(
        "UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?",
        [$validated['status'], $id]
    );

    $updated = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);

    return response()->json([
        'success'     => true,
        'message'     => 'Appointment updated successfully',
        'appointment' => $updated[0],
    ]);
}

    public function destroy($id)
    {
        $appointment = DB::select("SELECT * FROM appointments WHERE id = ?", [$id]);
        if (empty($appointment)) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        DB::delete("DELETE FROM appointments_services WHERE appointment_id = ?", [$id]);
        DB::delete("DELETE FROM appointments WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }

    private function timeToMinutes($time)
    {
        list($hours, $minutes) = explode(':', $time);
        return (int)$hours * 60 + (int)$minutes;
    }
}