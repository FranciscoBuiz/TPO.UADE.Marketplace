"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { cargarDatosHome } from "../../store/slices/homeSlice"
import "./Home.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"

const Home = () => {
  const dispatch = useDispatch()


  const { productosDestacados, marcas, cargando, error } = useSelector((state) => state.home)


  useEffect(() => {
    dispatch(cargarDatosHome())
  }, [dispatch])


  const obtenerMarcaId = (nombreMarca) => {
    const marca = marcas.find((m) => m.nombre.toLowerCase() === nombreMarca.toLowerCase())
    return marca ? marca.id : null
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
          <h3>Error al cargar datos</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(cargarDatosHome())} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    )
  }


  const marcasDestacadas = [
    {
      nombre: "Adidas",
      descripcion: "Zapatillas para tus mejores looks",
      imagen: "/public/img/AdidasFondo.jpg",
    },
    {
      nombre: "Nike",
      descripcion: "Estilo para el día a día",
      imagen: "/public/img/NikeFondo.jpg",
    },
    {
      nombre: "Puma",
      descripcion: "Calzados populares",
      imagen: "/public/img/PumaFondo.jpg",
    },
  ]

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-background">
          <img src="/public/img/fondo-hero.jpg" alt="Hero Background" className="hero-bg-image" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Nueva Colección 2025</div>
            <h1 className="hero-title">
              <span className="brand-name">UrbanStride</span>
              <span className="hero-subtitle">Donde el estilo encuentra la comodidad</span>
            </h1>
            <p className="hero-description">
              Descubre nuestra exclusiva colección de zapatillas premium. Diseño innovador, calidad excepcional y estilo
              urbano.
            </p>
            <div className="hero-buttons">
              <Link to="/productos" className="hero-btn primary">
                Ver Productos
              </Link>
              <Link to="/sobre-nosotros" className="hero-btn secondary">
                Conoce Más
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="categories-section">
          <h2 className="section-title">Marcas Destacadas</h2>
          <div className="categories-grid">
            {marcasDestacadas.map((marca, index) => {
              // Obtener el ID de la marca para el filtrado
              const marcaId = obtenerMarcaId(marca.nombre)

              return (
                <div className="category-card" key={index}>
                  <img src={marca.imagen || "/placeholder.svg"} alt={marca.nombre} className="category-image" />
                  <div className="category-overlay">
                    <h3 className="marca">{marca.nombre}</h3>
                    <p>{marca.descripcion}</p>
                    {/* Link con parámetro de búsqueda para filtrar por marca */}
                    <Link to={marcaId ? `/productos?marca=${marcaId}` : "/productos"} className="category-btn">
                      Ver {marca.nombre}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Lo mejor de nuestra colección seleccionado para ti</p>
          </div>

          <div className="products-grid">
            {productosDestacados.map((producto) => (
              <div className="product-card" key={producto.id}>
                <div className="product-image-container">
                  <img
                    src={
                      producto.imagen ||
                      `/placeholder.svg?height=280&width=350&query=premium+${producto.nombre || "/placeholder.svg"}+sneaker`
                    }
                    alt={producto.nombre}
                    className="product-image"
                  />
                  <div className="product-badge">Destacado</div>
                </div>

                <div className="product-info">
                  <span className="product-brand">{producto.marca?.nombre}</span>
                  <h3 className="product-title">{producto.nombre}</h3>
                  <div className="product-footer">
                    <span className="product-price">${producto.precio?.toLocaleString()}</span>
                    <Link to={`/producto/${producto.id}`} className="product-button">
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ChatBotWidget />
    </div>
  )
}

export default Home
