import { Link } from "react-router-dom"
import "./DashboardAdmin.css"

const DashboardAdmin = () => {
  return (
    <div className="dashboard-admin">
      <div className="container">
        <h1 className="dashboard-title">Panel de Administración</h1>
        <p className="dashboard-subtitle">Gestiona tu ecommerce desde aquí</p>

        <div className="dashboard-grid">
          <Link to="/admin/productos" className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Gestión de Productos</h3>
            <p>Administra zapatillas, precios y stock</p>
          </Link>

          <Link to="/admin/marcas" className="dashboard-card">
            <div className="card-icon">🏷️</div>
            <h3>Gestión de Marcas</h3>
            <p>Administra las marcas disponibles</p>
          </Link>

          <Link to="/admin/talles" className="dashboard-card">
            <div className="card-icon">📏</div>
            <h3>Gestión de Talles</h3>
            <p>Administra los talles disponibles</p>
          </Link>

          <Link to="/admin/usuarios" className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Gestión de Usuarios</h3>
            <p>Administra usuarios y sus roles</p>
          </Link>
          <Link to="/admin/historial-compras" className="dashboard-card">
            <div className="card-icon">🛍️</div>
            <h3>Gestión de Compras</h3>
            <p>Administra las compras de los usuarios</p>
          </Link>
          <Link to="" className="dashboard-card disabled">
            <div className="card-icon">💳</div>
            <h3>Gestión de Descuentos</h3>
            <p>Administra los descuentos y promociones</p>
            <span className="proximamente">Próximamente</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
