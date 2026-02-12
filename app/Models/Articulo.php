<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Articulo extends Model
{
    protected $fillable = [
        'codigo',
        'nombre',
        'laboratorio',
        'saldo',
        'costo',
        'precio_venta',
    ];

    
}
