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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
             $table->string('name');
            $table->text('description')->nullable();
            $table->string('duration')->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->text('key_benefits')->nullable();
            $table->text('procedure_overview')->nullable();

            $table->string('image')->nullable(); // store image path or URL
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
