<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::with('tipoDocumento')
            ->latest()
            ->paginate(10);

        return Inertia::render('clientes/index', [
            'clientes' => $clientes
        ]);
    }

    public function create()
    {
        $tiposDocumento = TipoDocumento::where('activo', true)->get();

        return Inertia::render('clientes/create', [
            'tiposDocumento' => $tiposDocumento
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_documento_id' => 'required|exists:tipo_documentos,id',
            'documento' => 'required|string|max:50|unique:clientes,documento',
            'cupo' => 'required|numeric|min:0',
            'plazo_dias' => 'required|integer|min:0',
        ]);

        Cliente::create($validated);

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente creado correctamente');
    }

    public function show(Cliente $cliente)
    {
        $cliente->load('tipoDocumento');

        return Inertia::render('clientes/show', [
            'cliente' => $cliente
        ]);
    }

    public function edit(Cliente $cliente)
    {
        $tiposDocumento = TipoDocumento::where('activo', true)->get();

        return Inertia::render('clientes/edit', [
            'cliente' => $cliente,
            'tiposDocumento' => $tiposDocumento
        ]);
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_documento_id' => 'required|exists:tipo_documentos,id',
            'documento' => 'required|string|max:50|unique:clientes,documento,' . $cliente->id,
            'cupo' => 'required|numeric|min:0',
            'plazo_dias' => 'required|integer|min:0',
        ]);

        $cliente->update($validated);

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente actualizado correctamente');
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente eliminado correctamente');
    }

    public function autocompleteClientes(Request $request)
    {
        $search = $request->search;

        $clientes = Cliente::where('documento', 'like', "%{$search}%")
            ->orWhere('nombre', 'like', "%{$search}%")
            ->limit(5)
            ->get();

        return response()->json($clientes);
    }

}
