<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Listado de clientes
     */
    public function index()
    {
        $clientes = Cliente::with('tipoDocumento')
            ->latest()
            ->paginate(10);

        return Inertia::render('clientes/index', [
            'clientes' => $clientes
        ]);
    }

    /**
     * Formulario crear
     */
    public function create()
    {
        $tiposDocumento = TipoDocumento::where('activo', true)->get();

        return Inertia::render('clientes/create', [
            'tiposDocumento' => $tiposDocumento
        ]);
    }

    /**
     * Guardar cliente
     */
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

    /**
     * Mostrar cliente
     */
    public function show(Cliente $cliente)
    {
        $cliente->load('tipoDocumento');

        return Inertia::render('clientes/show', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Formulario editar
     */
    public function edit(Cliente $cliente)
    {
        $tiposDocumento = TipoDocumento::where('activo', true)->get();

        return Inertia::render('clientes/edit', [
            'cliente' => $cliente,
            'tiposDocumento' => $tiposDocumento
        ]);
    }

    /**
     * Actualizar cliente
     */
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

    /**
     * Eliminar cliente
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()
            ->route('clientes.index')
            ->with('success', 'Cliente eliminado correctamente');
    }
}
