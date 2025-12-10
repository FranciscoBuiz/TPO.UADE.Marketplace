"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  obtenerTalles,
  crearTalle,
  actualizarTalle,
  eliminarTalle,
  mostrarFormularioCrear,
  mostrarFormularioEditar,
  ocultarFormulario,
  actualizarFormulario,
  limpiarMensajes,
  establecerErrorFormulario,
} from "../../store/slices/tallesSlice"
import "./Gestion.css"

const GestionTalles = () => {
  const dispatch = useDispatch()

  const {
    talles,
    cargando,
    error,
    mostrarFormulario,
    talleEditando,
    formulario,
    mensajeExito,
    advertencia,
    errorFormulario,
  } = useSelector((state) => state.talles)

  useEffect(() => {
    dispatch(obtenerTalles())
  }, [dispatch])


  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        dispatch(limpiarMensajes())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensajeExito, dispatch])


  useEffect(() => {
    if (advertencia) {
      const timer = setTimeout(() => {
        dispatch(limpiarMensajes())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [advertencia, dispatch])

  // Validar si el talle ya existe
  const validarTalleDuplicado = (numero) => {
    const numeroLimpio = numero.trim().toLowerCase()
    return talles.some((talle) => {
      const talleNumero = String(talle.numero || "").toLowerCase()
      return talleNumero === numeroLimpio && (!talleEditando || talle.id !== talleEditando.id)
    })
  }

  const manejarSubmit = async (e) => {
    e.preventDefault()

    if (!formulario.numero.trim()) {
      dispatch(establecerErrorFormulario("El número de talle es requerido"))
      return
    }

    // Validación de duplicado en frontend
    if (validarTalleDuplicado(formulario.numero)) {
      dispatch(establecerErrorFormulario("Ya existe ese talle"))
      return
    }


    dispatch(limpiarMensajes())

    if (talleEditando) {
      dispatch(
        actualizarTalle({
          id: talleEditando.id,
          talleData: formulario,
        }),
      )
    } else {
      dispatch(crearTalle(formulario))
    }
  }

  const manejarEditar = (talle) => {
    dispatch(mostrarFormularioEditar(talle))
  }

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este talle?")) {
      dispatch(limpiarMensajes())
      dispatch(eliminarTalle(id))
    }
  }

  const manejarCerrarFormulario = () => {
    dispatch(limpiarMensajes())
    dispatch(ocultarFormulario())
  }

  const manejarCambioFormulario = (campo, valor) => {
    dispatch(actualizarFormulario({ [campo]: valor }))
  }

  if (cargando && talles.length === 0) {
    return <div className="text-center p-4">Cargando talles...</div>
  }

  return (
    <div className="gestion-talles-full-width">
      {/* Modal formulario */}
      {mostrarFormulario && (
        <div
          className="modal-overlay-marcas-talles"
          onClick={(e) => e.target === e.currentTarget && manejarCerrarFormulario()}
        >
          <div className="modal-formulario-marcas-talles">
            <div className="card">
              <div className="card-header">
                <h5 className="modal-title">{talleEditando ? "Editar Talle" : "Nuevo Talle"}</h5>
                <button type="button" className="btn-close-modal" onClick={manejarCerrarFormulario}>
                  ×
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={manejarSubmit}>
                  <div className="form-group">
                    <label htmlFor="numero" className="form-label">
                      Número de Talle
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="numero"
                      value={formulario.numero}
                      onChange={(e) => manejarCambioFormulario("numero", e.target.value)}
                      required
                      autoFocus
                      disabled={cargando}
                    />
                  </div>

                  {/* Mostrar errores del formulario */}
                  {errorFormulario && (
                    <div className="alert alert-warning mt-2" role="alert">
                      {errorFormulario}
                    </div>
                  )}

                  <div className="form-buttons">
                    <button type="submit" className="btn btn-success" disabled={cargando}>
                      {cargando ? "Guardando..." : talleEditando ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary1"
                      onClick={manejarCerrarFormulario}
                      disabled={cargando}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de talles */}
      <div className="lista-talles">
        <div className="card">
          <div className="card-header">
            <h5 className="tituloContainerGestion">Lista de Talles</h5>
            <button
              className="btn-agregar-talle"
              onClick={() => dispatch(mostrarFormularioCrear())}
              disabled={cargando}
            >
              Agregar Talle
            </button>
          </div>
          <div className="card-body">
            {/* Solo mostrar errores que NO son de eliminación */}
            {error && !error.includes("eliminar") && !error.includes("Error al eliminar") && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {advertencia && (
              <div className="alert alert-warning" role="alert">
                {advertencia}
              </div>
            )}

            {mensajeExito && (
              <div className="alert alert-success" role="alert">
                {mensajeExito}
              </div>
            )}

            {talles.length === 0 ? (
              <p>No hay talles registrados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Número</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talles.map((talle) => (
                      <tr key={talle.id}>
                        <td>{talle.id}</td>
                        <td>{talle.numero}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => manejarEditar(talle)}
                            disabled={cargando}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => manejarEliminar(talle.id)}
                            disabled={cargando}
                          >
                            Eliminar
                          </button>
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

export default GestionTalles
