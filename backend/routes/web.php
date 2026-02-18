<?php

use App\Http\Controllers\PaymentController;

Route::get('payment/{appointmentId}', [PaymentController::class, 'redirectToEsewa'])->name('payment.redirect');
Route::get('payment-success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('payment-failure', [PaymentController::class, 'failure'])->name('payment.failure');
