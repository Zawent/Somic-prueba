<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    protected $fillable = [
        'nombre',
        'codigo',
        'activo'
    ];

    public function clientes()
    {
        return $this->hasMany(Cliente::class);
    }
}
