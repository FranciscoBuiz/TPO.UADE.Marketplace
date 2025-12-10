"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { cargarCarrito, modificarCantidad, eliminarDelCarrito, vaciarCarrito } from "../../store/slices/carritoSlice"
import { obtenerCantidadPorStockId, obtenerImgPorStockId } from "../../store/slices/productosSlice"
import "./Carrito.css"

const Carrito = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario, token } = useSelector((state) => state.auth)
  const { carrito, cargando, cargandoAccion, error } = useSelector((state) => state.carrito)
  const { imagenesPorStockId, cantidadesPorStockId } = useSelector((state) => state.productos)

  useEffect(() => {
    const cargarCarritoYDatos = async () => {
      if (usuario?.id && token) {
        try {
          // Primero cargar el carrito
          const carritoResult = await dispatch(cargarCarrito({ usuarioId: usuario.id, token })).unwrap()

          // Luego cargar imágenes y cantidades para cada item del carrito
          if (carritoResult?.items) {
            const stockIds = carritoResult.items.map((item) => item.stockId || item.productoId).filter(Boolean)

            // Cargar imágenes y cantidades en paralelo
            const promises = stockIds.flatMap((stockId) => [
              dispatch(obtenerImgPorStockId(stockId)),
              dispatch(obtenerCantidadPorStockId(stockId)),
            ])

            await Promise.allSettled(promises)
          }
        } catch (error) {
          console.error("Error al cargar carrito y datos:", error)
        }
      }
    }

    cargarCarritoYDatos()
  }, [usuario?.id, token, dispatch])

  // ✅ FUNCIÓN PARA AGRUPAR PRODUCTOS IDÉNTICOS
  const agruparProductos = () => {
    if (!carrito?.items) return []

    const grupos = {}

    carrito.items.forEach((item) => {
      const nombre = item.nombre || item.nombreZapatilla || "Producto"
      const marca = item.marca || "Sin marca"
      const talle = item.talle || "N/A"

      // Crear clave única basada en nombre, marca y talle
      const claveGrupo = `${nombre}-${marca}-${talle}`

      if (grupos[claveGrupo]) {
        // Si ya existe el grupo, agregar este item
        grupos[claveGrupo].items.push(item)
        grupos[claveGrupo].cantidadTotal += item.cantidad || 0
      } else {
        // Crear nuevo grupo
        grupos[claveGrupo] = {
          claveGrupo,
          nombre,
          marca,
          talle,
          precio: item.precioUnitario || item.precio || 0,
          items: [item], // Array de items originales
          cantidadTotal: item.cantidad || 0,
          // Usar el primer item como representante para imagen y stock
          stockIdPrincipal: item.stockId || item.productoId,
        }
      }
    })

    return Object.values(grupos).sort((a, b) => {
      return (a.stockIdPrincipal || 0) - (b.stockIdPrincipal || 0)
    })
  }

  // ✅ MANTENER LA LÓGICA ORIGINAL DE CAMBIAR CANTIDAD
  const manejarCambiarCantidad = async (grupo, operacion) => {
    try {
      if (operacion === "aumentar") {
        // Usar el primer item del grupo para aumentar
        const primerItem = grupo.items[0]
        const stockId = primerItem.stockId || primerItem.productoId
        const nuevaCantidad = primerItem.cantidad + 1

        await dispatch(
          modificarCantidad({
            stockId,
            cantidad: nuevaCantidad,
            usuarioId: usuario.id,
            token,
          }),
        ).unwrap()
      } else if (operacion === "disminuir") {
        // Para disminuir, encontrar cualquier item que tenga cantidad > 0
        const itemParaDisminuir = grupo.items.find((item) => (item.cantidad || 0) > 0)

        if (itemParaDisminuir) {
          const stockId = itemParaDisminuir.stockId || itemParaDisminuir.productoId
          const nuevaCantidad = itemParaDisminuir.cantidad - 1

          if (nuevaCantidad > 0) {
            // Si la nueva cantidad es mayor a 0, actualizar
            await dispatch(
              modificarCantidad({
                stockId,
                cantidad: nuevaCantidad,
                usuarioId: usuario.id,
                token,
              }),
            ).unwrap()
          } else {
            // Si la nueva cantidad es 0, eliminar este item específico
            await dispatch(
              eliminarDelCarrito({
                usuarioId: usuario.id,
                stockIdActual: stockId,
                token,
              }),
            ).unwrap()
          }
        }
      }
    } catch (error) {
      console.error("Error al modificar cantidad:", error)
    }
  }

  // ✅ ELIMINAR TODOS LOS ITEMS DE UN GRUPO
  const manejarEliminarGrupo = async (grupo) => {
    try {
      // Eliminar todos los items del grupo uno por uno
      for (const item of grupo.items) {
        const stockId = item.stockId || item.productoId
        await dispatch(
          eliminarDelCarrito({
            usuarioId: usuario.id,
            stockIdActual: stockId,
            token,
          }),
        ).unwrap()
      }
    } catch (error) {
      console.error("Error al eliminar grupo:", error)
    }
  }

  const manejarVaciarCarrito = async () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      try {
        await dispatch(vaciarCarrito({ usuarioId: usuario.id, token })).unwrap()
      } catch (error) {
        console.error("Error al vaciar carrito:", error)
      }
    }
  }

  const calcularTotal = () => {
    if (!carrito?.items) return 0

    return carrito.items.reduce((total, item) => {
      const precio = item.precioUnitario || item.precio || 0
      const cantidad = item.cantidad || 0
      return total + precio * cantidad
    }, 0)
  }

  const procederAlCheckout = () => {
    navigate("/checkout/informacion")
  }

  if (cargando) {
    return (
      <div className="carrito-container">
        <div className="carrito-loading-container">
          <div className="carrito-spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="carrito-container">
        <div className="carrito-error">
          <h2>Error al cargar el carrito</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(cargarCarrito({ usuarioId: usuario.id, token }))}
            className="carrito-checkout-btn"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!carrito?.items || carrito.items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-empty">
          <div className="carrito-empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>¡Descubre nuestros increíbles productos y agrega algunos a tu carrito!</p>
          <Link to="/productos" className="carrito-shop-now-btn">
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  // ✅ USAR PRODUCTOS AGRUPADOS
  const productosAgrupados = agruparProductos()

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h1 className="carrito-title">Mi Carrito</h1>
        <p className="carrito-subtitle">Carrito de {usuario?.nombre || usuario?.email || "Usuario"}</p>
      </div>

      <div className="carrito-content">
        <div className="carrito-items">
          <div className="carrito-header-productos">
            <h5>Productos en tu carrito</h5>
            <button onClick={manejarVaciarCarrito} className="carrito-btn-vaciar" disabled={cargandoAccion}>
              Vaciar Carrito
            </button>
          </div>

          {productosAgrupados.map((grupo) => {
            const stockIdPrincipal = grupo.stockIdPrincipal

            // Obtener imagen y stock del primer item
            const imagen = imagenesPorStockId[stockIdPrincipal] || "/placeholder.svg?height=100&width=100"
            const cantidadDisponible = cantidadesPorStockId[stockIdPrincipal]+1 || 0

            return (
              <div key={grupo.claveGrupo} className="carrito-item">
                <img
                  src={imagen || "/placeholder.svg"}
                  alt={grupo.nombre}
                  className="carrito-item-image"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=100&width=100"
                  }}
                />

                <div className="carrito-item-info">
                  <h4 className="carrito-item-name">{grupo.nombre}</h4>
                  <span className="carrito-item-brand">{grupo.marca}</span>
                  <p className="carrito-item-size">Talle: {grupo.talle}</p>
                </div>

                <div className="carrito-item-price">${grupo.precio.toLocaleString()}</div>

                <div className="carrito-quantity-controls">
                  <button
                    onClick={() => manejarCambiarCantidad(grupo, "disminuir")}
                    disabled={grupo.cantidadTotal <= 1 || cargandoAccion}
                    className="carrito-quantity-btn"
                  >
                    -
                  </button>
                  <span className="carrito-quantity-display">{grupo.cantidadTotal}</span>
                  <button
                    onClick={() => manejarCambiarCantidad(grupo, "aumentar")}
                    disabled={cargandoAccion || grupo.cantidadTotal >= cantidadDisponible}
                    className="carrito-quantity-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => manejarEliminarGrupo(grupo)}
                  disabled={cargandoAccion}
                  className="carrito-remove-btn"
                  title="Eliminar producto"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>

        <div className="carrito-summary">
          <h3 className="carrito-summary-title">Resumen del Pedido</h3>
          <div className="carrito-summary-row">
            <span className="carrito-summary-label">Subtotal:</span>
            <span className="carrito-summary-value">${calcularTotal().toLocaleString()}</span>
          </div>
          <div className="carrito-summary-row">
            <span className="carrito-summary-label">Envío:</span>
            <span className="carrito-summary-value">Gratis</span>
          </div>
          <div className="carrito-summary-row carrito-total-row">
            <span className="carrito-summary-label">Total:</span>
            <span className="carrito-summary-value">${calcularTotal().toLocaleString()}</span>
          </div>

          <button onClick={procederAlCheckout} className="carrito-checkout-btn" disabled={cargandoAccion}>
            Proceder al Checkout
          </button>

          <Link to="/productos" className="carrito-btn-seguir-comprando">
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Carrito
