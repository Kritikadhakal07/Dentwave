<?php
use App\Http\Controllers\KhaltiController;
<<<<<<< HEAD

Route::get('/khalti/initiate/{appointment_id}', 
    [KhaltiController::class, 'initiate'])->name('khalti.initiate');

Route::get('/khalti/verify', 
    [KhaltiController::class, 'verify'])->name('khalti.verify');




    
=======
use Illuminate\Support\Facades\Route;

Route::get('/khalti/initiate/{appointment_id}', [KhaltiController::class, 'initiate'])->name('khalti.initiate');
Route::get('/khalti/verify', [KhaltiController::class, 'verify'])->name('khalti.verify');
>>>>>>> 6cfd2d750d6760e876a27467b7c20955a1c20a8b
