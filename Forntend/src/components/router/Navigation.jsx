"use client"

import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { cerrarSesion } from "../../store/slices/authSlice"
import { limpiarCarrito } from "../../store/slices/carritoSlice"
import { toggleUserMenu, closeUserMenu } from "../../store/slices/navigationSlice"
import "./Navigation.css"

const Navigation = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const { estaAutenticado, usuario, esAdmin } = useSelector((state) => state.auth)
  const { carrito } = useSelector((state) => state.carrito)
  const { showUserMenu } = useSelector((state) => state.navigation)

  const obtenerCantidadTotal = () => {
    if (!carrito?.items) return 0
    return carrito.items.reduce((total, item) => total + item.cantidad, 0)
  }

  const cantidadEnCarrito = obtenerCantidadTotal()

  const handleUserMenuToggle = () => {
    dispatch(toggleUserMenu())
  }

  const handleCloseUserMenu = () => {
    dispatch(closeUserMenu())
  }

  const handleCerrarSesion = () => {
    dispatch(cerrarSesion())
    dispatch(limpiarCarrito())
    dispatch(closeUserMenu())
  }

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="logo-text">UrbanStride</span>
          </Link>

          {/* Menu Principal */}
          <div className="nav-menu">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              Inicio
            </Link>
            <Link to="/productos" className={`nav-link ${location.pathname === "/productos" ? "active" : ""}`}>
              Productos
            </Link>
            <Link
              to="/sobre-nosotros"
              className={`nav-link ${location.pathname === "/sobre-nosotros" ? "active" : ""}`}
            >
              Sobre Nosotros
            </Link>
            <Link to="/contacto" className={`nav-link ${location.pathname === "/contacto" ? "active" : ""}`}>
              Contacto
            </Link>
            {esAdmin && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>
                Panel Admin
              </Link>
            )}
          </div>

          {/* Lado Derecho */}
          <div className="nav-right">
            {/* Carrito */}
            {estaAutenticado && !esAdmin && (
              <Link to="/carrito" className="cart-link">
                <span className="cart-icon">🛒</span>
                {cantidadEnCarrito > 0 && <span className="cart-badge">{cantidadEnCarrito}</span>}
              </Link>
            )}

            {/* Usuario */}
            <div className="user-menu">
              <div className="user-icon" onClick={handleUserMenuToggle}>
                <span>👤</span>
              </div>

              {showUserMenu && (
                <>
                  <div className="user-dropdown">
                    {estaAutenticado ? (
                      <>
                        <div className="user-info">
                          <span className="user-name">👋 {usuario?.nombre}</span>
                          {esAdmin && <span className="user-role">(Admin)</span>}
                        </div>
                        <Link to="/perfil" className="dropdown-item" onClick={handleCloseUserMenu}>
                          <span>👤</span> Mi Perfil
                        </Link>
                        <button onClick={handleCerrarSesion} className="dropdown-item logout">
                          <span>🚪</span> Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/iniciar-sesion" className="dropdown-item" onClick={handleCloseUserMenu}>
                          <span>🔑</span> Iniciar Sesión
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="dropdown-overlay" onClick={handleCloseUserMenu}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

