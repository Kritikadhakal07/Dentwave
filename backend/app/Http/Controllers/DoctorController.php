<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{

    // Fetch doctor profile
    public function getProfile($id)
    {
        $doctor = DB::select('SELECT * FROM doctors WHERE id = ?', [$id]);

        if (empty($doctor)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        return response()->json($doctor[0]);
    }

    // Update doctor profile
    public function updateProfile(Request $request, $id)
    {
        $doctor = DB::select('SELECT * FROM doctors WHERE id = ?', [$id]);

        if (empty($doctor)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        $name           = $request->input('name');
        $specialization = $request->input('specialization');
        $experience     = $request->input('experience');
        $contact        = $request->input('contact');
        $status         = $request->input('status', 'Active');
        $imagePath      = null;

        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $fileName  = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/doctor_images'), $fileName);
            $imagePath = 'uploads/doctor_images/' . $fileName;
        }

        if ($imagePath) {
            DB::update(
                'UPDATE doctors SET name = ?, specialization = ?, experience = ?, contact = ?, status = ?, image = ?, updated_at = NOW() WHERE id = ?',
                [$name, $specialization, $experience, $contact, $status, $imagePath, $id]
            );
        } else {
            DB::update(
                'UPDATE doctors SET name = ?, specialization = ?, experience = ?, contact = ?, status = ?, updated_at = NOW() WHERE id = ?',
                [$name, $specialization, $experience, $contact, $status, $id]
            );
        }

        return response()->json(['message' => 'Profile updated successfully']);
    }
    public function index()
    {
        $doctors = DB::select("SELECT * FROM doctors ORDER BY id DESC");
        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|min:6',
            'specialization' => 'required|string',
            'experience'     => 'required|string',
            'contact'        => 'required|string',
            'status'         => 'required|in:Active,On Leave,Vacation',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Create login account for doctor in users table
            $userId = DB::table('users')->insertGetId([
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'password'   => Hash::make($validated['password']),
                'role'       => 'doctor',
                'status'     => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Upload image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('doctors', 'public');
            }

            // Insert doctor profile linked to user
            DB::insert(
                "INSERT INTO doctors (user_id, name, specialization, experience, contact, status, image, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
                [
                    $userId,
                    $validated['name'],
                    $validated['specialization'],
                    $validated['experience'],
                    $validated['contact'],
                    $validated['status'],
                    $imagePath,
                ]
            );

            DB::commit();

            $doctor = DB::select("SELECT * FROM doctors ORDER BY id DESC LIMIT 1");

            return response()->json([
                'success' => true,
                'doctor'  => $doctor[0],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'specialization' => 'required|string',
            'experience'     => 'required|string',
            'contact'        => 'required|string',
            'status'         => 'required|in:Active,On Leave,Vacation',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $existing = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        $existing = $existing[0];

        // Handle image upload — delete old one if replaced
        $imagePath = $existing->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('doctors', 'public');
        }

        // Update doctors table
        DB::update(
            "UPDATE doctors SET name = ?, specialization = ?, experience = ?, contact = ?, status = ?, image = ?, updated_at = NOW() WHERE id = ?",
            [
                $validated['name'],
                $validated['specialization'],
                $validated['experience'],
                $validated['contact'],
                $validated['status'],
                $imagePath,
                $id,
            ]
        );

        // ── Sync name back to users table so login/header stays in sync ──
        if ($existing->user_id) {
            DB::update(
                "UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?",
                [$validated['name'], $existing->user_id]
            );
        }

        $doctor = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        return response()->json([
            'success' => true,
            'doctor'  => $doctor[0],
        ]);
    }

    public function destroy($id)
    {
        $doctor = DB::select("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (empty($doctor)) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        $doctor = $doctor[0];

        // Delete image from storage
        if ($doctor->image && Storage::disk('public')->exists($doctor->image)) {
            Storage::disk('public')->delete($doctor->image);
        }

        DB::delete("DELETE FROM doctors WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Doctor deleted successfully',
        ]);
    }
}