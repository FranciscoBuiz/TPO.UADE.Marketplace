import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosMarcas } from "../../servicios/api"

// AsyncThunks
export const obtenerMarcas = createAsyncThunk("marcas/obtenerMarcas", async (_, { rejectWithValue }) => {
  try {
    const response = await serviciosMarcas.obtenerTodas()
    return response
  } catch (error) {
    return rejectWithValue(error.mensaje || "Error al obtener marcas")
  }
})

export const crearMarca = createAsyncThunk("marcas/crearMarca", async (marcaData, { rejectWithValue }) => {
  try {
    const response = await serviciosMarcas.crear(marcaData)
    return response
  } catch (error) {
    if (
      error.mensaje &&
      (error.mensaje.includes("duplicate") || error.mensaje.includes("unique") || error.mensaje.includes("ya existe"))
    ) {
      return rejectWithValue("MARCA_DUPLICADA")
    }
    return rejectWithValue(error.mensaje || "Error al crear marca")
  }
})

export const actualizarMarca = createAsyncThunk(
  "marcas/actualizarMarca",
  async ({ id, marcaData }, { rejectWithValue }) => {
    try {
      const response = await serviciosMarcas.actualizar(id, marcaData)
      return response
    } catch (error) {
      if (
        error.mensaje &&
        (error.mensaje.includes("duplicate") || error.mensaje.includes("unique") || error.mensaje.includes("ya existe"))
      ) {
        return rejectWithValue("MARCA_DUPLICADA")
      }
      return rejectWithValue(error.mensaje || "Error al actualizar marca")
    }
  }
)

export const eliminarMarca = createAsyncThunk("marcas/eliminarMarca", async (id, { rejectWithValue }) => {
  try {
    await serviciosMarcas.eliminar(id)
    return id
  } catch (error) {
    try {
      await serviciosMarcas.obtenerPorId(id)
      return rejectWithValue("MARCA_ASOCIADA")
    } catch (notFoundError) {
      if (notFoundError.status === 404) {
        return id
      }
      return rejectWithValue("Error desconocido al eliminar la marca")
    }
  }
})

const marcasSlice = createSlice({
  name: "marcas",
  initialState: {
    marcas: [],
    cargando: false,
    error: null,
    marcaSeleccionada: null,
    mostrarFormulario: false,
    marcaEditando: null,
    formulario: { nombre: "" },
    mensajeExito: "",
    advertencia: "",
    filtroNombre: "",
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null
    },
    limpiarMensajes: (state) => {
      state.error = null
      state.mensajeExito = ""
      state.advertencia = ""
    },
    seleccionarMarca: (state, action) => {
      state.marcaSeleccionada = action.payload
    },
    limpiarSeleccion: (state) => {
      state.marcaSeleccionada = null
    },
    mostrarFormularioCrear: (state) => {
      state.mostrarFormulario = true
      state.marcaEditando = null
      state.formulario = { nombre: "" }
      state.mensajeExito = ""
      state.advertencia = ""
      state.error = null
    },
    mostrarFormularioEditar: (state, action) => {
      state.mostrarFormulario = true
      state.marcaEditando = action.payload
      state.formulario = { nombre: action.payload.nombre }
      state.mensajeExito = ""
      state.advertencia = ""
      state.error = null
    },
    ocultarFormulario: (state) => {
      state.mostrarFormulario = false
      state.marcaEditando = null
      state.formulario = { nombre: "" }
      state.mensajeExito = ""
      state.advertencia = ""
      state.error = null
    },
    actualizarFormulario: (state, action) => {
      state.formulario = { ...state.formulario, ...action.payload }
    },
    establecerMensajeExito: (state, action) => {
      state.mensajeExito = action.payload
      state.advertencia = ""
      state.error = null
    },
    establecerAdvertencia: (state, action) => {
      state.advertencia = action.payload
      state.mensajeExito = ""
      state.error = null
    },
    limpiarMensajeExito: (state) => {
      state.mensajeExito = ""
    },
    limpiarAdvertencia: (state) => {
      state.advertencia = ""
    },
    establecerFiltroNombre: (state, action) => {
      state.filtroNombre = action.payload
    },
    limpiarFiltros: (state) => {
      state.filtroNombre = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerMarcas.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerMarcas.fulfilled, (state, action) => {
        state.cargando = false
        state.marcas = action.payload
        state.error = null
      })
      .addCase(obtenerMarcas.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(crearMarca.pending, (state) => {
        state.cargando = true
        state.error = null
        state.advertencia = ""
      })
      .addCase(crearMarca.fulfilled, (state, action) => {
        state.cargando = false
        state.marcas.push(action.payload)
        state.error = null
        state.mensajeExito = "Marca creada exitosamente"
        state.advertencia = ""
        state.mostrarFormulario = false
        state.marcaEditando = null
        state.formulario = { nombre: "" }
      })
      .addCase(crearMarca.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "MARCA_DUPLICADA") {
          state.advertencia = "Ya existe una marca con ese nombre"
        } else {
          state.advertencia = "Error al crear la marca. Inténtalo nuevamente"
        }
        state.mensajeExito = ""
      })

      .addCase(actualizarMarca.pending, (state) => {
        state.cargando = true
        state.error = null
        state.advertencia = ""
      })
      .addCase(actualizarMarca.fulfilled, (state, action) => {
        state.cargando = false
        const index = state.marcas.findIndex((marca) => marca.id === action.payload.id)
        if (index !== -1) {
          state.marcas[index] = action.payload
        }
        state.error = null
        state.mensajeExito = "Marca actualizada exitosamente"
        state.advertencia = ""
        state.mostrarFormulario = false
        state.marcaEditando = null
        state.formulario = { nombre: "" }
      })
      .addCase(actualizarMarca.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "MARCA_DUPLICADA") {
          state.advertencia = "Ya existe una marca con ese nombre"
        } else {
          state.advertencia = "Error al actualizar la marca. Inténtalo nuevamente"
        }
        state.mensajeExito = ""
      })

      .addCase(eliminarMarca.pending, (state) => {
        state.cargando = true
        state.error = null
        state.advertencia = ""
      })
      .addCase(eliminarMarca.fulfilled, (state, action) => {
        state.cargando = false
        state.marcas = state.marcas.filter((marca) => marca.id !== action.payload)
        state.error = null
        state.mensajeExito = "Marca eliminada exitosamente"
        state.advertencia = ""
      })
      .addCase(eliminarMarca.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "MARCA_ASOCIADA") {
          state.advertencia = "No se puede eliminar la marca porque está asociada a una o más zapatillas"
        } else {
          state.advertencia = "Error al eliminar la marca. Inténtalo nuevamente"
        }
        state.mensajeExito = ""
      })
  },
})

export const {
  limpiarError,
  limpiarMensajes,
  seleccionarMarca,
  limpiarSeleccion,
  mostrarFormularioCrear,
  mostrarFormularioEditar,
  ocultarFormulario,
  actualizarFormulario,
  establecerMensajeExito,
  establecerAdvertencia,
  limpiarMensajeExito,
  limpiarAdvertencia,
  establecerFiltroNombre,
  limpiarFiltros,
} = marcasSlice.actions

export default marcasSlice.reducer
