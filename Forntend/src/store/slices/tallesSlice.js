import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosTalles } from "../../servicios/api"

// AsyncThunks para talles
export const obtenerTalles = createAsyncThunk("talles/obtenerTalles", async (_, { rejectWithValue }) => {
  try {
    const response = await serviciosTalles.obtenerTodos()
    return response
  } catch (error) {
    return rejectWithValue(error.mensaje || "Error al obtener talles")
  }
})

export const crearTalle = createAsyncThunk("talles/crearTalle", async (talleData, { rejectWithValue }) => {
  try {
    const response = await serviciosTalles.crear(talleData)
    return response
  } catch (error) {
    if (
      error.mensaje &&
      (error.mensaje.includes("duplicate") ||
        error.mensaje.includes("duplicado") ||
        error.mensaje.includes("already exists") ||
        error.mensaje.includes("ya existe") ||
        error.mensaje.includes("Duplicate entry") ||
        error.mensaje.includes("unique constraint"))
    ) {
      return rejectWithValue("TALLE_DUPLICADO")
    }
    return rejectWithValue(error.mensaje || "Error al crear talle")
  }
})

export const actualizarTalle = createAsyncThunk(
  "talles/actualizarTalle",
  async ({ id, talleData }, { rejectWithValue }) => {
    try {
      const response = await serviciosTalles.actualizar(id, talleData)
      return response
    } catch (error) {

      if (
        error.mensaje &&
        (error.mensaje.includes("duplicate") ||
          error.mensaje.includes("duplicado") ||
          error.mensaje.includes("already exists") ||
          error.mensaje.includes("ya existe") ||
          error.mensaje.includes("Duplicate entry") ||
          error.mensaje.includes("unique constraint"))
      ) {
        return rejectWithValue("TALLE_DUPLICADO")
      }
      return rejectWithValue(error.mensaje || "Error al actualizar talle")
    }
  },
)

export const eliminarTalle = createAsyncThunk("talles/eliminarTalle", async (id, { rejectWithValue }) => {
  try {
    await serviciosTalles.eliminar(id)
    return id
  } catch (error) {
    if (
      error.mensaje &&
      (error.mensaje.includes("foreign key") ||
        error.mensaje.includes("constraint") ||
        error.mensaje.includes("asociad") ||
        error.mensaje.includes("referenced") ||
        error.mensaje.includes("cannot delete"))
    ) {
      return rejectWithValue("TALLE_ASOCIADO")
    }

    if (error.status === 404) {
      return id 
    }

    return rejectWithValue(error.mensaje || "Error al eliminar talle")
  }
})

