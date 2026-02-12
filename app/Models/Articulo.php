<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Articulo extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nombre',
        'laboratorio',
        'saldo',
        'costo',
        'precio_venta',
    ];

    protected $casts = [
        'saldo' => 'integer',
        'costo' => 'decimal:2',
        'precio_venta' => 'decimal:2',
    ];

    public function facturaItems(): HasMany
    {
        return $this->hasMany(FacturaItem::class);
    }


    
    public function tieneSaldoDisponible(int $cantidad): bool
    {
        return $this->saldo >= $cantidad;
    }

    public function calcularMargenUtilidad(): float
    {
        if ($this->costo == 0) {
            return 0;
        }
        
        return (($this->precio_venta - $this->costo) / $this->costo) * 100;
    }

    public function calcularUtilidadUnitaria(): float
    {
        return $this->precio_venta - $this->costo;
    }

    public function calcularValorInventario(): float
    {
        return $this->saldo * $this->costo;
    }

    public function obtenerHistorialMovimientos()
    {
        return $this->facturaItems()
            ->with(['factura.cliente'])
            ->orderBy('created_at', 'desc')
            ->get();
    }


    public function calcularVentasPeriodo($fechaInicio, $fechaFin): int
    {
        return $this->facturaItems()
            ->whereHas('factura', function ($q) use ($fechaInicio, $fechaFin) {
                $q->whereBetween('fecha_emision', [$fechaInicio, $fechaFin])
                  ->where('estado', '!=', 'anulada');
            })
            ->where('es_venta', true)
            ->sum('cantidad');
    }


    public function calcularIngresosPeriodo($fechaInicio, $fechaFin): float
    {
        return $this->facturaItems()
            ->whereHas('factura', function ($q) use ($fechaInicio, $fechaFin) {
                $q->whereBetween('fecha_emision', [$fechaInicio, $fechaFin])
                  ->where('estado', '!=', 'anulada');
            })
            ->where('es_venta', true)
            ->sum('subtotal');
    }



    // Scopes
    public function scopeConStock($query)
    {
        return $query->where('saldo', '>', 0);
    }

    public function scopeSinStock($query)
    {
        return $query->where('saldo', '<=', 0);
    }

    public function scopeStockBajo($query, int $cantidadMinima = 10)
    {
        return $query->where('saldo', '>', 0)
                     ->where('saldo', '<=', $cantidadMinima);
    }

    public function scopePorLaboratorio($query, string $laboratorio)
    {
        return $query->where('laboratorio', $laboratorio);
    }
}