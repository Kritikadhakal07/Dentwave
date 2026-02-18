<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvailableSlotController extends Controller
{
    /**
     * Get available time slots for a doctor on a specific date
     * Based on doctor's schedule, existing appointments, and service duration
     */
    public function getAvailableSlots(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date',
            'service_ids' => 'required|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $doctorId = $validated['doctor_id'];
        $date = $validated['date'];
        $serviceIds = $validated['service_ids'];

        // STEP 1: Calculate total service duration
        $services = DB::select("
            SELECT SUM(duration) as total_duration 
            FROM services 
            WHERE id IN (" . implode(',', array_fill(0, count($serviceIds), '?')) . ")
        ", $serviceIds);
        
        $totalDuration = (int) $services[0]->total_duration;
        if ($totalDuration <= 0) {
    return response()->json([
        'success' => false,
        'message' => 'Service duration is invalid'
    ]);
}
        $bufferTime = 5; // 5 minutes buffer
        $requiredDuration = $totalDuration + $bufferTime;

        // STEP 2: Get doctor's availability for this day
        $dayOfWeek = date('l', strtotime($date)); // Monday, Tuesday, etc.
        
        $doctorSchedules = DB::select("
            SELECT start_time, end_time 
            FROM time_slots 
            WHERE doctor_id = ? 
            AND day = ? 
            AND status = 'Available'
            ORDER BY start_time
        ", [$doctorId, $dayOfWeek]);

        if (empty($doctorSchedules)) {
            return response()->json([
                'success' => false,
                'message' => "No availability on {$dayOfWeek}s",
                'available_slots' => []
            ]);
        }

        // STEP 3: Get existing appointments for this doctor on this date
        $bookedAppointments = DB::select("
            SELECT appointment_time, total_duration 
            FROM appointments 
            WHERE doctor_id = ? 
            AND appointment_date = ? 
            AND status != 'Cancelled'
            ORDER BY appointment_time
        ", [$doctorId, $date]);

        // STEP 4: Calculate available slots
        $availableSlots = [];

        foreach ($doctorSchedules as $schedule) {
            // Convert times to minutes
            $startMinutes = $this->timeToMinutes($schedule->start_time);
            $endMinutes = $this->timeToMinutes($schedule->end_time);

            // Create occupied time blocks from booked appointments
            $occupiedBlocks = [];
            foreach ($bookedAppointments as $appointment) {
                $appointmentStart = $this->timeToMinutes($appointment->appointment_time);
                $appointmentEnd = $appointmentStart + (int)$appointment->total_duration + $bufferTime;
                
                // Only consider if within this schedule window
                if ($appointmentEnd > $startMinutes && $appointmentStart < $endMinutes) {
                    $occupiedBlocks[] = [
                        'start' => max($appointmentStart, $startMinutes),
                        'end' => min($appointmentEnd, $endMinutes)
                    ];
                }
            }

            // Sort occupied blocks by start time
            usort($occupiedBlocks, function($a, $b) {
                return $a['start'] - $b['start'];
            });

            // Find free gaps and generate slots
            $currentTime = $startMinutes;

            foreach ($occupiedBlocks as $block) {
                // Check gap before this occupied block
                if ($block['start'] > $currentTime) {
                    $gapDuration = $block['start'] - $currentTime;
                    
                    // Generate 30-minute interval slots if gap is big enough
                    if ($gapDuration >= $requiredDuration) {
                        $slotTime = $currentTime;
                        while ($slotTime + $requiredDuration <= $block['start']) {
                            $availableSlots[] = [
                                'start_time' => $this->minutesToTime($slotTime),
                                'end_time' => $this->minutesToTime($slotTime + $totalDuration),
                                'duration' => $totalDuration
                            ];
                            $slotTime += 30; // 30-minute intervals
                        }
                    }
                }
                $currentTime = max($currentTime, $block['end']);
            }

            // Check remaining time after last appointment
            if ($endMinutes > $currentTime) {
                $remainingDuration = $endMinutes - $currentTime;
                
                if ($remainingDuration >= $requiredDuration) {
                    $slotTime = $currentTime;
                    while ($slotTime + $requiredDuration <= $endMinutes) {
                        $availableSlots[] = [
                            'start_time' => $this->minutesToTime($slotTime),
                            'end_time' => $this->minutesToTime($slotTime + $totalDuration),
                            'duration' => $totalDuration
                        ];
                        $slotTime += $requiredDuration;
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'available_slots' => $availableSlots,
            'total_duration' => $totalDuration,
            'day' => $dayOfWeek
        ]);
    }

    /**
     * Convert time string (HH:MM) to minutes
     */
    private function timeToMinutes($time)
    {
        list($hours, $minutes) = explode(':', $time);
        return (int)$hours * 60 + (int)$minutes;
    }

    /**
     * Convert minutes to time string (HH:MM)
     */
    private function minutesToTime($minutes)
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        return sprintf('%02d:%02d', $hours, $mins);
    }
}