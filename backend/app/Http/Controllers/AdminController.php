<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Fetch admin profile
    public function getProfile($id)
    {
        $admin = DB::select('SELECT * FROM users WHERE id = ? AND role = ?', [$id, 'admin']);

        if (empty($admin)) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        return response()->json($admin[0]);
    }

    // Update admin profile
    public function updateProfile(Request $request, $id)
    {
        $admin = DB::select('SELECT * FROM users WHERE id = ? AND role = ?', [$id, 'admin']);

        if (empty($admin)) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $name = $request->input('name');
        $email = $request->input('email');
        $phone = $request->input('phone');
        $position = $request->input('position');
        $imagePath = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/admin_images'), $fileName);
            $imagePath = 'uploads/admin_images/' . $fileName;
        }

        if ($imagePath) {
            DB::update(
                'UPDATE users SET name = ?, email = ?, phone = ?, position = ?, image = ?, updated_at = NOW() WHERE id = ?',
                [$name, $email, $phone, $position, $imagePath, $id]
            );
        } else {
            DB::update(
                'UPDATE users SET name = ?, email = ?, phone = ?, position = ?, updated_at = NOW() WHERE id = ?',
                [$name, $email, $phone, $position, $id]
            );
        }

        return response()->json(['message' => 'Profile updated successfully']);
    }
}


