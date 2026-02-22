<?php
use App\Http\Controllers\KhaltiController;

Route::get('/khalti/initiate/{appointment_id}', 
    [KhaltiController::class, 'initiate'])->name('khalti.initiate');

Route::get('/khalti/verify', 
    [KhaltiController::class, 'verify'])->name('khalti.verify');