const tallesSlice = createSlice({
  name: "talles",
  initialState: {
    // Datos principales
    talles: [],
    cargando: false,
    error: null,
    talleSeleccionado: null,


    mostrarFormulario: false,
    talleEditando: null,
    formulario: {
      numero: "",
    },
    mensajeExito: "",
    advertencia: "",
    errorFormulario: "",
  },
  reducers: {
    // Acciones de limpieza
    limpiarError: (state) => {
      state.error = null
    },
    limpiarMensajes: (state) => {
      state.mensajeExito = ""
      state.advertencia = ""
      state.errorFormulario = ""
      state.error = null
    },

    // Acciones de selección
    seleccionarTalle: (state, action) => {
      state.talleSeleccionado = action.payload
    },
    limpiarSeleccion: (state) => {
      state.talleSeleccionado = null
    },

    // Acciones de formulario
    mostrarFormularioCrear: (state) => {
      state.mostrarFormulario = true
      state.talleEditando = null
      state.formulario = { numero: "" }
      state.mensajeExito = ""
      state.advertencia = ""
      state.errorFormulario = ""
      state.error = null
    },
    mostrarFormularioEditar: (state, action) => {
      state.mostrarFormulario = true
      state.talleEditando = action.payload
      state.formulario = { numero: String(action.payload.numero || "") }
      state.mensajeExito = ""
      state.advertencia = ""
      state.errorFormulario = ""
      state.error = null
    },
    ocultarFormulario: (state) => {
      state.mostrarFormulario = false
      state.talleEditando = null
      state.formulario = { numero: "" }
      state.errorFormulario = ""
    },
    actualizarFormulario: (state, action) => {
      state.formulario = { ...state.formulario, ...action.payload }
    },

    // Acciones de mensajes
    establecerMensajeExito: (state, action) => {
      state.mensajeExito = action.payload
      state.advertencia = ""
      state.errorFormulario = ""
    },
    establecerAdvertencia: (state, action) => {
      state.advertencia = action.payload
      state.mensajeExito = ""
      state.errorFormulario = ""
    },
    establecerErrorFormulario: (state, action) => {
      state.errorFormulario = action.payload
      state.mensajeExito = ""
      state.advertencia = ""
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener talles
      .addCase(obtenerTalles.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerTalles.fulfilled, (state, action) => {
        state.cargando = false
        state.talles = action.payload
        state.error = null
      })
      .addCase(obtenerTalles.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      // Crear talle
      .addCase(crearTalle.pending, (state) => {
        state.cargando = true
        state.error = null
        state.errorFormulario = ""
      })
      .addCase(crearTalle.fulfilled, (state, action) => {
        state.cargando = false
        state.talles.push(action.payload)
        state.error = null
        state.mensajeExito = "Talle creado exitosamente"
        state.advertencia = ""
        state.errorFormulario = ""
        // Resetear formulario
        state.mostrarFormulario = false
        state.talleEditando = null
        state.formulario = { numero: "" }
      })
      .addCase(crearTalle.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "TALLE_DUPLICADO") {
          state.errorFormulario = "Ya existe un talle con ese número"
        } else {
          state.errorFormulario = "Error al crear el talle"
        }
 
        if (action.payload !== "TALLE_DUPLICADO") {
          state.error = action.payload
        }
      })

      // Actualizar talle
      .addCase(actualizarTalle.pending, (state) => {
        state.cargando = true
        state.error = null
        state.errorFormulario = ""
      })
      .addCase(actualizarTalle.fulfilled, (state, action) => {
        state.cargando = false
        const index = state.talles.findIndex((talle) => talle.id === action.payload.id)
        if (index !== -1) {
          state.talles[index] = action.payload
        }
        state.error = null
        state.mensajeExito = "Talle actualizado exitosamente"
        state.advertencia = ""
        state.errorFormulario = ""
        // Resetear formulario
        state.mostrarFormulario = false
        state.talleEditando = null
        state.formulario = { numero: "" }
      })
      .addCase(actualizarTalle.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "TALLE_DUPLICADO") {
          state.errorFormulario = "Ya existe un talle con ese número"
        } else {
          state.errorFormulario = "Error al actualizar el talle"
        }
  
        if (action.payload !== "TALLE_DUPLICADO") {
          state.error = action.payload
        }
      })

      // Eliminar talle
      .addCase(eliminarTalle.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(eliminarTalle.fulfilled, (state, action) => {
        state.cargando = false
        state.talles = state.talles.filter((talle) => talle.id !== action.payload)
        state.error = null
        state.mensajeExito = "Talle eliminado exitosamente"
        state.advertencia = ""
      })
      .addCase(eliminarTalle.rejected, (state, action) => {
        state.cargando = false
        if (action.payload === "TALLE_ASOCIADO") {
          state.advertencia = "No se puede eliminar el talle porque está asociado a una o más zapatillas"
        } else {
          state.advertencia = "No se puede eliminar el talle porque está asociado a una o más zapatillas"
        }
 
        if (action.payload !== "TALLE_ASOCIADO") {
          state.error = action.payload
        }
      })
  },
})

export const {
  limpiarError,
  limpiarMensajes,
  seleccionarTalle,
  limpiarSeleccion,
  mostrarFormularioCrear,
  mostrarFormularioEditar,
  ocultarFormulario,
  actualizarFormulario,
  establecerMensajeExito,
  establecerAdvertencia,
  establecerErrorFormulario,
} = tallesSlice.actions

export default tallesSlice.reducer
