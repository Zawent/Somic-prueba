<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_documento_id',
        'nombre',
        'documento',
        'cupo',
        'plazo_dias',
    ];

    protected $casts = [
        'cupo' => 'decimal:2',
        'plazo_dias' => 'integer',
    ];

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class);
    }



    public function calcularCartera(): float
    {
        return $this->facturas()
            ->where('estado', 'emitida')
            ->sum('total');
    }

    public function calcularCupoDisponible(): float
    {
        return $this->cupo - $this->calcularCartera();
    }

    public function tieneCupoDisponible(float $monto): bool
    {
        return $this->calcularCupoDisponible() >= $monto;
    }

    public function porcentajeCupoUtilizado(): float
    {
        if ($this->cupo == 0) {
            return 0;
        }
        
        return ($this->calcularCartera() / $this->cupo) * 100;
    }

    public function facturasVencidas()
    {
        return $this->facturas()
            ->where('estado', 'emitida')
            ->where('fecha_vencimiento', '<', now())
            ->get();
    }

    public function tieneFacturasVencidas(): bool
    {
        return $this->facturasVencidas()->isNotEmpty();
    }



    
    public function scopeConCupoDisponible($query, float $monto = 0)
    {
        return $query;
    }

    public function scopeConFacturasVencidas($query)
    {
        return $query->whereHas('facturas', function ($q) {
            $q->where('estado', 'emitida')
              ->where('fecha_vencimiento', '<', now());
        });
    }
}