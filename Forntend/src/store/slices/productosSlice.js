//SLICE DE PRODUCTO Y DE GESTION DE PRODUCTOS ADMIN

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { serviciosProductos, serviciosMarcas } from "../../servicios/api"

// AsyncThunks para productos
export const obtenerProductos = createAsyncThunk(
  "productos/obtenerProductos",
  async (filtros = {}, { rejectWithValue }) => {
    try {
      const response = await serviciosProductos.obtenerTodos(filtros)

      return response
    } catch (error) {
      return rejectWithValue(error.message || "Error al obtener productos")
    }
  },
)

export const cargarDatosProductos = createAsyncThunk(
  "productos/cargarDatosProductos",
  async (_, { rejectWithValue }) => {
    try {
      const [productosData, marcasData] = await Promise.all([
        serviciosProductos.obtenerTodos(),
        serviciosMarcas.obtenerTodas(),
      ])

      return {
        productos: productosData,
        marcas: marcasData,
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar datos")
    }
  },
)

export const obtenerProductoPorId = createAsyncThunk(
  "productos/obtenerProductoPorId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await serviciosProductos.obtenerPorId(id)

      return response
    } catch (error) {
      return rejectWithValue(error.message || "Error al obtener producto")
    }
  },
)

export const obtenerImg = createAsyncThunk("productos/obtenerImg", async (id, { rejectWithValue }) => {
  try {
    const response = await serviciosProductos.obtenerImg(id)

    return response
  } catch (error) {
    return rejectWithValue(error.message || "Error al obtener imagen de producto")
  }
})

export const crearProducto = createAsyncThunk("productos/crearProducto", async (productoData, { rejectWithValue }) => {
  try {
    const response = await serviciosProductos.crear(productoData)

    return response
  } catch (error) {
    return rejectWithValue(error.message || "Error al crear producto")
  }
})

export const actualizarProducto = createAsyncThunk(
  "productos/actualizarProducto",
  async ({ id, productoData }, { rejectWithValue }) => {
    try {
      const response = await serviciosProductos.actualizar(id, productoData)

      return response
    } catch (error) {
      return rejectWithValue(error.message || "Error al actualizar producto")
    }
  },
)

export const eliminarProducto = createAsyncThunk("productos/eliminarProducto", async (id, { rejectWithValue }) => {
  try {
    await serviciosProductos.eliminar(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || "Error al eliminar producto")
  }
})

// Replace the existing obtenerImgPorStockId thunk with:
export const obtenerImgPorStockId = createAsyncThunk(
  "productos/obtenerImgPorStockId",
  async (stockId, { rejectWithValue }) => {
    try {
      const imagen = await serviciosProductos.obtenerImgPorStockId(stockId)
      return { stockId, imagen }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al obtener imagen por stockId")
    }
  },
)

