<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Factura extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'cliente_id',
        'numero_factura',
        'fecha_emision',
        'fecha_vencimiento',
        'subtotal',
        'descuento',
        'impuesto',
        'total',
        'total_costo',
        'estado',
        'notas',
        'user_id',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_vencimiento' => 'date',
        'subtotal' => 'decimal:2',
        'descuento' => 'decimal:2',
        'impuesto' => 'decimal:2',
        'total' => 'decimal:2',
        'total_costo' => 'decimal:2',
    ];

    // Relaciones
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Factura_item::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Métodos auxiliares
    

    public static function generarNumeroFactura(): string
    {
        $ultimaFactura = self::latest('id')->first();
        $numero = $ultimaFactura ? intval(substr($ultimaFactura->numero_factura, 4)) + 1 : 1;
        
        return 'FAC-' . str_pad($numero, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Calcula la fecha de vencimiento basada en el plazo del cliente
     */
    public function calcularFechaVencimiento(): void
    {
        if ($this->cliente && $this->fecha_emision) {
            $this->fecha_vencimiento = Carbon::parse($this->fecha_emision)
                ->addDays($this->cliente->plazo_dias);
        }
    }

    /**
     * Recalcula los totales de la factura basándose en sus items
     */
    public function recalcularTotales(): void
    {
        $this->total_costo = $this->items->sum('total_costo');
        $this->subtotal = $this->items->sum('subtotal');
        $this->total = $this->subtotal - $this->descuento + $this->impuesto;
        $this->save();
    }

    /**
     * Calcula la utilidad de la factura
     */
    public function calcularUtilidad(): float
    {
        return $this->total - $this->total_costo;
    }

    /**
     * Calcula el margen de utilidad en porcentaje
     */
    public function calcularMargenUtilidad(): float
    {
        if ($this->total_costo == 0) {
            return 0;
        }
        
        return (($this->total - $this->total_costo) / $this->total_costo) * 100;
    }

    /**
     * Verifica si la factura está vencida
     */
    public function estaVencida(): bool
    {
        return $this->estado === 'emitida' 
            && $this->fecha_vencimiento 
            && $this->fecha_vencimiento->isPast();
    }

    public function diasParaVencimiento(): int
    {
        if (!$this->fecha_vencimiento) {
            return 0;
        }
        
        return Carbon::today()->diffInDays($this->fecha_vencimiento, false);
    }

    public function getTotalAttribute()
    {
        return $this->items()
            ->where('es_venta', true)
            ->get()
            ->sum(function ($item) {
                return $item->cantidad * $item->precio_venta_unitario - $item->descuento;
            });
    }

    
    public function scopeEmitidas($query)
    {
        return $query->where('estado', 'emitida');
    }

    public function scopeVencidas($query)
    {
        return $query->where('estado', 'emitida')
            ->where('fecha_vencimiento', '<', Carbon::today());
    }

    public function scopePorCliente($query, $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_emision', [$fechaInicio, $fechaFin]);
    }
}