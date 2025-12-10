import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const RutaProtegida = ({ children, requiereVendedor = false }) => {
  const { estaAutenticado, esAdmin, cargando } = useSelector((state) => state.auth)

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!estaAutenticado) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  if (requiereVendedor && !esAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida
