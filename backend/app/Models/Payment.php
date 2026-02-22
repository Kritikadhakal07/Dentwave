<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'appointment_id',
        'pidx',
        'transaction_id',
        'amount',
        'gateway',
        'status',
    ];

    // A payment belongs to one appointment
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
