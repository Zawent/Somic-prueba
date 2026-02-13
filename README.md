# SomicERP

SomicERP es un sistema de planificación de recursos empresariales (ERP) desarrollado como prueba técnica para un proceso de selección. La aplicación permite gestionar facturación, clientes, artículos e inventario, y está construida con **Laravel 11**, **Inertia.js** y **React**, utilizando **Vite** como bundler.

## Funcionalidades principales

* **Gestión de clientes:** CRUD completo, tipos de documento, asignación de cupo y plazo.
* **Gestión de artículos:** CRUD completo, código, laboratorio, saldo y precios.
* **Facturación electrónica:** Creación, edición, emisión, pago y anulación de facturas.
* **Control de inventario:** Descuento automático de stock al facturar.
* **Dashboard dinámico:** Estadísticas reales de ventas totales, facturas pendientes, productos más vendidos, etc.

## Requisitos previos

Asegúrate de tener instalado lo siguiente en tu entorno local:

* PHP >= 8.2
* Composer (gestor de dependencias PHP)
* Node.js >= 18.18 y npm (o yarn/pnpm)
* MySQL >= 8.0 / MariaDB >= 10.4
* Git (opcional, para clonar el repositorio)

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone [https://github.com/tu-usuario/Somic-prueba.git](https://github.com/tu-usuario/Somic-prueba.git)
cd Somic-prueba

```

> Si descargaste el ZIP, descomprímelo y accede a la carpeta.

### 2. Instalar dependencias de PHP

```bash
composer install

```

### 3. Instalar dependencias de Node

```bash
npm install

```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y genera la clave de la aplicación:

```bash
cp .env.example .env
php artisan key:generate

```

Edita el archivo `.env` con los siguientes valores (o ajusta según tu entorno):

```ini
APP_NAME=SomicERP
APP_ENV=local
APP_KEY=base64:DL90LvmQ1pF8Xsdke/6wDgDMMpnJbJBJhUJHmWWtFiA=
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=somic_prueba
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

```

> **Nota:** Asegúrate de que la base de datos `somic_prueba` exista en tu gestor de base de datos antes de continuar.

### 5. Crear la base de datos y ejecutar migraciones

```bash
php artisan migrate

```

Si deseas cargar datos de prueba (clientes, artículos, facturas), ejecuta:

```bash
php artisan db:seed

```

> Los seeders incluyen un usuario administrador y datos de ejemplo para visualizar el dashboard correctamente.

## Ejecutar el servidor de desarrollo

El proyecto utiliza **Concurrently** para levantar todos los servicios necesarios con un solo comando:

```bash
composer run dev

```

Esto iniciará:

1. Servidor Laravel en `http://127.0.0.1:8000`
2. Vite para recarga en caliente de assets en `http://localhost:5173`
3. Cola de trabajos (queue worker) – *opcional, comentado por defecto en el script.*

### Acceso al sistema

Abre tu navegador y visita [http://127.0.0.1:8000].

Las credenciales de acceso (usando los seeders) son:

* **Email:** `admin@test.com`
* **Contraseña:** `12345678`

## Comandos útiles

| Acción | Comando |
| --- | --- |
| **Servidor + Vite (recomendado)** | `composer run dev` |
| Servidor Laravel solo | `php artisan serve` |
| Vite solo | `npm run dev` |
| Compilar assets para producción | `npm run build` |
| Ejecutar migraciones | `php artisan migrate` |
| Ejecutar seeders | `php artisan db:seed` |
| Limpiar caché | `php artisan optimize:clear` |
| Ejecutar pruebas (si existen) | `php artisan test` |

## Créditos

Desarrollado por **Uriel Vargas** como parte del proceso de selección para **Somic Soluciones**.

## Licencia

Este proyecto es de uso exclusivo para evaluación técnica y no cuenta con una licencia de distribución.

```
