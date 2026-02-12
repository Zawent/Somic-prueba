<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Factura_item extends Model
{
    use HasFactory;

    protected $fillable = [
        'factura_id',
        'articulo_id',
        'es_venta',
        'cantidad',
        'costo_unitario',
        'precio_venta_unitario',
        'descuento',
        'subtotal',
        'total_costo',
    ];

    protected $casts = [
        'es_venta' => 'boolean',
        'cantidad' => 'integer',
        'costo_unitario' => 'decimal:2',
        'precio_venta_unitario' => 'decimal:2',
        'descuento' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total_costo' => 'decimal:2',
    ];

    // Relaciones
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class);
    }

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class);
    }

    // Métodos auxiliares
    
    public function calcularSubtotal(): void
    {
        $this->subtotal = ($this->cantidad * $this->precio_venta_unitario) - $this->descuento;
    }

    public function calcularTotalCosto(): void
    {
        $this->total_costo = $this->cantidad * $this->costo_unitario;
    }

    public function calcularUtilidad(): float
    {
        return $this->subtotal - $this->total_costo;
    }

    public function calcularMargenUtilidad(): float
    {
        if ($this->total_costo == 0) {
            return 0;
        }
        
        return (($this->subtotal - $this->total_costo) / $this->total_costo) * 100;
    }

    public function actualizarSaldoArticulo(): void
    {
        if ($this->articulo) {
            $cantidadMovimiento = $this->es_venta ? -$this->cantidad : $this->cantidad;
            $this->articulo->increment('saldo', $cantidadMovimiento);
        }
    }

    public function revertirSaldoArticulo(): void
    {
        if ($this->articulo) {
            $cantidadMovimiento = $this->es_venta ? $this->cantidad : -$this->cantidad;
            $this->articulo->increment('saldo', $cantidadMovimiento);
        }
    }

    protected static function booted(): void
    {
        static::creating(function ($item) {
            $item->calcularSubtotal();
            $item->calcularTotalCosto();
        });

        static::created(function ($item) {
            $item->actualizarSaldoArticulo();
            $item->factura->recalcularTotales();
        });

        static::updating(function ($item) {
            $item->calcularSubtotal();
            $item->calcularTotalCosto();
        });

        static::updated(function ($item) {
            $item->factura->recalcularTotales();
        });

        static::deleting(function ($item) {
            $item->revertirSaldoArticulo();
        });

        static::deleted(function ($item) {
            $item->factura->recalcularTotales();
        });
    }
}