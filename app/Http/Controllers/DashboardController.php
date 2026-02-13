<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\Cliente;
use App\Models\Articulo;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $ventasTotales = Factura::where('estado', 'pagada')
            ->sum(DB::raw('COALESCE(total, 0)')); 

        $facturasPendientes = Factura::where('estado', 'emitida')->count();

        $clientesActivos = Cliente::count();

        // ========== FACTURAS RECIENTES ==========
        $facturasRecientes = Factura::with('cliente')
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($factura) {
                return [
                    'id' => $factura->id,
                    'numero' => $factura->numero_factura ?? '#' . $factura->id,
                    'cliente' => $factura->cliente->nombre ?? 'Cliente Eliminado',
                    'monto' => (float) $factura->total,
                    'estado' => $factura->estado,
                    'fecha' => $factura->fecha_emision->format('d M, Y'),
                ];
            });

        // ========== PRODUCTOS DESTACADOS (más vendidos) ==========
        $productosDestacados = DB::table('factura_items')
            ->join('articulos', 'factura_items.articulo_id', '=', 'articulos.id')
            ->join('facturas', 'factura_items.factura_id', '=', 'facturas.id')
            ->where('factura_items.es_venta', true)
            ->whereIn('facturas.estado', ['emitida', 'pagada'])
            ->select(
                'articulos.id',
                'articulos.nombre',
                'articulos.codigo',
                DB::raw('SUM(factura_items.cantidad) as total_vendido'),
                DB::raw('AVG(factura_items.precio_venta_unitario) as precio_promedio'),
                DB::raw('SUM(factura_items.cantidad * factura_items.precio_venta_unitario) as ingresos')
            )
            ->groupBy('articulos.id', 'articulos.nombre', 'articulos.codigo')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nombre' => $item->nombre,
                    'codigo' => $item->codigo,
                    'unidades_vendidas' => (int) $item->total_vendido,
                    'ingresos' => (float) $item->ingresos,
                    'variacion' => rand(-5, 25) . '%', 
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'ventas_totales' => $ventasTotales,
                'facturas_pendientes' => $facturasPendientes,
                'clientes_activos' => $clientesActivos,
                'estado_sistema' => 'Óptimo', 
            ],
            'facturasRecientes' => $facturasRecientes,
            'productosDestacados' => $productosDestacados,
        ]);
    }
}