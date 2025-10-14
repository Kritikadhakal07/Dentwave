<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator; // ✅ add this
use Illuminate\Support\Facades\Hash;      // ✅ add this
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


}
