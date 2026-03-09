<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'doctor_id',
        'appointment_date',
        'appointment_time',
        'total_cost',
        'total_duration',
        'payment_method',
        'status',
    ];

    // One appointment has one payment
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}