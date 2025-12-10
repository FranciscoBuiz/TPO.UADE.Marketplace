const API_BASE_URL = "http://localhost:8080/api"

// Manejo de respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      mensaje: "Error en la solicitud",
    }))
    throw {
      status: response.status,
      mensaje: errorData.mensaje || "Error en el servidor",
    }
  }

  if (response.status === 204) {
    return { success: true }
  }

  return response.json()
}

// Manejo de respuestas de texto plano (para imagen y cantidad)
const handleTextResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Error en la solicitud")
    throw {
      status: response.status,
      mensaje: errorText || "Error en el servidor",
    }
  }

  return response.text()
}

// Configuración de fetch
const fetchConfig = (method, data = null, token = null) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  return config
}

// Servicios de autenticación
export const serviciosAuth = {
  iniciarSesion: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/usuarios/authenticate`, fetchConfig("POST", { email, password }))
    return handleResponse(response)
  },

  registrarse: async (nombre, apellido, email, password, rol = "USER") => {
    const response = await fetch(
      `${API_BASE_URL}/auth/usuarios/register`,
      fetchConfig("POST", { nombre, apellido, email, password, rol }),
    )
    return handleResponse(response)
  },
}

export { API_BASE_URL, fetchConfig, handleResponse }

// Servicios de productos/zapatillas
export const serviciosProductos = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_BASE_URL}/zapatillas`, fetchConfig("GET"))
    return handleResponse(response)
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/zapatillas/${id}`, fetchConfig("GET"))
    return handleResponse(response)
  },

  crear: async (producto) => {
    const response = await fetch(`${API_BASE_URL}/zapatillas`, fetchConfig("POST", producto))
    return handleResponse(response)
  },

  actualizar: async (id, producto) => {
    const productoCompleto = {
      modelo: producto.modelo || "",
      precio: Number(producto.precio) || 0,
      marcaId: Number(producto.marcaId) || 1,
      imagen: producto.imagen || "",
      stockPorTalle: producto.stockPorTalle || [],
    }
    const response = await fetch(`${API_BASE_URL}/zapatillas/${id}`, fetchConfig("PUT", productoCompleto))
    return handleResponse(response)
  },

  eliminar: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zapatillas/${id}`, fetchConfig("DELETE"))

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")

        throw {
          status: response.status,
          message: errorText || `Error ${response.status}`,
        }
      }

      return { success: true }
    } catch (error) {
      throw error
    }
  },

  obtenerImgPorStockId: async (stockId) => {
    const response = await fetch(`${API_BASE_URL}/zapatillas/img/${stockId}`, fetchConfig("GET"))
    return handleTextResponse(response)
  },

  obtenerCantidadPorStockId: async (stockId) => {
    const response = await fetch(`${API_BASE_URL}/zapatillas/cantidad/${stockId}`, fetchConfig("GET"))
    const cantidadText = await handleTextResponse(response)
    return Number.parseInt(cantidadText, 10)
  },
}

// Servicios de marcas
export const serviciosMarcas = {
  obtenerTodas: async () => {
    const response = await fetch(`${API_BASE_URL}/marcas`, fetchConfig("GET"))
    return handleResponse(response)
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/marcas/${id}`, fetchConfig("GET"))
    return handleResponse(response)
  },

  crear: async (marca) => {
    const response = await fetch(`${API_BASE_URL}/marcas`, fetchConfig("POST", marca))
    return handleResponse(response)
  },

  actualizar: async (id, marca) => {
    const response = await fetch(`${API_BASE_URL}/marcas/${id}`, fetchConfig("PUT", marca))
    return handleResponse(response)
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_BASE_URL}/marcas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = new Error("Error al eliminar la marca")
      error.status = response.status
      throw error
    }
  },
}

// Servicios de talles
export const serviciosTalles = {
  obtenerTodos: async () => {
    const response = await fetch(`${API_BASE_URL}/talles`, fetchConfig("GET"))
    return handleResponse(response)
  },

  obtenerPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/talles/${id}`, fetchConfig("GET"))
    return handleResponse(response)
  },

  crear: async (talle) => {
    const response = await fetch(`${API_BASE_URL}/talles`, fetchConfig("POST", talle))
    return handleResponse(response)
  },

  actualizar: async (id, talle) => {
    const response = await fetch(`${API_BASE_URL}/talles/${id}`, fetchConfig("PUT", talle))
    return handleResponse(response)
  },

  eliminar: async (id) => {
    const response = await fetch(`${API_BASE_URL}/talles/${id}`, fetchConfig("DELETE"))

    if (!response.ok) {
      const error = new Error("Error al eliminar talle")
      error.status = response.status
      throw error
    }

    return true
  },
}

