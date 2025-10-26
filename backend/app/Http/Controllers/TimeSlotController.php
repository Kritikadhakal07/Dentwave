<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeSlotController extends Controller
{
    /**
     * Display a listing of time slots.
     */
    public function index()
    {
        $slots = DB::select("
            SELECT ts.*, d.name as doctor_name, d.specialization as doctor_specialization
            FROM time_slots ts 
            LEFT JOIN doctors d ON ts.doctor_id = d.id 
            ORDER BY ts.id DESC
        ");
        return response()->json($slots);
    }

    /**
     * Get time slots by doctor ID.
     */
    public function getByDoctor($doctorId)
    {
        $slots = DB::select("
            SELECT * FROM time_slots 
            WHERE doctor_id = ? 
            ORDER BY 
                CASE day
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                END,
                start_time
        ", [$doctorId]);
        
        return response()->json($slots);
    }

    /**
     * Store a newly created time slot.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'status' => 'required|in:Available,Booked',
        ]);

        // Check for overlapping time slots
        $overlap = DB::select("
            SELECT * FROM time_slots 
            WHERE doctor_id = ? 
            AND day = ? 
            AND status = 'Available'
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (start_time >= ? AND end_time <= ?)
            )
        ", [
            $validated['doctor_id'],
            $validated['day'],
            $validated['start_time'], $validated['start_time'],
            $validated['end_time'], $validated['end_time'],
            $validated['start_time'], $validated['end_time']
        ]);

        if (!empty($overlap)) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot overlaps with an existing slot'
            ], 422);
        }

        DB::insert(
            "INSERT INTO time_slots (doctor_id, day, start_time, end_time, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['doctor_id'],
                $validated['day'],
                $validated['start_time'],
                $validated['end_time'],
                $validated['status']
            ]
        );

        $slot = DB::select("SELECT * FROM time_slots ORDER BY id DESC LIMIT 1");
        return response()->json($slot[0]);
    }

    /**
     * Update the specified time slot.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'status' => 'required|in:Available,Booked',
        ]);

        $existing = DB::select("SELECT * FROM time_slots WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Time slot not found'], 404);
        }

        DB::update(
            "UPDATE time_slots 
             SET doctor_id = ?, day = ?, start_time = ?, end_time = ?, status = ?, updated_at = NOW() 
             WHERE id = ?",
            [
                $validated['doctor_id'],
                $validated['day'],
                $validated['start_time'],
                $validated['end_time'],
                $validated['status'],
                $id
            ]
        );

        $slot = DB::select("SELECT * FROM time_slots WHERE id = ?", [$id]);
        return response()->json($slot[0]);
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

        DB::delete("DELETE FROM time_slots WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Time slot deleted successfully'
        ]);
    }
}