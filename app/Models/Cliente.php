<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $fillable = [
        'nombre',
        'tipo_documento_id',
        'documento',
        'cupo',
        'plazo_dias'
    ];

    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    public function getPlazoEnMesesAttribute()
    {
        return round($this->plazo_dias / 30);
    }
}

