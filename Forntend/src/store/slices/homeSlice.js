import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosProductos, serviciosMarcas } from "../../servicios/api"

const initialState = {
  productosDestacados: [],
  marcas: [],
  cargando: false,
  error: null,
}

// Async thunk para cargar todos los datos del home
export const cargarDatosHome = createAsyncThunk("home/cargarDatos", async (_, { rejectWithValue }) => {
  try {

    const [productos, marcasData] = await Promise.all([
      serviciosProductos.obtenerTodos(),
      serviciosMarcas.obtenerTodas(),
    ])

    return {
      productosDestacados: productos.slice(0, 6), // Solo los primeros 6
      marcas: marcasData,
    }
  } catch (error) {

    return rejectWithValue(error.mensaje || "Error al cargar datos")
  }
})

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.error = null
    },
    resetearHome: (state) => {
      state.productosDestacados = []
      state.marcas = []
      state.cargando = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarDatosHome.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(cargarDatosHome.fulfilled, (state, action) => {
        state.cargando = false
        state.productosDestacados = action.payload.productosDestacados
        state.marcas = action.payload.marcas
        state.error = null
      })
      .addCase(cargarDatosHome.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
  },
})

export const { limpiarError, resetearHome } = homeSlice.actions
export default homeSlice.reducer
