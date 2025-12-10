import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosCompras } from "../../servicios/api"



// Cargar todas las compras
export const cargarTodasLasCompras = createAsyncThunk(
  "historialCompras/cargarTodas",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const compras = await serviciosCompras.obtenerTodasLasCompras(token)

      return compras
    } catch (error) {

      return rejectWithValue(error.message || "Error al cargar las compras")
    }
  },
)

// Cargar estadísticas
export const cargarEstadisticas = createAsyncThunk(
  "historialCompras/cargarEstadisticas",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const estadisticas = await serviciosCompras.obtenerEstadisticas(token)

      return estadisticas
    } catch (error) {

      return rejectWithValue(error.message || "Error al cargar estadísticas")
    }
  },
)

// Cargar ventas por mes
export const cargarVentasPorMes = createAsyncThunk(
  "historialCompras/cargarVentasPorMes",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const ventas = await serviciosCompras.obtenerVentasPorMes(token)

      return ventas
    } catch (error) {

      return rejectWithValue(error.message || "Error al cargar ventas por mes")
    }
  },
)

// Cargar compras por fecha
export const cargarComprasPorFecha = createAsyncThunk(
  "historialCompras/cargarPorFecha",
  async ({ fechaInicio, fechaFin, usuarioId = null }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const compras = await serviciosCompras.obtenerComprasPorFecha(fechaInicio, fechaFin, usuarioId, token)

      return compras
    } catch (error) {

      return rejectWithValue(error.message || "Error al cargar compras por fecha")
    }
  },
)

// Cargar todos los datos (compras + estadísticas + ventas)
export const cargarTodosLosDatos = createAsyncThunk(
  "historialCompras/cargarTodos",
  async (_, { dispatch, rejectWithValue }) => {
    try {


      const resultados = await Promise.allSettled([
        dispatch(cargarTodasLasCompras()).unwrap(),
        dispatch(cargarEstadisticas()).unwrap(),
        dispatch(cargarVentasPorMes()).unwrap(),
      ])


      return {
        compras: resultados[0].status === "fulfilled" ? resultados[0].value : [],
        estadisticas: resultados[1].status === "fulfilled" ? resultados[1].value : null,
        ventasPorMes: resultados[2].status === "fulfilled" ? resultados[2].value : [],
      }
    } catch (error) {

      return rejectWithValue(error.message || "Error al cargar los datos")
    }
  },
)



const aplicarFiltros = (compras, filtros) => {
  let comprasFiltradas = [...compras]

  if (filtros.usuario) {
    comprasFiltradas = comprasFiltradas.filter(
      (compra) =>
        compra.usuarioNombre?.toLowerCase().includes(filtros.usuario.toLowerCase()) ||
        compra.usuarioEmail?.toLowerCase().includes(filtros.usuario.toLowerCase()),
    )
  }

  if (filtros.fechaInicio && filtros.fechaFin) {
    const fechaInicio = new Date(filtros.fechaInicio)
    const fechaFin = new Date(filtros.fechaFin)
    fechaFin.setHours(23, 59, 59, 999)

    comprasFiltradas = comprasFiltradas.filter((compra) => {
      const fechaCompra = new Date(compra.fechaCompra)
      return fechaCompra >= fechaInicio && fechaCompra <= fechaFin
    })
  }

  if (filtros.mes || filtros.año) {
    comprasFiltradas = comprasFiltradas.filter((compra) => {
      const fechaCompra = new Date(compra.fechaCompra)
      const mesCompra = fechaCompra.getMonth() + 1
      const añoCompra = fechaCompra.getFullYear()

      const cumpleMes = !filtros.mes || mesCompra === Number.parseInt(filtros.mes)
      const cumpleAño = !filtros.año || añoCompra === Number.parseInt(filtros.año)

      return cumpleMes && cumpleAño
    })
  }

  return comprasFiltradas
}



