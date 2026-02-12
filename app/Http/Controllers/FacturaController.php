<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\Factura_item;
use App\Models\Cliente;
use App\Models\Articulo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FacturaController extends Controller
{
    public function index()
    {
        $facturas = Factura::with(['cliente', 'usuario'])
            ->latest()
            ->paginate(15);

        return Inertia::render('facturas/index', [
            'facturas' => $facturas,
        ]);
    }

    public function create()
    {
        return Inertia::render('facturas/create', [
            'numero_factura' => Factura::generarNumeroFactura(),
            'fecha_actual' => Carbon::today()->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_emision' => 'required|date',
            'notas' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.articulo_id' => 'required|exists:articulos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_venta_unitario' => 'required|numeric|min:0',
            'items.*.es_venta' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Obtener el cliente
            $cliente = Cliente::findOrFail($validated['cliente_id']);

            // Crear la factura
            $factura = new Factura();
            $factura->cliente_id = $cliente->id;
            $factura->numero_factura = Factura::generarNumeroFactura();
            $factura->fecha_emision = $validated['fecha_emision'];
            $factura->user_id = auth()->id();
            $factura->notas = $validated['notas'] ?? null;
            $factura->estado = 'borrador';
            
            // Calcular fecha de vencimiento
            $factura->calcularFechaVencimiento();
            $factura->save();

            // Procesar cada item
            foreach ($validated['items'] as $itemData) {
                $articulo = Articulo::findOrFail($itemData['articulo_id']);

                // Verificar stock disponible si es una venta
                if ($itemData['es_venta'] && !$articulo->tieneSaldoDisponible($itemData['cantidad'])) {
                    throw new \Exception("Stock insuficiente para el artículo: {$articulo->nombre}");
                }

                // Crear el item
                $item = new Factura_item();
                $item->factura_id = $factura->id;
                $item->articulo_id = $articulo->id;
                $item->es_venta = $itemData['es_venta'];
                $item->cantidad = $itemData['cantidad'];
                $item->costo_unitario = $articulo->costo;
                $item->precio_venta_unitario = $itemData['precio_venta_unitario'];
                $item->descuento = $itemData['descuento'] ?? 0;
                $item->save();
            }

            // Verificar cupo del cliente
            $totalFactura = $factura->fresh()->total;
            if (!$cliente->tieneCupoDisponible($totalFactura)) {
                throw new \Exception("El cliente no tiene cupo disponible suficiente para esta factura.");
            }

            DB::commit();

            return redirect()
                ->route('facturas.show', $factura)
                ->with('success', 'Factura creada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function show(Factura $factura)
    {
        $factura->load(['cliente.tipoDocumento', 'items.articulo', 'usuario']);

        return Inertia::render('facturas/show', [
            'factura' => $factura,
        ]);
    }

    public function edit(Factura $factura)
    {
        if ($factura->estado !== 'borrador') {
            return redirect()
                ->route('facturas.show', $factura)
                ->with('error', 'Solo se pueden editar facturas en estado borrador.');
        }

        $factura->load(['cliente', 'items.articulo']);

        return Inertia::render('facturas/edit', [
            'factura' => $factura,
        ]);
    }

    public function update(Request $request, Factura $factura)
    {
        if ($factura->estado !== 'borrador') {
            return redirect()
                ->route('facturas.show', $factura)
                ->with('error', 'Solo se pueden editar facturas en estado borrador.');
        }

        $validated = $request->validate([
            'notas' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.articulo_id' => 'required|exists:articulos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_venta_unitario' => 'required|numeric|min:0',
            'items.*.es_venta' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Eliminar items anteriores
            $factura->items()->delete();

            // Actualizar notas
            $factura->notas = $validated['notas'] ?? null;
            $factura->save();

            // Crear nuevos items
            foreach ($validated['items'] as $itemData) {
                $articulo = Articulo::findOrFail($itemData['articulo_id']);

                if ($itemData['es_venta'] && !$articulo->tieneSaldoDisponible($itemData['cantidad'])) {
                    throw new \Exception("Stock insuficiente para el artículo: {$articulo->nombre}");
                }

                $item = new Factura_item();
                $item->factura_id = $factura->id;
                $item->articulo_id = $articulo->id;
                $item->es_venta = $itemData['es_venta'];
                $item->cantidad = $itemData['cantidad'];
                $item->costo_unitario = $articulo->costo;
                $item->precio_venta_unitario = $itemData['precio_venta_unitario'];
                $item->descuento = $itemData['descuento'] ?? 0;
                $item->save();
            }

            DB::commit();

            return redirect()
                ->route('facturas.show', $factura)
                ->with('success', 'Factura actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function emitir(Factura $factura)
    {
        if ($factura->estado !== 'borrador') {
            return back()->with('error', 'Solo se pueden emitir facturas en estado borrador.');
        }

        $factura->estado = 'emitida';
        $factura->save();

        return back()->with('success', 'Factura emitida exitosamente.');
    }

    public function marcarPagada(Factura $factura)
    {
        if ($factura->estado !== 'emitida') {
            return back()->with('error', 'Solo se pueden marcar como pagadas las facturas emitidas.');
        }

        $factura->estado = 'pagada';
        $factura->save();

        return back()->with('success', 'Factura marcada como pagada exitosamente.');
    }

    public function anular(Factura $factura)
    {
        if ($factura->estado === 'anulada') {
            return back()->with('error', 'La factura ya está anulada.');
        }

        DB::beginTransaction();

        try {
            // Revertir los movimientos de inventario
            foreach ($factura->items as $item) {
                $item->revertirSaldoArticulo();
            }

            $factura->estado = 'anulada';
            $factura->save();

            DB::commit();

            return back()->with('success', 'Factura anulada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al anular la factura: ' . $e->getMessage());
        }
    }

    public function buscarCliente(Request $request)
    {
        $request->validate([
            'documento' => 'required|string',
        ]);

        $cliente = Cliente::with('tipoDocumento')
            ->where('documento', $request->documento)
            ->first();

        if (!$cliente) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'cliente' => [
                'id' => $cliente->id,
                'nombre' => $cliente->nombre,
                'documento' => $cliente->documento,
                'tipo_documento' => $cliente->tipoDocumento->nombre,
                'cupo' => $cliente->cupo,
                'plazo_dias' => $cliente->plazo_dias,
                'cartera' => $cliente->calcularCartera(),
                'cupo_disponible' => $cliente->calcularCupoDisponible(),
                'porcentaje_cupo' => $cliente->porcentajeCupoUtilizado(),
            ],
        ]);
    }

    public function buscarArticulo(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
        ]);

        $articulo = Articulo::where('codigo', $request->codigo)->first();

        if (!$articulo) {
            return response()->json([
                'success' => false,
                'message' => 'Artículo no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'articulo' => [
                'id' => $articulo->id,
                'codigo' => $articulo->codigo,
                'nombre' => $articulo->nombre,
                'laboratorio' => $articulo->laboratorio,
                'saldo' => $articulo->saldo,
                'costo' => $articulo->costo,
                'precio_venta' => $articulo->precio_venta,
                'margen' => $articulo->calcularMargenUtilidad(),
            ],
        ]);
    }

    public function autocompleteClientes(Request $request)
    {
        $search = $request->input('search');

        if (empty($search) || strlen($search) < 2) {
            return response()->json([]);
        }

        $clientes = Cliente::with('tipoDocumento')
            ->where('documento', 'LIKE', "%{$search}%")
            ->orWhere('nombre', 'LIKE', "%{$search}%")
            ->limit(10)
            ->get()
            ->map(function ($cliente) {
                return [
                    'id'                => $cliente->id,
                    'nombre'            => $cliente->nombre,
                    'documento'         => $cliente->documento,
                    'tipo_documento'    => $cliente->tipoDocumento->nombre ?? '',
                    'cupo'              => $cliente->cupo,
                    'plazo_dias'        => $cliente->plazo_dias,
                    'cartera'           => $cliente->calcularCartera(),
                    'cupo_disponible'   => $cliente->calcularCupoDisponible(),
                    'porcentaje_cupo'   => $cliente->porcentajeCupoUtilizado(),
                ];
            });

        return response()->json($clientes);
    }

    public function autocompleteArticulos(Request $request)
    {
        $search = $request->input('search');

        if (empty($search) || strlen($search) < 2) {
            return response()->json([]);
        }

        $articulos = Articulo::where('codigo', 'LIKE', "%{$search}%")
            ->orWhere('nombre', 'LIKE', "%{$search}%")
            ->limit(10)
            ->get()
            ->map(function ($articulo) {
                return [
                    'id'            => $articulo->id,
                    'codigo'        => $articulo->codigo,
                    'nombre'        => $articulo->nombre,
                    'laboratorio'   => $articulo->laboratorio,
                    'saldo'         => $articulo->saldo,
                    'costo'         => $articulo->costo,
                    'precio_venta'  => $articulo->precio_venta,
                ];
            });

        return response()->json($articulos);
    }
}