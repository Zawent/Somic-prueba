<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticuloController extends Controller
{
    public function index()
    {
        $articulos = Articulo::latest()->paginate(10);

        return Inertia::render('articulos/index', [
            'articulos' => $articulos
        ]);
    }

    public function create()
    {
        return Inertia::render('articulos/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:50', 'unique:articulos,codigo'],
            'nombre' => ['required', 'string', 'max:255'],
            'laboratorio' => ['required', 'string', 'max:255'],
            'saldo' => ['required', 'integer', 'min:0'],
            'costo' => ['required', 'numeric', 'min:0'],
            'precio_venta' => ['required', 'numeric', 'min:0'],
        ]);

        Articulo::create($validated);

        return redirect()
            ->route('articulos.index')
            ->with('success', 'Artículo creado correctamente');
    }

    public function show(Articulo $articulo)
    {
        return Inertia::render('articulos/show', [
            'articulo' => $articulo
        ]);
    }

    public function edit(Articulo $articulo)
    {
        return Inertia::render('articulos/edit', [
            'articulo' => $articulo
        ]);
    }

    public function update(Request $request, Articulo $articulo)
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:50', 'unique:articulos,codigo,' . $articulo->id],
            'nombre' => ['required', 'string', 'max:255'],
            'laboratorio' => ['required', 'string', 'max:255'],
            'saldo' => ['required', 'integer', 'min:0'],
            'costo' => ['required', 'numeric', 'min:0'],
            'precio_venta' => ['required', 'numeric', 'min:0'],
        ]);

        $articulo->update($validated);

        return redirect()
            ->route('articulos.index')
            ->with('success', 'Artículo actualizado correctamente');
    }

    public function destroy(Articulo $articulo)
    {
        $articulo->delete();

        return redirect()
            ->route('articulos.index')
            ->with('success', 'Artículo eliminado correctamente');
    }
}
