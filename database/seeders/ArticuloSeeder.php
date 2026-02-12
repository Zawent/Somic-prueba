<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Articulo;

class ArticuloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articulos = [
            [
                'codigo' => 'MED-001',
                'nombre' => 'Acetaminofén 500mg',
                'laboratorio' => 'Genfar',
                'saldo' => 150,
                'costo' => 800,
                'precio_venta' => 1200,
            ],
            [
                'codigo' => 'MED-002',
                'nombre' => 'Ibuprofeno 400mg',
                'laboratorio' => 'MK',
                'saldo' => 90,
                'costo' => 1000,
                'precio_venta' => 1500,
            ],
            [
                'codigo' => 'MED-003',
                'nombre' => 'Amoxicilina 500mg',
                'laboratorio' => 'La Santé',
                'saldo' => 60,
                'costo' => 2500,
                'precio_venta' => 3500,
            ],
            [
                'codigo' => 'MED-004',
                'nombre' => 'Loratadina 10mg',
                'laboratorio' => 'Bayer',
                'saldo' => 120,
                'costo' => 900,
                'precio_venta' => 1400,
            ],
            [
                'codigo' => 'MED-005',
                'nombre' => 'Vitamina C 500mg',
                'laboratorio' => 'Nature Made',
                'saldo' => 200,
                'costo' => 600,
                'precio_venta' => 1000,
            ],
        ];

        foreach ($articulos as $articulo) {
            Articulo::create($articulo);
        }
    }
}
