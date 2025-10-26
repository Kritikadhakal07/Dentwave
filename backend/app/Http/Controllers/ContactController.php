<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller{
    //store contact message
    public function store(Request $request){
        //validate incoming request

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        //Save to database
        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
        ]);


        //return JSON response
        return response()-> json([
            'success' => true,
            'message' => 'Message sent successfully!'
        ]);
    }
}