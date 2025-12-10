import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosCarrito } from "../../servicios/api"

// Estado inicial
const initialState = {
  carrito: null,
  cargando: false,
  cargandoAccion: false,
  error: null,
}

// Thunks con token como parámetro

export const cargarCarrito = createAsyncThunk(
  "carrito/cargarCarrito",
  async ({ usuarioId, token }, { rejectWithValue }) => {
    try {
      const response = await serviciosCarrito.obtener(usuarioId, token)
      return response
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al cargar carrito")
    }
  }
)

export const agregarAlCarrito = createAsyncThunk(
  "carrito/agregarAlCarrito",
  async ({ usuarioId, stockId, cantidad, token }, { rejectWithValue, dispatch }) => {
    try {
      await serviciosCarrito.agregar(usuarioId, { stockId, cantidad }, token)
      dispatch(cargarCarrito({ usuarioId, token }))
      return { success: true }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al agregar al carrito")
    }
  }
)

export const modificarCantidad = createAsyncThunk(
  "carrito/modificarCantidad",
  async ({ stockId, cantidad, usuarioId, token }, { rejectWithValue, dispatch }) => {
    try {
      await serviciosCarrito.modificar(stockId, cantidad, usuarioId, token)
      dispatch(cargarCarrito({ usuarioId, token }))
      return { success: true }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al modificar cantidad")
    }
  }
)

export const eliminarDelCarrito = createAsyncThunk(
  "carrito/eliminarDelCarrito",
  async ({ usuarioId, stockIdActual, token }, { rejectWithValue, dispatch }) => {
    try {
      await serviciosCarrito.eliminar(usuarioId, stockIdActual, token)
      dispatch(cargarCarrito({ usuarioId, token }))
      return { success: true }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al eliminar del carrito")
    }
  }
)

export const vaciarCarrito = createAsyncThunk(
  "carrito/vaciarCarrito",
  async ({ usuarioId, token }, { rejectWithValue, dispatch }) => {
    try {
      await serviciosCarrito.vaciar(usuarioId, token)
      dispatch(cargarCarrito({ usuarioId, token }))
      return { success: true }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al vaciar carrito")
    }
  }
)

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    limpiarCarrito: (state) => {
      state.carrito = null
      state.error = null
    },
    limpiarError: (state) => {
      state.error = null
    },
    establecerCargandoAccion: (state, action) => {
      state.cargandoAccion = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarCarrito.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(cargarCarrito.fulfilled, (state, action) => {
        state.cargando = false
        state.carrito = action.payload
        state.error = null
      })
      .addCase(cargarCarrito.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(agregarAlCarrito.pending, (state) => {
        state.cargandoAccion = true
        state.error = null
      })
      .addCase(agregarAlCarrito.fulfilled, (state) => {
        state.cargandoAccion = false
        state.error = null
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.cargandoAccion = false
        state.error = action.payload
      })

      .addCase(modificarCantidad.pending, (state) => {
        state.cargandoAccion = true
        state.error = null
      })
      .addCase(modificarCantidad.fulfilled, (state) => {
        state.cargandoAccion = false
        state.error = null
      })
      .addCase(modificarCantidad.rejected, (state, action) => {
        state.cargandoAccion = false
        state.error = action.payload
      })

      .addCase(eliminarDelCarrito.pending, (state) => {
        state.cargandoAccion = true
        state.error = null
      })
      .addCase(eliminarDelCarrito.fulfilled, (state) => {
        state.cargandoAccion = false
        state.error = null
      })
      .addCase(eliminarDelCarrito.rejected, (state, action) => {
        state.cargandoAccion = false
        state.error = action.payload
      })

      .addCase(vaciarCarrito.pending, (state) => {
        state.cargandoAccion = true
        state.error = null
      })
      .addCase(vaciarCarrito.fulfilled, (state) => {
        state.cargandoAccion = false
        state.carrito = null
        state.error = null
      })
      .addCase(vaciarCarrito.rejected, (state, action) => {
        state.cargandoAccion = false
        state.error = action.payload
      })
  },
})

export const { limpiarCarrito, limpiarError, establecerCargandoAccion } = carritoSlice.actions
export default carritoSlice.reducer