const historialComprasSlice = createSlice({
  name: "historialCompras",
  initialState: {
    compras: [],
    comprasFiltradas: [],
    estadisticas: null,
    ventasPorMes: [],
    loading: false,
    loadingCompras: false,
    loadingEstadisticas: false,
    loadingVentas: false,
    error: null,
    errorCompras: null,
    errorEstadisticas: null,
    errorVentas: null,
    filtros: {
      usuario: "",
      fechaInicio: "",
      fechaFin: "",
      mes: "",
      año: "",
    },
    mostrarFiltros: true,
    ordenamiento: "fecha-desc",
    paginaActual: 1,
    itemsPorPagina: 20,
  },
  reducers: {
    actualizarFiltro: (state, action) => {
      const { campo, valor } = action.payload
      state.filtros[campo] = valor
      state.comprasFiltradas = aplicarFiltros(state.compras, state.filtros)
      state.paginaActual = 1
    },

    actualizarFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload }
      state.comprasFiltradas = aplicarFiltros(state.compras, state.filtros)
      state.paginaActual = 1
    },

    limpiarFiltros: (state) => {
      state.filtros = {
        usuario: "",
        fechaInicio: "",
        fechaFin: "",
        mes: "",
        año: "",
      }
      state.comprasFiltradas = [...state.compras]
      state.paginaActual = 1
    },

    toggleFiltros: (state) => {
      state.mostrarFiltros = !state.mostrarFiltros
    },

    cambiarOrdenamiento: (state, action) => {
      const nuevoOrden = action.payload
      state.ordenamiento = nuevoOrden

      switch (nuevoOrden) {
        case "fecha-desc":
          state.comprasFiltradas.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
          break
        case "fecha-asc":
          state.comprasFiltradas.sort((a, b) => new Date(a.fechaCompra) - new Date(b.fechaCompra))
          break
        case "total-desc":
          state.comprasFiltradas.sort((a, b) => b.total - a.total)
          break
        case "total-asc":
          state.comprasFiltradas.sort((a, b) => a.total - b.total)
          break
      }
    },

    cambiarPagina: (state, action) => {
      state.paginaActual = action.payload
    },

    cambiarItemsPorPagina: (state, action) => {
      state.itemsPorPagina = action.payload
      state.paginaActual = 1
    },

    limpiarError: (state) => {
      state.error = null
      state.errorCompras = null
      state.errorEstadisticas = null
      state.errorVentas = null
    },

    limpiarErrorEspecifico: (state, action) => {
      const tipo = action.payload
      state[`error${tipo}`] = null
    },

    resetearEstado: (state) => {
      return {
        ...historialComprasSlice.getInitialState(),
        mostrarFiltros: state.mostrarFiltros,
        itemsPorPagina: state.itemsPorPagina,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarTodasLasCompras.pending, (state) => {
        state.loadingCompras = true
        state.errorCompras = null
      })
      .addCase(cargarTodasLasCompras.fulfilled, (state, action) => {
        state.loadingCompras = false
        state.compras = action.payload || []
        state.comprasFiltradas = aplicarFiltros(action.payload || [], state.filtros)
        state.errorCompras = null
      })
      .addCase(cargarTodasLasCompras.rejected, (state, action) => {
        state.loadingCompras = false
        state.errorCompras = action.payload || "Error al cargar compras"
      })

    builder
      .addCase(cargarEstadisticas.pending, (state) => {
        state.loadingEstadisticas = true
        state.errorEstadisticas = null
      })
      .addCase(cargarEstadisticas.fulfilled, (state, action) => {
        state.loadingEstadisticas = false
        state.estadisticas = action.payload
        state.errorEstadisticas = null
      })
      .addCase(cargarEstadisticas.rejected, (state, action) => {
        state.loadingEstadisticas = false
        state.errorEstadisticas = action.payload || "Error al cargar estadísticas"
      })

    builder
      .addCase(cargarVentasPorMes.pending, (state) => {
        state.loadingVentas = true
        state.errorVentas = null
      })
      .addCase(cargarVentasPorMes.fulfilled, (state, action) => {
        state.loadingVentas = false
        state.ventasPorMes = action.payload || []
        state.errorVentas = null
      })
      .addCase(cargarVentasPorMes.rejected, (state, action) => {
        state.loadingVentas = false
        state.errorVentas = action.payload || "Error al cargar ventas por mes"
      })

    builder
      .addCase(cargarComprasPorFecha.pending, (state) => {
        state.loadingCompras = true
        state.errorCompras = null
      })
      .addCase(cargarComprasPorFecha.fulfilled, (state, action) => {
        state.loadingCompras = false
        state.compras = action.payload || []
        state.comprasFiltradas = aplicarFiltros(action.payload || [], state.filtros)
        state.errorCompras = null
      })
      .addCase(cargarComprasPorFecha.rejected, (state, action) => {
        state.loadingCompras = false
        state.errorCompras = action.payload || "Error al cargar compras por fecha"
      })

    builder
      .addCase(cargarTodosLosDatos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cargarTodosLosDatos.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(cargarTodosLosDatos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar los datos"
      })
  },
})



