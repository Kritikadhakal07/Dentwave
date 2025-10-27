<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = DB::select("
            SELECT id, name, email, phone, gender, role, status, created_at 
            FROM users 
            ORDER BY id DESC
        ");
        return response()->json($users);
    }

    /**
     * Store a newly created user (Admin creating users).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'role' => 'required|in:admin,user,doctor',
            'status' => 'required|in:Active,Inactive,Pending',
        ]);

        $hashedPassword = Hash::make($validated['password']);

        DB::insert(
            "INSERT INTO users (name, email, password, phone, gender, role, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['name'],
                $validated['email'],
                $hashedPassword,
                $validated['phone'] ?? null,
                $validated['gender'] ?? null,
                $validated['role'],
                $validated['status']
            ]
        );

        $user = DB::select("
            SELECT id, name, email, phone, gender, role, status, created_at 
            FROM users 
            ORDER BY id DESC 
            LIMIT 1
        ");

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user' => $user[0]
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = DB::select("
            SELECT id, name, email, phone, gender, role, status, created_at 
            FROM users 
            WHERE id = ?
        ", [$id]);

        if (empty($user)) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user[0]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'role' => 'required|in:admin,user,doctor',
            'status' => 'required|in:Active,Inactive,Pending',
            'password' => 'nullable|string|min:6',
        ]);

        $existing = DB::select("SELECT * FROM users WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if email is taken by another user
        $emailCheck = DB::select("SELECT id FROM users WHERE email = ? AND id != ?", [$validated['email'], $id]);
        if (!empty($emailCheck)) {
            return response()->json([
                'success' => false,
                'message' => 'Email already taken by another user'
            ], 422);
        }

        if (isset($validated['password']) && !empty($validated['password'])) {
            // Update with new password
            $hashedPassword = Hash::make($validated['password']);
            DB::update(
                "UPDATE users 
                 SET name = ?, email = ?, password = ?, phone = ?, gender = ?, role = ?, status = ?, updated_at = NOW() 
                 WHERE id = ?",
                [
                    $validated['name'],
                    $validated['email'],
                    $hashedPassword,
                    $validated['phone'] ?? null,
                    $validated['gender'] ?? null,
                    $validated['role'],
                    $validated['status'],
                    $id
                ]
            );
        } else {
            // Update without changing password
            DB::update(
                "UPDATE users 
                 SET name = ?, email = ?, phone = ?, gender = ?, role = ?, status = ?, updated_at = NOW() 
                 WHERE id = ?",
                [
                    $validated['name'],
                    $validated['email'],
                    $validated['phone'] ?? null,
                    $validated['gender'] ?? null,
                    $validated['role'],
                    $validated['status'],
                    $id
                ]
            );
        }

        $user = DB::select("
            SELECT id, name, email, phone, gender, role, status, created_at 
            FROM users 
            WHERE id = ?
        ", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user[0]
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = DB::select("SELECT * FROM users WHERE id = ?", [$id]);
        if (empty($user)) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if user has appointments (if appointments table exists)
        $tableExists = DB::select("SHOW TABLES LIKE 'appointments'");
        if (!empty($tableExists)) {
            $appointments = DB::select("SELECT COUNT(*) as count FROM appointments WHERE user_id = ?", [$id]);
            if ($appointments[0]->count > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user with existing appointments. Please delete or reassign appointments first.'
                ], 422);
            }
        }

        DB::delete("DELETE FROM users WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Update user status only.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Active,Inactive,Pending',
        ]);

        $existing = DB::select("SELECT * FROM users WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'User not found'], 404);
        }

        DB::update(
            "UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?",
            [$validated['status'], $id]
        );

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully'
        ]);
    }
}