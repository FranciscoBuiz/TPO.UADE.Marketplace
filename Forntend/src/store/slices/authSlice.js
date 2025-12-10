import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosAuth } from "../../servicios/api"

// AsyncThunks
export const iniciarSesion = createAsyncThunk(
  "auth/iniciarSesion",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await serviciosAuth.iniciarSesion(email, password)

      return {
        token: response.accessToken || response.token,
        usuario: response.usuario,
      }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al iniciar sesión")
    }
  }
)

export const registrarse = createAsyncThunk(
  "auth/registrarse",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await serviciosAuth.registrarse(
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.password,
        "USER"
      )

      return {
        token: response.accessToken || response.token,
        usuario: response.usuario,
      }
    } catch (error) {
      if (error.status === 409 || (error.mensaje && error.mensaje.includes("ya está en uso"))) {
        return rejectWithValue("Ese email ya está asociado a un usuario");
      }
      return rejectWithValue(error.mensaje || "Error al registrarse");
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    usuario: null,
    token: null,
    estaAutenticado: false,
    cargando: false,
    error: null,
    esAdmin: false,

    formularioLogin: {
      email: "",
      password: "",
    },

    formularioRegistro: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmarPassword: "",
    },

    errorLocal: "",
  },
  reducers: {
    cerrarSesion: (state) => {
      state.usuario = null
      state.token = null
      state.estaAutenticado = false
      state.esAdmin = false
      state.error = null
      state.errorLocal = ""
      state.formularioLogin = { email: "", password: "" }
      state.formularioRegistro = {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmarPassword: "",
      }
    },
    limpiarError: (state) => {
      state.error = null
      state.errorLocal = ""
    },
    actualizarUsuario: (state, action) => {
      state.usuario = action.payload
      state.esAdmin = action.payload?.rol === "ADMIN"
    },
    actualizarFormularioLogin: (state, action) => {
      state.formularioLogin = { ...state.formularioLogin, ...action.payload }
      state.errorLocal = ""
    },
    limpiarFormularioLogin: (state) => {
      state.formularioLogin = { email: "", password: "" }
      state.errorLocal = ""
    },
    actualizarFormularioRegistro: (state, action) => {
      state.formularioRegistro = { ...state.formularioRegistro, ...action.payload }
      state.errorLocal = ""
    },
    limpiarFormularioRegistro: (state) => {
      state.formularioRegistro = {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmarPassword: "",
      }
      state.errorLocal = ""
    },
    establecerErrorLocal: (state, action) => {
      state.errorLocal = action.payload
    },
    limpiarErrorLocal: (state) => {
      state.errorLocal = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true
        state.error = null
        state.errorLocal = ""
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false
        state.usuario = action.payload.usuario
        state.token = action.payload.token
        state.estaAutenticado = true
        state.esAdmin = action.payload.usuario?.rol === "ADMIN"
        state.error = null
        state.errorLocal = ""
        state.formularioLogin = { email: "", password: "" }
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.estaAutenticado = false
      })
      .addCase(registrarse.pending, (state) => {
        state.cargando = true
        state.error = null
        state.errorLocal = ""
      })
      .addCase(registrarse.fulfilled, (state, action) => {
        state.cargando = false
        state.usuario = action.payload.usuario
        state.token = action.payload.token
        state.estaAutenticado = true
        state.esAdmin = action.payload.usuario?.rol === "ADMIN"
        state.error = null
        state.errorLocal = ""
        state.formularioRegistro = {
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          confirmarPassword: "",
        }
      })
      .addCase(registrarse.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.estaAutenticado = false
      })
  },
})

export const {
  cerrarSesion,
  limpiarError,
  actualizarUsuario,
  actualizarFormularioLogin,
  limpiarFormularioLogin,
  actualizarFormularioRegistro,
  limpiarFormularioRegistro,
  establecerErrorLocal,
  limpiarErrorLocal,
} = authSlice.actions

export default authSlice.reducer
