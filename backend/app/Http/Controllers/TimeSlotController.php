<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeSlotController extends Controller
{
    /**
     * Display all time slots (admin view).
     */
    public function index()
    {
        $slots = DB::select("
            SELECT ts.*, d.name as doctor_name, d.specialization as doctor_specialization
            FROM time_slots ts
            LEFT JOIN doctors d ON ts.doctor_id = d.id
            ORDER BY ts.date ASC, ts.start_time ASC
        ");
        return response()->json($slots);
    }

    /**
     * Get time slots by doctor ID.
     * Optionally filter by date: /api/timeslots/doctor/1?date=2026-03-25
     */
    public function getByDoctor($doctorId, Request $request)
    {
        $date = $request->query('date'); // optional date filter

        if ($date) {
            // Return slots for a specific date
            $slots = DB::select("
                SELECT * FROM time_slots
                WHERE doctor_id = ? AND date = ?
                ORDER BY start_time
            ", [$doctorId, $date]);
        } else {
            // Return all slots for this doctor ordered by date then time
            $slots = DB::select("
                SELECT * FROM time_slots
                WHERE doctor_id = ?
                ORDER BY date ASC, start_time ASC
            ", [$doctorId]);
        }

        return response()->json($slots);
    }

    /**
     * Store a newly created time slot.
     * Now uses 'date' instead of 'day'.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id'  => 'required|exists:doctors,id',
            'date'       => 'required|date|after_or_equal:today', // must be today or future
            'start_time' => 'required|date_format:H:i',           // enforces HH:MM format
            'end_time'   => 'required|date_format:H:i|after:start_time',
            'status'     => 'required|in:Available,Booked',
        ]);

        // Derive day name from date for display (e.g. "Monday")
        $dayName = date('l', strtotime($validated['date']));

        // Check for overlapping time slots on same doctor + same date
        $overlap = DB::select("
            SELECT * FROM time_slots
            WHERE doctor_id = ?
            AND date = ?
            AND status = 'Available'
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (start_time >= ? AND end_time <= ?)
            )
        ", [
            $validated['doctor_id'],
            $validated['date'],
            $validated['start_time'], $validated['start_time'],
            $validated['end_time'],   $validated['end_time'],
            $validated['start_time'], $validated['end_time']
        ]);

        if (!empty($overlap)) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot overlaps with an existing slot on this date'
            ], 422);
        }

        DB::insert(
            "INSERT INTO time_slots (doctor_id, date, day, start_time, end_time, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['doctor_id'],
                $validated['date'],
                $dayName,                 // auto-derived from date
                $validated['start_time'],
                $validated['end_time'],
                $validated['status']
            ]
        );

        $slot = DB::select("SELECT * FROM time_slots ORDER BY id DESC LIMIT 1");

        return response()->json([
            'success' => true,
            'message' => 'Time slot created successfully',
            'slot'    => $slot[0]
        ], 201);
    }

    /**
     * Update the specified time slot.
     */
    public function update(Request $request, $id)
    {
        $existing = DB::select("SELECT * FROM time_slots WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Time slot not found'], 404);
        }

        $validated = $request->validate([
            'doctor_id'  => 'required|exists:doctors,id',
            'date'       => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
            'status'     => 'required|in:Available,Booked',
        ]);

        $dayName = date('l', strtotime($validated['date']));

        DB::update(
            "UPDATE time_slots
             SET doctor_id = ?, date = ?, day = ?, start_time = ?, end_time = ?, status = ?, updated_at = NOW()
             WHERE id = ?",
            [
                $validated['doctor_id'],
                $validated['date'],
                $dayName,
                $validated['start_time'],
                $validated['end_time'],
                $validated['status'],
                $id
            ]
        );

        $slot = DB::select("SELECT * FROM time_slots WHERE id = ?", [$id]);
        return response()->json([
            'success' => true,
            'message' => 'Time slot updated successfully',
            'slot'    => $slot[0]
        ]);
    }

    /**
     * Remove the specified time slot.
     */
    public function destroy($id)
    {
        $slot = DB::select("SELECT * FROM time_slots WHERE id = ?", [$id]);
        if (empty($slot)) {
            return response()->json(['message' => 'Time slot not found'], 404);
        }

        // Block deletion if slot is already booked
        if ($slot[0]->status === 'Booked') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a booked slot. Cancel the appointment first.'
            ], 422);
        }

        DB::delete("DELETE FROM time_slots WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Time slot deleted successfully'
        ]);
    }
}