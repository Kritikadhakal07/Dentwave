<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = DB::select("SELECT * FROM doctors ORDER BY id DESC");
        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string',
            'experience' => 'required|string',
            'contact' => 'required|string',
            'status' => 'required|in:Active,On Leave,Vacation',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('doctors', 'public');
        }

        DB::insert(
            "INSERT INTO doctors (name, specialization, experience, contact, status, image, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['name'],
                $validated['specialization'],
                $validated['experience'],
                $validated['contact'],
                $validated['status'],
                $imagePath
            ]
        );

        $doctor = DB::select("SELECT * FROM doctors ORDER BY id DESC LIMIT 1");
        return response()->json($doctor[0]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string',
            'experience' => 'required|string',
            'contact' => 'required|string',
            'status' => 'required|in:Active,On Leave,Vacation',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $existing = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        $existing = $existing[0];

        $imagePath = $existing->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('doctors', 'public');
        }

        DB::update(
            "UPDATE doctors SET name = ?, specialization = ?, experience = ?, contact = ?, status = ?, image = ?, updated_at = NOW() WHERE id = ?",
            [
                $validated['name'],
                $validated['specialization'],
                $validated['experience'],
                $validated['contact'],
                $validated['status'],
                $imagePath,
                $id
            ]
        );

        $doctor = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        return response()->json($doctor[0]);
    }

    public function destroy($id)
    {
        $doctor = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (empty($doctor)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        $doctor = $doctor[0];

        if ($doctor->image && Storage::disk('public')->exists($doctor->image)) {
            Storage::disk('public')->delete($doctor->image);
        }

        DB::delete("DELETE FROM doctors WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Doctor deleted successfully'
        ]);
    }
}