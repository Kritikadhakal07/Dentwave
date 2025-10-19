<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator; 
use Illuminate\Support\Facades\Hash;      
use Illuminate\Support\Facades\Auth;      
use Illuminate\Support\Facades\DB;
use App\Models\User; 
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Register a new user (Public registration).
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'phone' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Using raw SQL for consistency
        DB::insert(
            "INSERT INTO users (name, email, password, phone, gender, role, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 'Patient', 'Active', NOW(), NOW())",
            [
                $request->name,
                $request->email,
                Hash::make($request->password),
                $request->phone,
                $request->gender
            ]
        );

        $user = DB::select("SELECT * FROM users WHERE email = ?", [$request->email]);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user[0]->id,
                'name' => $user[0]->name,
                'email' => $user[0]->email,
                'phone' => $user[0]->phone,
                'role' => $user[0]->role,
                'status' => $user[0]->status
            ]
        ], 201);
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Check if user is active
        if ($user->status !== 'Active') {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account is not active. Please contact support.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status
            ],
            'token' => $token
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'User logged out successfully'
        ]);
    }

    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'gender' => $user->gender,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at
            ]
        ]);
    }

    /**
     * Update authenticated user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'password' => 'nullable|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->filled('password')) {
            DB::update(
                "UPDATE users SET name = ?, phone = ?, gender = ?, password = ?, updated_at = NOW() WHERE id = ?",
                [
                    $request->name,
                    $request->phone,
                    $request->gender,
                    Hash::make($request->password),
                    $user->id
                ]
            );
        } else {
            DB::update(
                "UPDATE users SET name = ?, phone = ?, gender = ?, updated_at = NOW() WHERE id = ?",
                [
                    $request->name,
                    $request->phone,
                    $request->gender,
                    $user->id
                ]
            );
        }

        $updatedUser = DB::select("SELECT * FROM users WHERE id = ?", [$user->id]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $updatedUser[0]->id,
                'name' => $updatedUser[0]->name,
                'email' => $updatedUser[0]->email,
                'phone' => $updatedUser[0]->phone,
                'gender' => $updatedUser[0]->gender,
                'role' => $updatedUser[0]->role,
                'status' => $updatedUser[0]->status
            ]
        ]);
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 401);
        }

        DB::update(
            "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
            [Hash::make($request->new_password), $user->id]
        );

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }
}