import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosProductos, serviciosTalles } from "../../servicios/api"

// Thunk para cargar producto y talles
export const cargarDetalleProducto = createAsyncThunk(
  "detalleProducto/cargarDetalle",
  async (productoId, { rejectWithValue }) => {
    try {
      const [productoData, tallesData] = await Promise.all([
        serviciosProductos.obtenerPorId(productoId),
        serviciosTalles.obtenerTodos(),
      ])

      return {
        producto: productoData,
        talles: tallesData,
      }
    } catch (error) {

      return rejectWithValue("No se pudo cargar el producto")
    }
  },
)

const detalleProductoSlice = createSlice({
  name: "detalleProducto",
  initialState: {
    producto: null,
    talles: [],
    talleSeleccionado: "",
    cantidad: 1,
    cargando: false,
    error: null,
    mostrarConfirmacion: false,
    productoAgregado: null,
  },
  reducers: {
    seleccionarTalle: (state, action) => {
      state.talleSeleccionado = action.payload
      state.cantidad = 1
    },
    cambiarCantidad: (state, action) => {
      const nuevaCantidad = action.payload
      const stockDisponible =
        state.producto?.stockDisponible?.find((s) => s.numeroTalle === Number(state.talleSeleccionado))
          ?.cantidad || 0

      if (nuevaCantidad >= 1 && nuevaCantidad <= stockDisponible) {
        state.cantidad = nuevaCantidad
      }
    },
    incrementarCantidad: (state) => {
      const stockDisponible =
        state.producto?.stockDisponible?.find((s) => s.numeroTalle === Number(state.talleSeleccionado))
          ?.cantidad || 0

      if (state.cantidad < stockDisponible) {
        state.cantidad += 1
      }
    },
    decrementarCantidad: (state) => {
      if (state.cantidad > 1) {
        state.cantidad -= 1
      }
    },
    mostrarConfirmacionCarrito: (state, action) => {
      state.mostrarConfirmacion = true
      state.productoAgregado = action.payload
    },
    ocultarConfirmacionCarrito: (state) => {
      state.mostrarConfirmacion = false
      state.productoAgregado = null
    },
    limpiarDetalle: (state) => {
      state.producto = null
      state.talles = []
      state.talleSeleccionado = ""
      state.cantidad = 1
      state.error = null
      state.mostrarConfirmacion = false
      state.productoAgregado = null
    },
    limpiarError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarDetalleProducto.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(cargarDetalleProducto.fulfilled, (state, action) => {
        state.cargando = false
        state.producto = action.payload.producto
        state.talles = action.payload.talles
        state.talleSeleccionado = ""
        state.cantidad = 1
        state.error = null
      })
      .addCase(cargarDetalleProducto.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.producto = null
        state.talles = []
      })
  },
})

export const {
  seleccionarTalle,
  cambiarCantidad,
  incrementarCantidad,
  decrementarCantidad,
  mostrarConfirmacionCarrito,
  ocultarConfirmacionCarrito,
  limpiarDetalle,
  limpiarError,
} = detalleProductoSlice.actions

export const selectStockDisponible = (state) => {
  const { producto, talleSeleccionado } = state.detalleProducto
  if (!producto || !talleSeleccionado) return 0
  const stock = producto.stockDisponible?.find((s) => s.numeroTalle === Number(talleSeleccionado))
  return stock ? stock.cantidad : 0
}

export const selectEstadoStock = (state) => {
  const stock = selectStockDisponible(state)
  if (stock === 0) return { clase: "stock-out", texto: "Sin stock" }
  if (stock <= 5) return { clase: "stock-low", texto: `Quedan ${stock} unidades` }
  return { clase: "stock-available", texto: "En stock" }
}

export const selectStockPorTalle = (state) => {
  const { producto } = state.detalleProducto
  if (!producto) return {}

  return (
    producto.stockDisponible?.reduce((acc, stock) => {
      acc[stock.numeroTalle] = stock.cantidad
      return acc
    }, {}) || {}
  )
}

export default detalleProductoSlice.reducer
