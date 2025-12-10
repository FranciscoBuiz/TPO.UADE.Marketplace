import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosCompras } from "../../servicios/api"

const initialState = {
  compraActual: null,
  cargando: false,
  error: null,
  compraCreadaExitosamente: false,

  datosEnvio: {
    email: "",
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    calle: "",
    numero: "",
    piso: "",
    departamento: "",
    codigoPostal: "",
    provincia: "",
    localidad: "",
  },

  datosPago: {
    metodoPago: "tarjeta",
    datosTarjeta: {
      numero: "",
      nombre: "",
      vencimiento: "",
      cvv: "",
    },
  },

  pasoActual: 1,
  erroresFormulario: {},
  compraRealizada: false,
  numeroCompra: null,
  procesandoPago: false,
}

export const realizarCompra = createAsyncThunk(
  "compra/realizarCompra",
  async (usuarioId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token
      const respuesta = await serviciosCompras.realizar(usuarioId, token)
      dispatch({ type: "carrito/limpiarCarritoLocal" })
      return respuesta
    } catch (error) {
      return rejectWithValue(error.mensaje || error.message || "Error al realizar la compra")
    }
  }
)

export const obtenerHistorialCompras = createAsyncThunk(
  "compra/obtenerHistorial",
  async (usuarioId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const historial = await serviciosCompras.obtenerHistorial(usuarioId, token)
      return historial
    } catch (error) {
      return rejectWithValue(error.mensaje || error.message || "Error al obtener historial")
    }
  }
)

const compraSlice = createSlice({
  name: "compra",
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.error = null
    },
    resetCompraExitosa: (state) => {
      state.compraCreadaExitosamente = false
      state.compraActual = null
    },
    actualizarDatosEnvio: (state, action) => {
      state.datosEnvio = { ...state.datosEnvio, ...action.payload }
    },
    establecerErroresFormulario: (state, action) => {
      state.erroresFormulario = action.payload
    },
    limpiarErrorFormulario: (state, action) => {
      const campo = action.payload
      if (state.erroresFormulario[campo]) {
        delete state.erroresFormulario[campo]
      }
    },
    establecerMetodoPago: (state, action) => {
      state.datosPago.metodoPago = action.payload
    },
    actualizarDatosTarjeta: (state, action) => {
      state.datosPago.datosTarjeta = { ...state.datosPago.datosTarjeta, ...action.payload }
    },
    avanzarPaso: (state) => {
      if (state.pasoActual < 3) state.pasoActual += 1
    },
    retrocederPaso: (state) => {
      if (state.pasoActual > 1) state.pasoActual -= 1
    },
    irAPaso: (state, action) => {
      state.pasoActual = action.payload
    },
    iniciarProcesoPago: (state) => {
      state.procesandoPago = true
    },
    finalizarProcesoPago: (state) => {
      state.procesandoPago = false
    },
    establecerCompraRealizada: (state, action) => {
      state.compraRealizada = true
      state.numeroCompra = action.payload.numeroCompra || `URB-${Date.now()}`
      state.pasoActual = 3
    },
    limpiarCheckout: (state) => {
      state.datosEnvio = initialState.datosEnvio
      state.datosPago = initialState.datosPago
      state.pasoActual = 1
      state.erroresFormulario = {}
      state.compraRealizada = false
      state.numeroCompra = null
      state.procesandoPago = false
    },
    inicializarConUsuario: (state, action) => {
      if (action.payload?.email) {
        state.datosEnvio.email = action.payload.email
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(realizarCompra.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(realizarCompra.fulfilled, (state, action) => {
        state.cargando = false
        state.error = null
        state.compraCreadaExitosamente = true
        state.compraActual = action.payload
      })
      .addCase(realizarCompra.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.compraCreadaExitosamente = false
      })
      .addCase(obtenerHistorialCompras.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerHistorialCompras.fulfilled, (state, action) => {
        state.cargando = false
        state.historial = action.payload
      })
      .addCase(obtenerHistorialCompras.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
  },
})

export const {
  limpiarError,
  resetCompraExitosa,
  actualizarDatosEnvio,
  establecerErroresFormulario,
  limpiarErrorFormulario,
  establecerMetodoPago,
  actualizarDatosTarjeta,
  avanzarPaso,
  retrocederPaso,
  irAPaso,
  iniciarProcesoPago,
  finalizarProcesoPago,
  establecerCompraRealizada,
  limpiarCheckout,
  inicializarConUsuario,
} = compraSlice.actions

export default compraSlice.reducer