export const selectHistorialCompras = (state) => state.historialCompras
export const selectCompras = (state) => state.historialCompras.compras
export const selectComprasFiltradas = (state) => state.historialCompras.comprasFiltradas
export const selectEstadisticas = (state) => state.historialCompras.estadisticas
export const selectVentasPorMes = (state) => state.historialCompras.ventasPorMes

export const selectLoading = (state) => state.historialCompras.loading
export const selectLoadingCompras = (state) => state.historialCompras.loadingCompras
export const selectLoadingEstadisticas = (state) => state.historialCompras.loadingEstadisticas
export const selectLoadingVentas = (state) => state.historialCompras.loadingVentas

export const selectError = (state) => state.historialCompras.error
export const selectErrorCompras = (state) => state.historialCompras.errorCompras
export const selectErrorEstadisticas = (state) => state.historialCompras.errorEstadisticas
export const selectErrorVentas = (state) => state.historialCompras.errorVentas

export const selectFiltros = (state) => state.historialCompras.filtros
export const selectMostrarFiltros = (state) => state.historialCompras.mostrarFiltros
export const selectOrdenamiento = (state) => state.historialCompras.ordenamiento
export const selectPaginaActual = (state) => state.historialCompras.paginaActual
export const selectItemsPorPagina = (state) => state.historialCompras.itemsPorPagina

export const selectComprasPaginadas = (state) => {
  const { comprasFiltradas, paginaActual, itemsPorPagina } = state.historialCompras
  const inicio = (paginaActual - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return comprasFiltradas.slice(inicio, fin)
}

export const selectTotalPaginas = (state) => {
  const { comprasFiltradas, itemsPorPagina } = state.historialCompras
  return Math.ceil(comprasFiltradas.length / itemsPorPagina)
}

export const selectEstadisticasFiltradas = (state) => {
  const comprasFiltradas = state.historialCompras.comprasFiltradas

  if (comprasFiltradas.length === 0) {
    return {
      totalCompras: 0,
      totalVentas: 0,
      promedioCompra: 0,
      totalProductos: 0,
    }
  }

  const totalVentas = comprasFiltradas.reduce((sum, compra) => sum + compra.total, 0)
  const totalProductos = comprasFiltradas.reduce((sum, compra) => sum + (compra.items?.length || 0), 0)

  return {
    totalCompras: comprasFiltradas.length,
    totalVentas,
    promedioCompra: totalVentas / comprasFiltradas.length,
    totalProductos,
  }
}

export const selectHayFiltrosActivos = (state) => {
  const filtros = state.historialCompras.filtros
  return Object.values(filtros).some((valor) => valor !== "")
}


export const {
  actualizarFiltro,
  actualizarFiltros,
  limpiarFiltros,
  toggleFiltros,
  cambiarOrdenamiento,
  cambiarPagina,
  cambiarItemsPorPagina,
  limpiarError,
  limpiarErrorEspecifico,
  resetearEstado,
} = historialComprasSlice.actions

export default historialComprasSlice.reducer
