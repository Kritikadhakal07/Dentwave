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
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorProfileController;

// ── Auth ──────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Users ─────────────────────────────────────────────────────
Route::get('/users',              [UserController::class, 'index']);
Route::post('/users',             [UserController::class, 'store']);
Route::get('/users/{id}',         [UserController::class, 'show']);
Route::post('/users/update/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}',      [UserController::class, 'destroy']);

// ── Contact ───────────────────────────────────────────────────
Route::post('/contact', [ContactController::class, 'store']);

// ── Services ──────────────────────────────────────────────────
Route::get('/services',              [ServiceController::class, 'index']);
Route::post('/services',             [ServiceController::class, 'store']);
Route::post('/services/update/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}',      [ServiceController::class, 'destroy']);

// ── Doctors ───────────────────────────────────────────────────
Route::get('/doctors',              [DoctorController::class, 'index']);
Route::post('/doctors',             [DoctorController::class, 'store']);
Route::post('/doctors/update/{id}', [DoctorController::class, 'update']);
Route::delete('/doctors/{id}',      [DoctorController::class, 'destroy']);
Route::get('/doctor/profile/{id}',  [DoctorProfileController::class, 'getProfile']);
Route::post('/doctor/profile/{id}', [DoctorProfileController::class, 'updateProfile']);

// ── Time Slots ────────────────────────────────────────────────
Route::get('/time-slots/{doctorId}',        [TimeSlotController::class, 'getByDoctor']);
Route::post('/time-slots',                  [TimeSlotController::class, 'store']);
Route::post('/time-slots/update/{id}',      [TimeSlotController::class, 'update']);
Route::delete('/time-slots/{id}',           [TimeSlotController::class, 'destroy']);

// ── Available Slots ───────────────────────────────────────────
Route::post('/available-slots', [AvailableSlotController::class, 'getAvailableSlots']);

// ── Appointments ──────────────────────────────────────────────
// ✅ Specific routes FIRST, dynamic {id} routes LAST
Route::get('/appointments/user/{userId}',    [AppointmentController::class, 'getByUser']);
Route::get('/appointments',                  [AppointmentController::class, 'index']);
Route::post('/appointments',                 [AppointmentController::class, 'store']);
Route::post('/appointments/update/{id}',     [AppointmentController::class, 'update']);
Route::delete('/appointments/{id}',          [AppointmentController::class, 'destroy']);

// ── Patients ──────────────────────────────────────────────────
Route::get('/patients',          [PatientController::class, 'index']);
Route::post('/patients',         [PatientController::class, 'store']);
Route::get('/patients/{id}',     [PatientController::class, 'show']);
Route::put('/patients/{id}',     [PatientController::class, 'update']);
Route::delete('/patients/{id}',  [PatientController::class, 'destroy']);

// ── Notifications ─────────────────────────────────────────────
// ✅ Specific routes FIRST, dynamic {id} routes LAST
Route::get('/notifications/user/{userId}',          [NotificationController::class, 'getByUser']);
Route::get('/notifications/unread-count/{userId}',  [NotificationController::class, 'unreadCount']);
Route::post('/notifications/mark-all-read/{userId}',[NotificationController::class, 'markAllRead']);
Route::post('/notifications/{id}/mark-read',        [NotificationController::class, 'markRead']);