// Replace the existing obtenerCantidadPorStockId thunk with:
export const obtenerCantidadPorStockId = createAsyncThunk(
  "productos/obtenerCantidadPorStockId",
  async (stockId, { rejectWithValue }) => {
    try {
      const cantidad = await serviciosProductos.obtenerCantidadPorStockId(stockId)
      return { stockId, cantidad }
    } catch (error) {
      return rejectWithValue(error.mensaje || "Error al obtener cantidad por stockId")
    }
  },
)

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    productos: [],
    productosFiltrados: [],
    marcas: [],
    productoSeleccionado: null,
    imagenProductoSelecionado: null,
    cargando: false,
    error: null,
    mensajeExito: "",
    advertencia: "",
    mostrarFormulario: false,
    productoEditando: null,
    formulario: {
      modelo: "",
      descripcion: "",
      precio: "",
      marcaId: "",
      imagen: "",
      stockPorTalle: [],
    },
    filtroModelo: "",
    filtros: {
      busqueda: "",
      marcaId: "",
      precioMin: "",
      precioMax: "",
    },
    paginacion: {
      pagina: 1,
      totalPaginas: 1,
      totalElementos: 0,
    },
    imagenesPorStockId: {},
    cantidadesPorStockId: {},
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null
    },
    seleccionarProducto: (state, action) => {
      state.productoSeleccionado = action.payload
    },
    limpiarSeleccion: (state) => {
      state.productoSeleccionado = null
    },
    limpiarImagenSeleccionada: (state) => {
      state.imagenProductoSeleccionado = null
    },

    establecerMensajeExito: (state, action) => {
      state.mensajeExito = action.payload
    },
    limpiarMensajeExito: (state) => {
      state.mensajeExito = ""
    },
    establecerAdvertencia: (state, action) => {
      state.advertencia = action.payload
    },
    limpiarAdvertencia: (state) => {
      state.advertencia = ""
    },
    limpiarMensajes: (state) => {
      state.error = null
      state.mensajeExito = ""
      state.advertencia = ""
    },
    mostrarFormularioProducto: (state) => {
      state.mostrarFormulario = true
    },
    ocultarFormularioProducto: (state) => {
      state.mostrarFormulario = false
    },
    establecerProductoEditando: (state, action) => {
      state.productoEditando = action.payload
    },
    limpiarProductoEditando: (state) => {
      state.productoEditando = null
    },
    establecerFormulario: (state, action) => {
      state.formulario = { ...state.formulario, ...action.payload }
    },
    resetearFormulario: (state) => {
      state.formulario = {
        modelo: "",
        descripcion: "",
        precio: "",
        marcaId: "",
        imagen: "",
        stockPorTalle: [],
      }
      state.productoEditando = null
      state.mostrarFormulario = false
    },
    inicializarFormulario: (state, action) => {
      const { producto, talles } = action.payload

      if (producto) {
        const stockPorTalle = talles.map((talle) => {
          const stock = producto.stockDisponible?.find((s) => s.numeroTalle === talle.numero)
          return {
            talleId: talle.id,
            cantidad: stock ? stock.cantidad : 0,
          }
        })

        state.formulario = {
          modelo: producto.modelo || "",
          descripcion: producto.descripcion || "",
          precio: producto.precio?.toString() || "",
          marcaId: state.marcas.find((m) => m.nombre === producto.marca)?.id || "",
          imagen: producto.imagen || "",
          stockPorTalle: stockPorTalle,
        }
      } else {
        state.formulario = {
          modelo: "",
          descripcion: "",
          precio: "",
          marcaId: "",
          imagen: "",
          stockPorTalle: talles.map((talle) => ({
            talleId: talle.id,
            cantidad: 0,
          })),
        }
      }
    },
    actualizarStockFormulario: (state, action) => {
      const { talleId, cantidad } = action.payload
      state.formulario.stockPorTalle = state.formulario.stockPorTalle.map((stock) =>
        stock.talleId === talleId ? { ...stock, cantidad: Number(cantidad) || 0 } : stock,
      )
    },
    establecerFiltroModelo: (state, action) => {
      state.filtroModelo = action.payload
    },
    establecerFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload }
      // Aplicar filtros automáticamente cuando cambian
      productosSlice.caseReducers.aplicarFiltros(state)
    },
    limpiarFiltros: (state) => {
      state.filtros = {
        busqueda: "",
        marcaId: "",
        precioMin: "",
        precioMax: "",
      }
      // Aplicar filtros después de limpiar
      productosSlice.caseReducers.aplicarFiltros(state)
    },
    aplicarFiltros: (state) => {
      let productosFiltrados = [...state.productos]

      // Filtro por búsqueda (modelo)
      if (state.filtros.busqueda) {
        productosFiltrados = productosFiltrados.filter((producto) =>
          producto.modelo.toLowerCase().includes(state.filtros.busqueda.toLowerCase()),
        )
      }

      // Filtro por marca
      if (state.filtros.marcaId) {
        const marcaFiltro = state.marcas.find((m) => m.id === Number.parseInt(state.filtros.marcaId))
        if (marcaFiltro) {
          productosFiltrados = productosFiltrados.filter((producto) => producto.marca === marcaFiltro.nombre)
        }
      }

      // Filtro por precio mínimo
      if (state.filtros.precioMin) {
        productosFiltrados = productosFiltrados.filter(
          (producto) => producto.precio >= Number.parseFloat(state.filtros.precioMin),
        )
      }

      // Filtro por precio máximo
      if (state.filtros.precioMax) {
        productosFiltrados = productosFiltrados.filter(
          (producto) => producto.precio <= Number.parseFloat(state.filtros.precioMax),
        )
      }

      state.productosFiltrados = productosFiltrados
    },
    aplicarFiltroModelo: (state) => {
      state.productosFiltrados = state.productos.filter(
        (producto) =>
          producto.modelo?.toLowerCase().includes(state.filtroModelo.toLowerCase()) ||
          producto.marca?.toLowerCase().includes(state.filtroModelo.toLowerCase()),
      )
    },
    establecerPagina: (state, action) => {
      state.paginacion.pagina = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Cargar datos completos (productos + marcas)
      .addCase(cargarDatosProductos.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(cargarDatosProductos.fulfilled, (state, action) => {
        state.cargando = false
        state.productos = action.payload.productos
        state.marcas = action.payload.marcas
        state.error = null
        // Aplicar filtros después de cargar datos
        productosSlice.caseReducers.aplicarFiltros(state)
      })
      .addCase(cargarDatosProductos.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
      // Obtener productos
      .addCase(obtenerProductos.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerProductos.fulfilled, (state, action) => {
        state.cargando = false
        state.productos = action.payload.productos || action.payload
        if (action.payload.paginacion) {
          state.paginacion = action.payload.paginacion
        }
        state.error = null
        // Aplicar filtros después de cargar productos
        productosSlice.caseReducers.aplicarFiltros(state)
      })
      .addCase(obtenerProductos.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
      // Obtener producto por ID
      .addCase(obtenerProductoPorId.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerProductoPorId.fulfilled, (state, action) => {
        state.cargando = false
        state.productoSeleccionado = action.payload
        state.error = null
      })
      .addCase(obtenerProductoPorId.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
      // Crear producto
      .addCase(crearProducto.pending, (state) => {
        state.cargando = true
        state.error = null
        state.mensajeExito = ""
        state.advertencia = ""
      })
      .addCase(crearProducto.fulfilled, (state, action) => {
        state.cargando = false
        state.productos.push(action.payload)
        state.error = null
        state.mensajeExito = "Producto creado correctamente"
        // Aplicar filtros después de agregar producto
        productosSlice.caseReducers.aplicarFiltros(state)
        // Resetear formulario
        productosSlice.caseReducers.resetearFormulario(state)
      })
      .addCase(crearProducto.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.advertencia = `Error al crear: ${action.payload}`
      })
      // Actualizar producto
      .addCase(actualizarProducto.pending, (state) => {
        state.cargando = true
        state.error = null
        state.mensajeExito = ""
        state.advertencia = ""
      })
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        state.cargando = false
        const index = state.productos.findIndex((producto) => producto.id === action.payload.id)

        //CAMBIOO Si el producto editando es el mismo, actualizalo con la nueva data
        //if (state.productoEditando?.id === action.payload.id) {
        //  state.productoEditando = action.payload
        //}

        //if (state.productoSeleccionado?.id === action.payload.id) {
        //  state.productoSeleccionado = action.payload
        //}
        state.error = null
        state.mensajeExito = "Producto actualizado correctamente"
        // Aplicar filtros después de actualizar
        productosSlice.caseReducers.aplicarFiltros(state)
        // Resetear formulario
        productosSlice.caseReducers.resetearFormulario(state)
      })
      .addCase(actualizarProducto.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
        state.advertencia = `Error al actualizar: ${action.payload}`
      })
      // Eliminar producto
      .addCase(eliminarProducto.pending, (state) => {
        state.cargando = true
        state.error = null
        state.mensajeExito = ""
        state.advertencia = ""
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.cargando = false
        state.productos = state.productos.filter((producto) => producto.id !== action.payload)
        if (state.productoSeleccionado?.id === action.payload) {
          state.productoSeleccionado = null
        }
        state.error = null
        state.mensajeExito = "Producto eliminado correctamente"
        // Aplicar filtros después de eliminar
        productosSlice.caseReducers.aplicarFiltros(state)
      })
      .addCase(eliminarProducto.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload

        // Manejar errores específicos
        const errorMsg = action.payload || ""
        if (
          errorMsg.toLowerCase().includes("asociad") ||
          errorMsg.toLowerCase().includes("constraint") ||
          errorMsg.toLowerCase().includes("foreign key") ||
          errorMsg.toLowerCase().includes("referencia") ||
          errorMsg.toLowerCase().includes("carrito") ||
          errorMsg.includes("409") ||
          errorMsg.includes("400")
        ) {
          state.advertencia = "No se puede borrar la zapatilla porque está asociada a un carrito"
        } else {
          state.advertencia = "Error al eliminar el producto"
        }
      })
      .addCase(obtenerImg.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerImg.fulfilled, (state, action) => {
        state.cargando = false
        state.imagenProductoSeleccionado = action.payload
        state.error = null
      })
      .addCase(obtenerImg.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
      .addCase(obtenerImgPorStockId.fulfilled, (state, action) => {
        const { stockId, imagen } = action.payload
        console.log("Imagen obtenida:", imagen)
        state.imagenesPorStockId[stockId] = imagen
      })

      .addCase(obtenerCantidadPorStockId.fulfilled, (state, action) => {
        const { stockId, cantidad } = action.payload || {}
        if (stockId !== undefined && cantidad !== undefined) {
          console.log("Cantidad obtenida:", cantidad)
          state.cantidadesPorStockId[stockId] = cantidad
        }
      })
  },
})

export const {
  limpiarError,
  seleccionarProducto,
  limpiarSeleccion,
  establecerFiltros,
  limpiarFiltros,
  aplicarFiltros,
  establecerPagina,
  limpiarImagenSeleccionada,
  establecerMensajeExito,
  limpiarMensajeExito,
  establecerAdvertencia,
  limpiarAdvertencia,
  limpiarMensajes,
  mostrarFormularioProducto,
  ocultarFormularioProducto,
  establecerProductoEditando,
  limpiarProductoEditando,
  establecerFormulario,
  resetearFormulario,
  inicializarFormulario,
  actualizarStockFormulario,
  establecerFiltroModelo,
  aplicarFiltroModelo,
} = productosSlice.actions

export default productosSlice.reducer

// Add these selector functions at the end of the file:
export const obtenerImgPorStockIdSelector = (stockId) => (state) => {
  return state.productos.imagenesPorStockId[stockId] || "/placeholder.svg?height=100&width=100"
}

export const obtenerCantidadPorStockIdSelector = (stockId) => (state) => {
  return state.productos.cantidadesPorStockId[stockId] || 0
}
