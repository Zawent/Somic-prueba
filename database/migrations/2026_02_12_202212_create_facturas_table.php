<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')
                ->constrained('clientes')
                ->onDelete('restrict');

            $table->string('numero_factura')->unique();
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento');
            
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('impuesto', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            
            $table->decimal('total_costo', 15, 2)->default(0);
            
            $table->enum('estado', ['borrador', 'emitida', 'pagada', 'anulada'])
                ->default('borrador');
            
            $table->text('notas')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('numero_factura');
            $table->index('fecha_emision');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};