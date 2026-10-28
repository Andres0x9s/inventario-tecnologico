
# Sistema de Inventario Tecnológico

**Asignatura:** Lenguaje de Programación Web II  
**Institución:** IP Virginio Gómez, sede Chillán  
**Estudiante:** Andrés Saldias
**Evaluación:** N.º 2 - 2026

## 1. Descripción

Aplicación web cliente-servidor que permite administrar
el equipamiento tecnológico de una institución.

El sistema permite registrar, consultar, buscar,
actualizar y eliminar equipos como notebooks,
computadores, monitores, proyectores e impresoras.

## 2. Tecnologías utilizadas

- Vue.js: interfaz de usuario.
- Vite: entorno de desarrollo del frontend.
- NestJS: API REST del backend.
- TypeScript: programación del backend.
- MySQL: almacenamiento de información.
- TypeORM: comunicación con la base de datos.
- class-validator: validación de datos.
- Git y GitHub: control de versiones.

## 3. Requisitos

- Node.js y npm.
- MySQL Server.
- MySQL Workbench (recomendado).
- Visual Studio Code (recomendado).

## 4. Instalación del proyecto

Clonar el repositorio:

git clone https://github.com/Andres0x9s/inventario-tecnologico.git

Entrar al proyecto:

cd inventario-tecnologico

### 4.1 Configuración de MySQL

Ejecutar en MySQL Workbench:

CREATE DATABASE IF NOT EXISTS inventario_tecnologico
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

### 4.2 Configuración del backend

Entrar a la carpeta:

cd backend

Instalar las dependencias:

npm install

Crear un archivo .env tomando como referencia
el archivo .env.example.

Configurar las variables:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=CONTRASENA_LOCAL
DB_NAME=inventario_tecnologico

Reemplazar CONTRASENA_LOCAL por la contraseña
real de MySQL, sin publicarla en GitHub.

Iniciar el backend:

npm run start:dev

El servidor se ejecuta en:
http://localhost:3000

Durante el desarrollo, TypeORM sincroniza
la tabla equipos con la entidad Equipo.

### 4.3 Configuración del frontend

Abrir otra terminal y entrar a frontend:

cd frontend

Instalar dependencias:

npm install

Iniciar Vue:

npm run dev

Abrir en el navegador:
http://localhost:5173

## 5. Endpoints de la API

| Método | Endpoint | Función |
|---|---|---|
| GET | /equipos | Listar equipos |
| GET | /equipos/:id | Consultar por ID |
| POST | /equipos | Registrar equipo |
| PATCH | /equipos/:id | Actualizar equipo |
| DELETE | /equipos/:id | Eliminar equipo |

## 6. Modelo de datos

La entidad Equipo contiene:

- id: identificador autogenerado.
- codigoInventario: código del equipo.
- nombre: nombre del equipo.
- tipo: categoría del equipo.
- marca: fabricante.
- modelo: modelo del equipo.
- ubicacion: lugar donde se encuentra.
- estado: situación actual.
- fechaAdquisicion: fecha de compra.
- observaciones: información opcional.

## 7. Validaciones

- Código y nombre de mínimo 3 caracteres.
- Campos obligatorios validados con DTO.
- Estado limitado a Disponible, En uso,
  Mantención o Baja.
- Validación de fecha de adquisición.
- Respuesta 404 para equipos inexistentes.
- Rechazo de propiedades no permitidas.
- Confirmación antes de eliminar equipos.

## 8. Estructura del proyecto

inventario-tecnologico/
  backend/
    src/
      equipos/
        dto/
        entities/
        equipos.controller.ts
        equipos.service.ts
        equipos.module.ts
      app.module.ts
      main.ts
    .env.example
  frontend/
    src/
      App.vue
      main.js
      style.css
  README.md

El Controller recibe solicitudes HTTP.
El Service contiene las operaciones del inventario.
TypeORM Repository administra los registros MySQL.
Vue consume la API mediante fetch y JSON.

## 9. Pruebas funcionales

Pruebas que deben verificarse:

- Registrar un equipo correctamente.
- Consultar listado y detalle.
- Modificar un equipo existente.
- Eliminar con confirmación.
- Buscar equipos por diferentes campos.
- Rechazar información inválida.
- Devolver 404 para ID inexistente.
- Mostrar error cuando el backend no responde.
- Comprobar persistencia tras reiniciar NestJS.

## 10. Uso de inteligencia artificial

Herramienta utilizada: ChatGPT (OpenAI).

Se utilizó inteligencia artificial como apoyo
para comprender los conceptos de Vue.js, NestJS,
TypeORM, DTO, API REST y MySQL.

También se recibió apoyo para generar código
inicial de componentes, controladores, servicios,
validaciones, interfaz y documentación, así como
para resolver errores durante el desarrollo.

El estudiante revisó y adaptó el código,
configuró el entorno de desarrollo y comprobó
la conexión entre NestJS y MySQL.

Las funcionalidades se verifican mediante
pruebas manuales en el entorno local.

## 11. Consideraciones de seguridad

El archivo .env no se publica en GitHub.
Se incluye .env.example sin contraseñas.

La sincronización automática de TypeORM
se utiliza únicamente para desarrollo académico.
No se recomienda activarla en producción.
