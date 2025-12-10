import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosCompras, serviciosUsuarios } from "../../servicios/api"


export const cargarHistorialCompras = createAsyncThunk(
  "perfil/cargarHistorialCompras",
  async (usuarioId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const historial = await serviciosCompras.obtenerHistorial(usuarioId, token)
      return historial || []
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar historial")
    }
  }
)


export const actualizarDatosUsuario = createAsyncThunk(
  "perfil/actualizarDatosUsuario",
  async ({ usuarioId, datos }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const usuarioActualizado = await serviciosUsuarios.actualizar(usuarioId, datos, token)
      return usuarioActualizado
    } catch (error) {
      return rejectWithValue(error.mensaje || error.message || "Error al actualizar")
    }
  }
)

const perfilSlice = createSlice({
  name: "perfil",
  initialState: {
    historialCompras: [],
    cargandoHistorial: false,
    editando: false,
    datosEdicion: {
      nombre: "",
      apellido: "",
      email: "",
    },
    guardando: false,
    mensaje: {
      tipo: "",
      texto: "",
    },
    error: null,
  },
  reducers: {
    iniciarEdicion: (state, action) => {
      state.editando = true
      state.mensaje = { tipo: "", texto: "" }
      state.datosEdicion = {
        nombre: action.payload.nombre || "",
        apellido: action.payload.apellido || "",
        email: action.payload.email || "",
      }
    },
    cancelarEdicion: (state) => {
      state.editando = false
      state.mensaje = { tipo: "", texto: "" }
      state.datosEdicion = {
        nombre: "",
        apellido: "",
        email: "",
      }
    },
    actualizarDatosEdicion: (state, action) => {
      state.datosEdicion = {
        ...state.datosEdicion,
        ...action.payload,
      }
    },
    establecerMensaje: (state, action) => {
      state.mensaje = action.payload
    },
    limpiarMensaje: (state) => {
      state.mensaje = { tipo: "", texto: "" }
    },
    limpiarError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarHistorialCompras.pending, (state) => {
        state.cargandoHistorial = true
        state.error = null
      })
      .addCase(cargarHistorialCompras.fulfilled, (state, action) => {
        state.cargandoHistorial = false
        state.historialCompras = action.payload
      })
      .addCase(cargarHistorialCompras.rejected, (state, action) => {
        state.cargandoHistorial = false
        state.error = action.payload
        state.historialCompras = []
      })
      .addCase(actualizarDatosUsuario.pending, (state) => {
        state.guardando = true
        state.mensaje = { tipo: "", texto: "" }
      })
      .addCase(actualizarDatosUsuario.fulfilled, (state) => {
        state.guardando = false
        state.editando = false
        state.mensaje = {
          tipo: "success",
          texto: "Datos actualizados correctamente",
        }
      })
      .addCase(actualizarDatosUsuario.rejected, (state, action) => {
        state.guardando = false
        state.mensaje = {
          tipo: "danger",
          texto: `Error al actualizar: ${action.payload}`,
        }
      })
  },
})

export const {
  iniciarEdicion,
  cancelarEdicion,
  actualizarDatosEdicion,
  establecerMensaje,
  limpiarMensaje,
  limpiarError,
} = perfilSlice.actions

export default perfilSlice.reducer
