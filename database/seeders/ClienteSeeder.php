<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\TipoDocumento;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $tipoCC = TipoDocumento::where('codigo', 'CC')->first();

        Cliente::create([
            'tipo_documento_id' => $tipoCC->id,
            'nombre' => 'Juan Pérez',
            'documento' => '123456789',
            'cupo' => 5000000,
            'plazo_dias' => 30,
        ]);

        Cliente::create([
            'tipo_documento_id' => $tipoCC->id,
            'nombre' => 'María Gómez',
            'documento' => '987654321',
            'cupo' => 8000000,
            'plazo_dias' => 60,
        ]);
    }
}
