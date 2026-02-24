<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvailableSlotController extends Controller
{
    public function getAvailableSlots(Request $request)
    {
        $validated = $request->validate([
            'doctor_id'     => 'required|exists:doctors,id',
            'date'          => 'required|date',
            'service_ids'   => 'required|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $doctorId   = $validated['doctor_id'];
        $date       = $validated['date'];
        $serviceIds = $validated['service_ids'];
        $dayOfWeek  = date('l', strtotime($date));

        // STEP 1: Total treatment duration from selected services
        $result = DB::select(
            "SELECT SUM(duration) as total_duration FROM services
             WHERE id IN (" . implode(',', array_fill(0, count($serviceIds), '?')) . ")",
            $serviceIds
        );

        $treatmentDuration = (int) $result[0]->total_duration;

        if ($treatmentDuration <= 0) {
            return response()->json(['success' => false, 'message' => 'Invalid service duration']);
        }

        $bufferTime = 5;
        // slotSize = the full window one appointment occupies (treatment + buffer gap after it)
        $slotSize = $treatmentDuration + $bufferTime;

        // STEP 2: Doctor's working windows for this day of week
        $workingWindows = DB::select(
            "SELECT start_time, end_time FROM time_slots
             WHERE doctor_id = ? AND day = ?
             ORDER BY start_time",
            [$doctorId, $dayOfWeek]
        );

        if (empty($workingWindows)) {
            return response()->json([
                'success'         => false,
                'message'         => "Doctor is not available on {$dayOfWeek}s",
                'available_slots' => []
            ]);
        }

        // STEP 3: Existing appointments block time as: start → (end + buffer)
        $booked = DB::select(
            "SELECT appointment_time, total_duration FROM appointments
             WHERE doctor_id = ? AND appointment_date = ? AND status != 'Cancelled'
             ORDER BY appointment_time",
            [$doctorId, $date]
        );

        $occupiedBlocks = [];
        foreach ($booked as $appt) {
            $start            = $this->toMinutes($appt->appointment_time);
            $end              = $start + (int) $appt->total_duration + $bufferTime;
            $occupiedBlocks[] = ['start' => $start, 'end' => $end];
        }
        usort($occupiedBlocks, fn($a, $b) => $a['start'] - $b['start']);

        // STEP 4: Walk each working window, find free gaps, emit slots
        $availableSlots = [];

        foreach ($workingWindows as $window) {
            $windowStart = $this->toMinutes($window->start_time);
            $windowEnd   = $this->toMinutes($window->end_time);
            $cursor      = $windowStart;

            foreach ($occupiedBlocks as $block) {
                // Ignore blocks fully outside this window
                if ($block['end'] <= $windowStart || $block['start'] >= $windowEnd) {
                    continue;
                }

                // Slots in the free gap BEFORE this block
                $gapEnd = min($block['start'], $windowEnd); // never spill past window
                while ($cursor + $slotSize <= $gapEnd) {
                    $availableSlots[] = [
                        'start_time' => $this->toTime($cursor),
                        'end_time'   => $this->toTime($cursor + $treatmentDuration),
                        'duration'   => $treatmentDuration,
                    ];
                    $cursor += $slotSize;
                }

                // Jump past the occupied block
                $cursor = max($cursor, $block['end']);
            }

            // Slots in the remaining gap AFTER all blocks
            while ($cursor + $slotSize <= $windowEnd) {
                $availableSlots[] = [
                    'start_time' => $this->toTime($cursor),
                    'end_time'   => $this->toTime($cursor + $treatmentDuration),
                    'duration'   => $treatmentDuration,
                ];
                $cursor += $slotSize;
            }
        }

        return response()->json([
            'success'         => true,
            'available_slots' => $availableSlots,
            'total_duration'  => $treatmentDuration,
            'day'             => $dayOfWeek,
        ]);
    }

    private function toMinutes(string $time): int
    {
        [$h, $m] = explode(':', $time);
        return (int)$h * 60 + (int)$m;
    }

    private function toTime(int $minutes): string
    {
        return sprintf('%02d:%02d', intdiv($minutes, 60), $minutes % 60);
    }
}