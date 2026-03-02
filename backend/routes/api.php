<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailableSlotController;
use App\Http\Controllers\ContactController;

use App\Http\Controllers\UserController;


Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/users/update/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);




Route::post('/services/update/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);
Route::post('/doctors/update/{id}', [DoctorController::class, 'update']);
Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);


        Route::post('/time-slots', [TimeSlotController::class, 'store']);
        Route::post('/time-slots/update/{id}', [TimeSlotController::class, 'update']);
        Route::delete('/time-slots/{id}', [TimeSlotController::class, 'destroy']);

        Route::get('/time-slots/{doctorId}', [TimeSlotController::class, 'getByDoctor']);
        

        Route::post('/available-slots', [AvailableSlotController::class, 'getAvailableSlots']);
        // Appointment Management (admin can view all, update, delete)
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments/update/{id}', [AppointmentController::class, 'update']);
        Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);


        // Appointment Management (user can view own, update, delete)
        Route::get('/appointments/user/{userId}', [AppointmentController::class, 'getByUser']);
        Route::post('/appointments', [AppointmentController::class, 'store']);