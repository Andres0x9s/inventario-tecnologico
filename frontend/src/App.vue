
<script setup>
import { ref, computed, onMounted } from 'vue';

// Dirección de nuestra API NestJS
const API = 'http://localhost:3000/equipos';

// Datos reactivos de la aplicación
const equipos = ref([]);
const busqueda = ref('');
const cargando = ref(false);
const procesando = ref(false);
const error = ref('');
const aviso = ref('');
const errorFormulario = ref('');

// Control de ventanas y formularios
const ventana = ref('');
const idEnEdicion = ref(null);

function formularioVacio() {
  return {
    codigoInventario: '',
    nombre: '',
    tipo: '',
    marca: '',
    modelo: '',
    ubicacion: '',
    estado: 'Disponible',
    fechaAdquisicion: '',
    observaciones: '',
  };
}

const formulario = ref(formularioVacio());

// Filtrar los equipos según lo que escribe el usuario
const equiposFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim();

  return equipos.value.filter(equipo =>
    [
      equipo.codigoInventario,
      equipo.nombre,
      equipo.tipo,
      equipo.ubicacion,
      equipo.estado,
    ].some(valor =>
      String(valor ?? '').toLowerCase().includes(texto)
    )
  );
});

// Estadísticas del inventario
const disponibles = computed(() =>
  equipos.value.filter(e => e.estado === 'Disponible').length
);

const enUso = computed(() =>
  equipos.value.filter(e => e.estado === 'En uso').length
);

