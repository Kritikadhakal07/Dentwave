<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Validator; 
use Illuminate\Support\Facades\Hash;      
use Illuminate\Support\Facades\Auth;      
use App\Models\User; 
use Illuminate\Http\Request;



class AuthController extends Controller
{
    public function register(Request $request){
        
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ],422);
        }
        
    

    $user=User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'phone' => $request->phone,
        'gender' => $request->gender,
        'role' => 'user'

    ]);

    return response()->json([
        'success' => true,
        'message' => 'User created successfully',
        'user' => $user
    ]);

}



public function login(Request $request){
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {  // ✅ fixed typo
        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();

    return response()->json([
        'success' => true,
        'message' => 'User logged in successfully',
        'user' => $user,
        'token' => $user->createToken('auth_token')->plainTextToken
    ]);
}



}