// Servicios de usuarios (para administración)
export const serviciosUsuarios = {
  obtenerTodos: async (token) => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  obtenerPorId: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  actualizar: async (id, datosUsuario, token) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, fetchConfig("PUT", datosUsuario, token))
    return handleResponse(response)
  },

  eliminar: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, fetchConfig("DELETE", null, token))
    return handleResponse(response)
  },

  actualizarRol: async (id, rol, token) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/rol`, fetchConfig("PUT", { rol }, token))
    return handleResponse(response)
  },
}

// Servicios de carrito
export const serviciosCarrito = {
  obtener: async (usuarioId, token) => {
    const response = await fetch(`${API_BASE_URL}/carrito/usuario/${usuarioId}`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  agregar: async (usuarioId, item, token) => {
    const response = await fetch(
      `${API_BASE_URL}/carrito/usuario/${usuarioId}/agregar`,
      fetchConfig("POST", item, token),
    )
    return handleResponse(response)
  },

  modificar: async (stockId, nuevaCantidad, usuarioId, token) => {
    const body = {
      stockIdActual: stockId,
      nuevoStockId: stockId,
      nuevaCantidad: nuevaCantidad,
    }

    const response = await fetch(
      `${API_BASE_URL}/carrito/usuario/${usuarioId}/modificarCarrito`,
      fetchConfig("PUT", body, token),
    )
    return handleResponse(response)
  },

  eliminar: async (usuarioId, stockIdActual, token) => {
    const response = await fetch(
      `${API_BASE_URL}/carrito/usuario/${usuarioId}/eliminarItem/${stockIdActual}`,
      fetchConfig("DELETE", null, token),
    )
    return handleResponse(response)
  },

  vaciar: async (usuarioId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/carrito/usuario/${usuarioId}/vaciar`,
      fetchConfig("DELETE", null, token),
    )
    return handleResponse(response)
  },
}

// Servicios de compras
export const serviciosCompras = {
  // Realizar compra usando el carrito del usuario
  realizar: async (usuarioId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/compra/realizar/usuario/${usuarioId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.mensaje || errorMessage
        } catch (e) {
          try {
            const errorText = await response.text()
            if (errorText) errorMessage = errorText
          } catch (_) {}
        }

        throw {
          status: response.status,
          mensaje: errorMessage,
        }
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error.name === "AbortError" || error.name === "TypeError") {
        throw {
          status: 0,
          mensaje: "No se pudo conectar con el servidor. Por favor, intenta nuevamente.",
        }
      }

      throw error
    }
  },

  // Obtener historial de compras del usuario
  obtenerHistorial: async (usuarioId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/compra/usuario/${usuarioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
          return []
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const historial = await response.json()

      const historialDeduplicado = []
      const comprasVistas = new Set()

      historial.forEach((compra) => {
        const productoId = compra.items?.[0]?.productoId || 0
        const talle = compra.items?.[0]?.talle || 0
        const total = compra.total || 0
        const fecha = compra.fechaCompra?.split(".")[0] || ""

        const compraKey = `${productoId}-${talle}-${total}-${fecha}`

        if (!comprasVistas.has(compraKey)) {
          comprasVistas.add(compraKey)
          const compraConId = {
            ...compra,
            id: `${productoId}-${Date.now()}-${historialDeduplicado.length}`,
          }
          historialDeduplicado.push(compraConId)
        }
      })

      return historialDeduplicado
    } catch (error) {
      throw error
    }
  },

  // Servicios para admin
  obtenerTodasLasCompras: async (token) => {
    const response = await fetch(`${API_BASE_URL}/compra/admin/todas`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  obtenerEstadisticas: async (token) => {
    const response = await fetch(`${API_BASE_URL}/compra/admin/estadisticas`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  obtenerVentasPorMes: async (token) => {
    const response = await fetch(`${API_BASE_URL}/compra/admin/ventas-por-mes`, fetchConfig("GET", null, token))
    return handleResponse(response)
  },

  obtenerComprasPorFecha: async (fechaInicio, fechaFin, usuarioId = null, token) => {
    let url = `${API_BASE_URL}/compra/admin/por-fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    if (usuarioId) {
      url += `&usuarioId=${usuarioId}`
    }
    const response = await fetch(url, fetchConfig("GET", null, token))
    return handleResponse(response)
  },
}
