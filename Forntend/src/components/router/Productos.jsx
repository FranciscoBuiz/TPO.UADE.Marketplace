"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { cargarDatosProductos, establecerFiltros, limpiarFiltros } from "../../store/slices/productosSlice"
import "./Productos.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"

const Productos = () => {
  const location = useLocation()
  const dispatch = useDispatch()


  const { productos, productosFiltrados, marcas, cargando, error, filtros } = useSelector((state) => state.productos)

  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const marcaParam = queryParams.get("marca")

    if (marcaParam) {
      // Si hay parámetro de marca, aplicar ese filtro
      dispatch(establecerFiltros({ marcaId: marcaParam }))
    } else {
 
      dispatch(limpiarFiltros())
    }
  }, [location.search, dispatch])


  useEffect(() => {
    dispatch(cargarDatosProductos())
  }, [dispatch])

  const manejarCambioFiltro = (e) => {
    dispatch(establecerFiltros({ [e.target.name]: e.target.value }))
  }

  const manejarLimpiarFiltros = () => {
    dispatch(limpiarFiltros())
  }

  const obtenerStockTotal = (producto) => {
    const stockArray = producto.stockDisponible || []
    return stockArray.reduce((total, stock) => total + (stock.cantidad || 0), 0)
  }


  const obtenerEstadoStock = (producto) => {
    const stockTotal = obtenerStockTotal(producto)

    if (stockTotal === 0) {
      return {
        texto: "Sin Stock",
        clase: "sin-stock",
      }
    } else if (stockTotal <= 5) {
      return {
        texto: "Pocas Unidades",
        clase: "poco-stock",
      }
    } else {
      return {
        texto: "Disponible",
        clase: "disponible",
      }
    }
  }

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error al cargar productos</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(cargarDatosProductos())} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="productos-container">
      <section className="productos-hero">
        <div className="hero-background">
          <img src="/public/img/pumaFondo.jpg" alt="Productos Background" className="hero-bg-image" />
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Nuestra Colección</h1>
            <p className="hero-description">
              Descubre todas nuestras zapatillas. Calidad, estilo y comodidad en cada modelo.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Filtros */}
        <section className="filtros-section">
          <div className="filtros-container">
            <div className="filtro-item">
              <input
                type="text"
                name="busqueda"
                placeholder="Buscar zapatillas..."
                value={filtros.busqueda}
                onChange={manejarCambioFiltro}
                className="filtro-input"
              />
            </div>

            <div className="filtro-item">
              <select name="marcaId" value={filtros.marcaId} onChange={manejarCambioFiltro} className="filtro-select">
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-item">
              <input
                type="number"
                name="precioMin"
                placeholder="Precio mín"
                value={filtros.precioMin}
                onChange={manejarCambioFiltro}
                className="filtro-input"
              />
            </div>

            <div className="filtro-item">
              <input
                type="number"
                name="precioMax"
                placeholder="Precio máx"
                value={filtros.precioMax}
                onChange={manejarCambioFiltro}
                className="filtro-input"
              />
            </div>

            <div className="filtro-item">
              <button className="limpiar-filtros" onClick={manejarLimpiarFiltros}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <div className="resultados-info">
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </div>

        {/* Productos Grid */}
        <section className="productos-grid-section">
          {productosFiltrados.length === 0 ? (
            <div className="no-productos">
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              <button onClick={manejarLimpiarFiltros}>Limpiar Filtros</button>
            </div>
          ) : (
            <div className="productos-grid">
              {productosFiltrados.map((producto) => {
                const estadoStock = obtenerEstadoStock(producto)

                return (
                  <div className="product-card" key={producto.id}>
                    <div className="product-image-container">
                      <img
                        src={
                          producto.imagen ||
                          `/placeholder.svg?height=280&width=350&query=premium+${producto.modelo || "sneaker"}`
                        }
                        alt={producto.modelo || "producto"}
                        className="product-image"
                      />
                      <div className={`product-badge ${estadoStock.clase}`}>{estadoStock.texto}</div>
                    </div>
                    <div className="product-info">
                      <span className="product-brand">{producto.marca || "Marca desconocida"}</span>
                      <h3 className="product-title">{producto.modelo || "Modelo desconocido"}</h3>
                      <div className="product-rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-text">(4.8)</span>
                      </div>
                      <div className="product-footer">
                        <span className="product-price">${producto.precio?.toLocaleString() || "0"}</span>
                        <Link to={`/producto/${producto.id}`} className="product-button">
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
      <ChatBotWidget />
    </div>
  )
}

export default Productos
