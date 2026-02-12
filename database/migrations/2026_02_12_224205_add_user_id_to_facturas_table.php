<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('facturas', function (Blueprint $table) {
            // Agregar columna user_id como clave foránea
            $table->foreignId('user_id')
                  ->nullable() // solo si quieres permitir nulos (opcional)
                  ->after('cliente_id')
                  ->constrained('users')
                  ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};