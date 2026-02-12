<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ArticuloController;
use App\Http\Controllers\FacturaController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';

Route::middleware(['auth'])->group(function () {
    Route::resource('clientes', ClienteController::class);
    Route::resource('articulos', ArticuloController::class);
    Route::resource('facturas', FacturaController::class);

    // Acciones de estado de factura
    Route::post('facturas/{factura}/emitir', [FacturaController::class, 'emitir'])->name('facturas.emitir');
    Route::post('facturas/{factura}/pagar', [FacturaController::class, 'marcarPagada'])->name('facturas.pagar');
    Route::post('facturas/{factura}/anular', [FacturaController::class, 'anular'])->name('facturas.anular');
    
    // APIs para el formulario
    Route::post('api/buscar-cliente', [FacturaController::class, 'buscarCliente'])->name('api.buscar-cliente');
    Route::post('api/buscar-articulo', [FacturaController::class, 'buscarArticulo'])->name('api.buscar-articulo');
    Route::get('api/clientes', [FacturaController::class, 'autocompleteClientes'])->name('api.clientes.autocomplete');
    Route::get('api/articulos', [FacturaController::class, 'autocompleteArticulos'])->name('api.articulos.autocomplete');

});