import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosUsuarios } from "../../servicios/api"

// AsyncThunks con token desde Redux
export const obtenerUsuarios = createAsyncThunk(
  "usuarios/obtenerUsuarios",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const response = await serviciosUsuarios.obtenerTodos(token)
      return response
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al obtener usuarios")
    }
  }
)

export const obtenerUsuarioPorId = createAsyncThunk(
  "usuarios/obtenerUsuarioPorId",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const response = await serviciosUsuarios.obtenerPorId(id, token)
      return response
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al obtener usuario")
    }
  }
)

export const actualizarUsuario = createAsyncThunk(
  "usuarios/actualizarUsuario",
  async ({ id, usuarioData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const response = await serviciosUsuarios.actualizar(id, usuarioData, token)
      return response
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al actualizar usuario")
    }
  }
)

export const eliminarUsuario = createAsyncThunk(
  "usuarios/eliminarUsuario",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      await serviciosUsuarios.eliminar(id, token)
      return id
    } catch (error) {
      try {
        const token = getState().auth.token
        await serviciosUsuarios.obtenerPorId(id, token)
        return rejectWithValue("USUARIO_ASOCIADO")
      } catch {
        return id
      }
    }
  }
)

export const cambiarRolUsuario = createAsyncThunk(
  "usuarios/cambiarRolUsuario",
  async ({ id, rol }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const response = await serviciosUsuarios.actualizarRol(id, rol, token)
      return response
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al cambiar rol")
    }
  }
)


const calcularDatosDerivados = (state) => {
  const filtro = state.filtroNombre.toLowerCase().trim()

  state.usuariosFiltrados = filtro
    ? state.usuarios.filter(
        (usuario) =>
          usuario.nombre?.toLowerCase().includes(filtro) ||
          usuario.apellido?.toLowerCase().includes(filtro) ||
          usuario.email?.toLowerCase().includes(filtro)
      )
    : state.usuarios

  state.estadisticas = {
    total: state.usuarios.length,
    admins: state.usuarios.filter((u) => u.rol === "ADMIN").length,
    users: state.usuarios.filter((u) => u.rol === "USER").length,
  }
}

const usuariosSlice = createSlice({
  name: "usuarios",
  initialState: {
    usuarios: [],
    usuarioSeleccionado: null,
    cargando: false,
    error: null,
    filtroNombre: "",
    estadisticas: {
      total: 0,
      admins: 0,
      users: 0,
    },
    usuariosFiltrados: [],
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null
    },
    seleccionarUsuario: (state, action) => {
      state.usuarioSeleccionado = action.payload
    },
    limpiarSeleccion: (state) => {
      state.usuarioSeleccionado = null
    },
    establecerFiltroNombre: (state, action) => {
      state.filtroNombre = action.payload
      calcularDatosDerivados(state)
    },
    limpiarFiltroNombre: (state) => {
      state.filtroNombre = ""
      calcularDatosDerivados(state)
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener todos
      .addCase(obtenerUsuarios.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerUsuarios.fulfilled, (state, action) => {
        state.cargando = false
        state.usuarios = action.payload
        state.error = null
        calcularDatosDerivados(state)
      })
      .addCase(obtenerUsuarios.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      // Obtener por ID
      .addCase(obtenerUsuarioPorId.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerUsuarioPorId.fulfilled, (state, action) => {
        state.cargando = false
        state.usuarioSeleccionado = action.payload
        state.error = null
      })
      .addCase(obtenerUsuarioPorId.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      // Actualizar usuario
      .addCase(actualizarUsuario.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(actualizarUsuario.fulfilled, (state, action) => {
        state.cargando = false
        const index = state.usuarios.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.usuarios[index] = action.payload
        }
        if (state.usuarioSeleccionado?.id === action.payload.id) {
          state.usuarioSeleccionado = action.payload
        }
        calcularDatosDerivados(state)
      })
      .addCase(actualizarUsuario.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      // Eliminar
      .addCase(eliminarUsuario.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(eliminarUsuario.fulfilled, (state, action) => {
        state.cargando = false
        state.usuarios = state.usuarios.filter((u) => u.id !== action.payload)
        if (state.usuarioSeleccionado?.id === action.payload) {
          state.usuarioSeleccionado = null
        }
        calcularDatosDerivados(state)
      })
      .addCase(eliminarUsuario.rejected, (state, action) => {
        state.cargando = false
        if (action.payload !== "USUARIO_ASOCIADO") {
          state.error = action.payload
        }
      })

      // Cambiar rol
      .addCase(cambiarRolUsuario.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(cambiarRolUsuario.fulfilled, (state, action) => {
        state.cargando = false
        const index = state.usuarios.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.usuarios[index] = action.payload
        }
        if (state.usuarioSeleccionado?.id === action.payload.id) {
          state.usuarioSeleccionado = action.payload
        }
        calcularDatosDerivados(state)
      })
      .addCase(cambiarRolUsuario.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
  },
})

export const {
  limpiarError,
  seleccionarUsuario,
  limpiarSeleccion,
  establecerFiltroNombre,
  limpiarFiltroNombre,
} = usuariosSlice.actions

export default usuariosSlice.reducer
