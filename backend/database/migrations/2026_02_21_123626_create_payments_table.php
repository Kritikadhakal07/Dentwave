<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Relationship with appointment
            $table->foreignId('appointment_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Khalti specific
            $table->string('pidx')->nullable(); // Khalti unique identifier
            $table->string('transaction_id')->nullable(); // Khalti transaction code

            // Payment details
            $table->decimal('amount', 10, 2); // store in rupees
            $table->string('gateway')->default('Khalti');

            // Status of payment
            $table->enum('status', [
                'Pending',
                'Completed',
                'Failed'
            ])->default('Pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};