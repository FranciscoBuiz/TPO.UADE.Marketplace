import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Thunk para enviar el formulario de contacto
export const enviarFormularioContacto = createAsyncThunk(
  "contacto/enviarFormulario",
  async (datosFormulario, { rejectWithValue }) => {
    try {
 
      await new Promise((resolve) => setTimeout(resolve, 2000))


      return {
        success: true,
        mensaje: "¡Mensaje enviado correctamente! Te responderemos pronto.",
      }
    } catch (error) {
      return rejectWithValue("Error al enviar el mensaje. Por favor, intenta nuevamente.")
    }
  },
)

const contactoSlice = createSlice({
  name: "contacto",
  initialState: {
    formData: {
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    },
    enviando: false,
    mensaje: {
      tipo: "",
      texto: "",
    },
    faqAbierto: null,
    error: null,
  },
  reducers: {
    actualizarFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      }
    },
    limpiarFormulario: (state) => {
      state.formData = {
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      }
    },
    establecerMensaje: (state, action) => {
      state.mensaje = action.payload
    },
    limpiarMensaje: (state) => {
      state.mensaje = {
        tipo: "",
        texto: "",
      }
    },
    toggleFaq: (state, action) => {
      state.faqAbierto = state.faqAbierto === action.payload ? null : action.payload
    },
    limpiarError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarFormularioContacto.pending, (state) => {
        state.enviando = true
        state.mensaje = { tipo: "", texto: "" }
        state.error = null
      })
      .addCase(enviarFormularioContacto.fulfilled, (state, action) => {
        state.enviando = false
        state.mensaje = {
          tipo: "success",
          texto: action.payload.mensaje,
        }
        // Limpiar formulario después del envío exitoso
        state.formData = {
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        }
      })
      .addCase(enviarFormularioContacto.rejected, (state, action) => {
        state.enviando = false
        state.mensaje = {
          tipo: "error",
          texto: action.payload,
        }
        state.error = action.payload
      })
  },
})

export const { actualizarFormData, limpiarFormulario, establecerMensaje, limpiarMensaje, toggleFaq, limpiarError } =
  contactoSlice.actions

export default contactoSlice.reducer