// Función central para comunicarse con NestJS
async function llamarApi(ruta = '', opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API}${ruta}`, opciones);
  } catch {
    throw new Error(
      'No se pudo conectar con NestJS. Revisa que el backend esté encendido.'
    );
  }

  let datos = null;

  try {
    datos = await respuesta.json();
  } catch {
    // La respuesta podría no contener JSON.
  }

  if (!respuesta.ok) {
    const mensaje = datos?.message;

    throw new Error(
      Array.isArray(mensaje)
        ? mensaje.join('. ')
        : mensaje || `Error HTTP ${respuesta.status}`
    );
  }

  return datos;
}

// GET: cargar todos los equipos
async function cargarEquipos() {
  cargando.value = true;
  error.value = '';

  try {
    equipos.value = await llamarApi();
  } catch (err) {
    equipos.value = [];
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}

// Abrir formulario de creación
function abrirCrear() {
  formulario.value = formularioVacio();
  idEnEdicion.value = null;
  errorFormulario.value = '';
  ventana.value = 'crear';
}

// Abrir formulario de edición
function abrirEditar(equipo) {
  formulario.value = {
    codigoInventario: equipo.codigoInventario,
    nombre: equipo.nombre,
    tipo: equipo.tipo,
    marca: equipo.marca,
    modelo: equipo.modelo,
    ubicacion: equipo.ubicacion,
    estado: equipo.estado,
    fechaAdquisicion: equipo.fechaAdquisicion,
    observaciones: equipo.observaciones ?? '',
  };

  idEnEdicion.value = equipo.id;
  errorFormulario.value = '';
  ventana.value = 'editar';
}

// Consultar el detalle de un equipo
function abrirDetalle(equipo) {
  formulario.value = { ...equipo };
  ventana.value = 'detalle';
}

function cerrarVentana() {
  ventana.value = '';
}

// POST o PATCH: guardar un equipo
async function guardarEquipo() {
  if (procesando.value) return;

  procesando.value = true;
  errorFormulario.value = '';

  const esEdicion = ventana.value === 'editar';

  try {
    await llamarApi(
      esEdicion ? `/${idEnEdicion.value}` : '',
      {
        method: esEdicion ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulario.value),
      }
    );

    cerrarVentana();
    await cargarEquipos();

    if (!error.value) {
      aviso.value = esEdicion
        ? 'Equipo actualizado correctamente.'
        : 'Equipo registrado correctamente.';
    }
  } catch (err) {
    errorFormulario.value = err.message;
  } finally {
    procesando.value = false;
  }
}

// DELETE: eliminar con confirmación
async function eliminarEquipo(equipo) {
  const confirmado = window.confirm(
    `¿Estás seguro de eliminar el equipo "${equipo.nombre}"?`
  );

  if (!confirmado) return;

  aviso.value = '';
  error.value = '';

  try {
    await llamarApi(`/${equipo.id}`, {
      method: 'DELETE',
    });

    await cargarEquipos();

    if (!error.value) {
      aviso.value = 'Equipo eliminado correctamente.';
    }
  } catch (err) {
    error.value = err.message;
  }
}

// Se ejecuta al iniciar el componente
onMounted(cargarEquipos);
</script>

<template>
  <main class="contenedor">

    <header class="encabezado">
      <div>
        <span class="etiqueta">GESTIÓN DE ACTIVOS</span>
        <h1>Inventario Tecnológico</h1>
        <p>Administra el equipamiento de la institución.</p>
      </div>

      <button class="btn primario" @click="abrirCrear">
        + Registrar equipo
      </button>
    </header>

    <section class="estadisticas">
      <div class="tarjeta">
        <span>Total de equipos</span>
        <strong>{{ equipos.length }}</strong>
      </div>

      <div class="tarjeta">
        <span>Disponibles</span>
        <strong>{{ disponibles }}</strong>
      </div>

      <div class="tarjeta">
        <span>En uso</span>
        <strong>{{ enUso }}</strong>
      </div>
    </section>

    <section class="panel">
      <div class="barra">
        <div>
          <h2>Equipos registrados</h2>
          <p>Consulta y administra el inventario.</p>
        </div>

        <button class="btn secundario" @click="cargarEquipos">
          Actualizar
        </button>
      </div>

      <input
        v-model="busqueda"
        class="buscador"
        placeholder="Buscar por nombre, código, tipo, ubicación o estado..."
      />

      <p v-if="aviso" class="mensaje exito" role="status">
        {{ aviso }}
      </p>

      <p v-if="error" class="mensaje error" role="alert">
        {{ error }}
      </p>

      <p v-if="cargando" class="vacio">
        Cargando equipos...
      </p>

      <p v-else-if="equiposFiltrados.length === 0" class="vacio">
        No se encontraron equipos.
      </p>

      <div v-else class="tabla-scroll">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="equipo in equiposFiltrados" :key="equipo.id">
              <td>{{ equipo.codigoInventario }}</td>
              <td><strong>{{ equipo.nombre }}</strong></td>
              <td>{{ equipo.tipo }}</td>
              <td>{{ equipo.ubicacion }}</td>
              <td>
                <span class="estado">{{ equipo.estado }}</span>
              </td>
              <td class="acciones">
                <button @click="abrirDetalle(equipo)">Ver</button>
                <button @click="abrirEditar(equipo)">Editar</button>
                <button class="peligro" @click="eliminarEquipo(equipo)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Ventana para crear, editar o consultar equipos -->
    <div v-if="ventana" class="fondo-modal" @click.self="cerrarVentana">
      <section class="modal">
        <div class="modal-cabecera">
          <h2>
            {{
              ventana === 'crear'
                ? 'Registrar equipo'
                : ventana === 'editar'
                  ? 'Editar equipo'
                  : 'Detalle del equipo'
            }}
          </h2>
          <button class="cerrar" @click="cerrarVentana">✕</button>
        </div>

        <div v-if="ventana === 'detalle'" class="detalle">
          <p><b>ID:</b> {{ formulario.id }}</p>
          <p><b>Código:</b> {{ formulario.codigoInventario }}</p>
          <p><b>Nombre:</b> {{ formulario.nombre }}</p>
          <p><b>Tipo:</b> {{ formulario.tipo }}</p>
          <p><b>Marca:</b> {{ formulario.marca }}</p>
          <p><b>Modelo:</b> {{ formulario.modelo }}</p>
          <p><b>Ubicación:</b> {{ formulario.ubicacion }}</p>
          <p><b>Estado:</b> {{ formulario.estado }}</p>
          <p><b>Fecha de adquisición:</b> {{ formulario.fechaAdquisicion }}</p>
          <p><b>Observaciones:</b> {{ formulario.observaciones || 'Sin observaciones' }}</p>
          <button class="btn secundario" @click="cerrarVentana">
            Cerrar
          </button>
        </div>

        <form v-else @submit.prevent="guardarEquipo">
          <div class="campos">
            <label>
              Código de inventario
              <input v-model.trim="formulario.codigoInventario" required minlength="3" maxlength="50" />
            </label>

            <label>
              Nombre
              <input v-model.trim="formulario.nombre" required minlength="3" maxlength="100" />
            </label>

            <label>
              Tipo
              <input v-model.trim="formulario.tipo" required />
            </label>

            <label>
              Marca
              <input v-model.trim="formulario.marca" required />
            </label>

            <label>
              Modelo
              <input v-model.trim="formulario.modelo" required />
            </label>

            <label>
              Ubicación
              <input v-model.trim="formulario.ubicacion" required />
            </label>

            <label>
              Estado
              <select v-model="formulario.estado" required>
                <option>Disponible</option>
                <option>En uso</option>
                <option>Mantención</option>
                <option>Baja</option>
              </select>
            </label>

            <label>
              Fecha de adquisición
              <input type="date" v-model="formulario.fechaAdquisicion" required />
            </label>

            <label class="ancho-completo">
              Observaciones (opcional)
              <textarea v-model="formulario.observaciones" rows="3"></textarea>
            </label>
          </div>

          <p v-if="errorFormulario" class="mensaje error" role="alert">
            {{ errorFormulario }}
          </p>

          <div class="botones-formulario">
            <button type="button" class="btn secundario" @click="cerrarVentana">
              Cancelar
            </button>
            <button type="submit" class="btn primario" :disabled="procesando">
              {{ procesando ? 'Guardando...' : 'Guardar equipo' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.contenedor {
  max-width: 1200px;
  margin: auto;
  padding: 30px 20px 60px;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: #172b4d;
  color: white;
  padding: 32px;
  border-radius: 15px;
}

.encabezado h1 { margin: 10px 0; font-size: 30px; }
.encabezado p { margin: 0; color: #c9d6e9; }
.etiqueta { font-size: 12px; letter-spacing: 2px; color: #93c5fd; }

.estadisticas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.tarjeta, .panel {
  background: white;
  border: 1px solid #e1e7ef;
  border-radius: 12px;
  padding: 24px;
}

.tarjeta span { display: block; color: #64748b; }
.tarjeta strong { display: block; font-size: 32px; margin-top: 8px; }

.barra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.barra h2 { margin: 0 0 5px; }
.barra p { color: #64748b; margin-top: 0; }

.btn {
  padding: 11px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
}

.primario { background: #2563eb; color: white; }
.primario:hover { background: #1d4ed8; }
.secundario { background: #e8edf5; color: #172b4d; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.buscador {
  width: 100%;
  padding: 12px;
  margin: 14px 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.tabla-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: 15px 12px; border-bottom: 1px solid #e2e8f0; }
th { background: #f8fafc; color: #475569; font-size: 13px; }

.estado {
  display: inline-block;
  background: #e0f2fe;
  color: #075985;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.acciones { white-space: nowrap; }
.acciones button {
  margin-right: 8px;
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
}
.acciones .peligro { color: #dc2626; }

.mensaje { padding: 12px; border-radius: 8px; margin: 12px 0; }
.exito { background: #dcfce7; color: #166534; }
.error { background: #fee2e2; color: #991b1b; }
.vacio { text-align: center; padding: 35px; color: #64748b; }

.fondo-modal {
  position: fixed;
  inset: 0;
  background: #0009;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  z-index: 10;
}

.modal {
  background: white;
  color: #172b4d;
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-cabecera h2 { margin: 0; }
.cerrar { border: 0; background: none; font-size: 20px; }

.campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.campos label { display: flex; flex-direction: column; gap: 6px; }
.campos input, .campos select, .campos textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
}

.ancho-completo { grid-column: 1 / -1; }
.botones-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.detalle p { border-bottom: 1px solid #eee; padding: 8px 0; }

@media (max-width: 700px) {
  .encabezado, .barra { flex-direction: column; align-items: stretch; }
  .estadisticas { grid-template-columns: 1fr; }
  .campos { grid-template-columns: 1fr; }
  .ancho-completo { grid-column: auto; }
}
</style>
