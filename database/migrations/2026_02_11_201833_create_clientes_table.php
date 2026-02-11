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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tipo_documento_id')
                ->constrained('tipo_documentos')
                ->onDelete('restrict');

            $table->string('nombre');
            $table->string('documento')->unique();

            $table->decimal('cupo', 15, 2)->default(0);
            $table->unsignedInteger('plazo_dias')->default(0);

            $table->timestamps();
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
