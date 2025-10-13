<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test-connection', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Laravel API is working!'
    ]);
});
