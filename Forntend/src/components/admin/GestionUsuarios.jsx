"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { obtenerUsuarios, establecerFiltroNombre, limpiarFiltroNombre } from "../../store/slices/usuariosSlice"
import "./Gestion.css"

const GestionUsuarios = () => {
  const dispatch = useDispatch()

  const { usuarios, cargando, error, filtroNombre, estadisticas, usuariosFiltrados } = useSelector(
    (state) => state.usuarios,
  )

  useEffect(() => {
    dispatch(obtenerUsuarios())
  }, [dispatch])

  const obtenerRolTexto = (rol) => {
    switch (rol) {
      case "ADMIN":
        return "ADMIN"
      case "USER":
        return "USER"
      default:
        return rol
    }
  }

  const obtenerRolClase = (rol) => {
    switch (rol) {
      case "ADMIN":
        return "badge bg-danger"
      case "USER":
        return "badge bg-primary"
      default:
        return "badge bg-secondary"
    }
  }

  if (cargando) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gestion-usuarios-full-width">
      {/* Estadísticas arriba - Desde Redux */}
      <div className="estadisticas-usuarios">
        <div className="stat-card-small total">
          <div className="stat-content-small">
            <div className="stat-info-small">
              <div className="stat-value-small">{estadisticas.total}</div>
              <div className="stat-label-small">Total</div>
            </div>
            <div className="stat-icon-small">👥</div>
          </div>
        </div>

        <div className="stat-card-small admins">
          <div className="stat-content-small">
            <div className="stat-info-small">
              <div className="stat-value-small">{estadisticas.admins}</div>
              <div className="stat-label-small">Admins</div>
            </div>
            <div className="stat-icon-small">🛡️</div>
          </div>
        </div>

        <div className="stat-card-small users">
          <div className="stat-content-small">
            <div className="stat-info-small">
              <div className="stat-value-small">{estadisticas.users}</div>
              <div className="stat-label-small">Usuarios</div>
            </div>
            <div className="stat-icon-small">👤</div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios abajo */}
      <div className="lista-usuarios">
        <div className="card">
          <div className="card-header">
            <h5 className="tituloContainerGestion">Lista de Usuarios</h5>
          </div>
          <div className="card-body">
            <div className="filtro-busqueda">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar por nombre, apellido o email..."
                value={filtroNombre}
                onChange={(e) => dispatch(establecerFiltroNombre(e.target.value))}
              />
              
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {usuariosFiltrados.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">
                  {filtroNombre
                    ? "No se encontraron usuarios que coincidan con la búsqueda."
                    : "No hay usuarios registrados"}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>ID</th>
                      <th style={{ width: "25%" }}>Nombre</th>
                      <th style={{ width: "25%" }}>Apellido</th>
                      <th style={{ width: "30%" }}>Email</th>
                      <th style={{ width: "10%" }}>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.apellido}</td>
                        <td>
                          <div className="usuario-email">{usuario.email}</div>
                        </td>
                        <td>
                          <span className={obtenerRolClase(usuario.rol)}>{obtenerRolTexto(usuario.rol)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios
