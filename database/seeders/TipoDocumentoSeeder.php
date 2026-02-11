<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoDocumento;

class TipoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Cédula de Ciudadanía', 'codigo' => 'CC'],
            ['nombre' => 'Tarjeta de Identidad', 'codigo' => 'TI'],
            ['nombre' => 'NIT', 'codigo' => 'NIT'],
            ['nombre' => 'Pasaporte', 'codigo' => 'PP'],
        ];

        foreach ($tipos as $tipo) {
            TipoDocumento::create($tipo);
        }
    }
}
