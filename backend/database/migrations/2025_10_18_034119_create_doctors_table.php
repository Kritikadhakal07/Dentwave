<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')->constrained()->onDelete('cascade');

    $table->string('name');
    $table->string('specialization');
    $table->string('experience');
    $table->string('contact');

    $table->enum('status', ['Active', 'On Leave', 'Vacation'])->default('Active');

    $table->string('image')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
