<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factura_items', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('factura_id')
                ->constrained('facturas')
                ->onDelete('cascade'); // Si se elimina la factura, se eliminan sus items
            
            // Relación con artículo
            $table->foreignId('articulo_id')
                ->constrained('articulos')
                ->onDelete('restrict');
            
            // Naturaleza del movimiento: true = venta (+), false = devolución/ajuste (-)
            $table->boolean('es_venta')->default(true);
            
            // Cantidad de artículos
            $table->integer('cantidad');
            
            $table->decimal('costo_unitario', 12, 2);
            $table->decimal('precio_venta_unitario', 12, 2);
            
            $table->decimal('descuento', 12, 2)->default(0);
            
            $table->decimal('subtotal', 12, 2);
            
            $table->decimal('total_costo', 12, 2);
            
            $table->timestamps();
            
            $table->index(['factura_id', 'articulo_id']);
            $table->index('articulo_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factura_items');
    }
};