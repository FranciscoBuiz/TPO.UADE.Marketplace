"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  obtenerMarcas,
  crearMarca,
  actualizarMarca,
  eliminarMarca,
  mostrarFormularioCrear,
  mostrarFormularioEditar,
  ocultarFormulario,
  actualizarFormulario,
  establecerFiltroNombre,
  limpiarMensajeExito,
  limpiarAdvertencia,
  establecerAdvertencia, 
} from "../../store/slices/marcasSlice"
import "./Gestion.css"

const GestionMarcas = () => {
  const dispatch = useDispatch()

  const {
    marcas,
    cargando,
    error,
    mostrarFormulario,
    marcaEditando,
    formulario,
    mensajeExito,
    advertencia,
    filtroNombre,
  } = useSelector((state) => state.marcas)

  useEffect(() => {
    dispatch(obtenerMarcas())
  }, [dispatch])


  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        dispatch(limpiarMensajeExito())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensajeExito, dispatch])

  useEffect(() => {
    if (advertencia) {
      const timer = setTimeout(() => {
        dispatch(limpiarAdvertencia())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [advertencia, dispatch])

  const validarMarcaDuplicada = (nombre) => {
    const nombreLimpio = nombre.trim().toLowerCase()
    return marcas.some((marca) => {
      if (marcaEditando && marca.id === marcaEditando.id) {
        return false
      }
      return marca.nombre.toLowerCase() === nombreLimpio
    })
  }

  const manejarSubmit = async (e) => {
    e.preventDefault()

    if (!formulario.nombre.trim()) {
      dispatch(establecerAdvertencia("El nombre es requerido"))
      return
    }

    // Validar duplicados antes de enviar al servidor
    if (validarMarcaDuplicada(formulario.nombre)) {
      dispatch(establecerAdvertencia("Ya existe una marca con ese nombre"))
      return
    }

    try {
      if (marcaEditando) {
        await dispatch(
          actualizarMarca({
            id: marcaEditando.id,
            marcaData: formulario,
          }),
        ).unwrap()
      } else {
        await dispatch(crearMarca(formulario)).unwrap()
      }

    } catch (error) {


    }
  }

  const manejarEditar = (marca) => {
    dispatch(mostrarFormularioEditar(marca))
  }

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta marca?")) {
      try {
        await dispatch(eliminarMarca(id)).unwrap()

      } catch (error) {
          console.error("Error al eliminar marca:", error)

      }
    }
  }

  const marcasFiltradas = marcas.filter((marca) => marca.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()))

  if (cargando && marcas.length === 0) {
    return <div className="text-center p-4">Cargando marcas...</div>
  }

  return (
    <div className="gestion-marcas-full-width">
      {/* Modal formulario */}
      {mostrarFormulario && (
        <div
          className="modal-overlay-marcas-talles"
          onClick={(e) => e.target === e.currentTarget && dispatch(ocultarFormulario())}
        >
          <div className="modal-formulario-marcas-talles">
            <div className="card">
              <div className="card-header">
                <h5 className="modal-title">{marcaEditando ? "Editar Marca" : "Nueva Marca"}</h5>
                <button type="button" className="btn-close-modal" onClick={() => dispatch(ocultarFormulario())}>
                  ×
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={manejarSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre" className="form-label">
                      Nombre de la Marca
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={formulario.nombre}
                      onChange={(e) => dispatch(actualizarFormulario({ nombre: e.target.value }))}
                      required
                      autoFocus
                      disabled={cargando}
                    />
                  </div>

                  {/* Mostrar advertencias en el formulario */}
                  {advertencia && (
                    <div className="alert alert-warning mt-2" role="alert">
                      {advertencia}
                    </div>
                  )}

                  <div className="form-buttons">
                    <button type="submit" className="btn btn-success" disabled={cargando}>
                      {cargando ? "Guardando..." : marcaEditando ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary1"
                      onClick={() => dispatch(ocultarFormulario())}
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

      {/* Lista de marcas */}
      <div className="lista-marcas">
        <div className="card">
          <div className="card-header">
            <h5 className="tituloContainerGestion">Lista de Marcas</h5>
            <button
              className="btn-agregar-marca"
              onClick={() => dispatch(mostrarFormularioCrear())}
              disabled={cargando}
            >
              Agregar Marca
            </button>
          </div>
          <div className="card-body">
            <div className="filtro-busqueda">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar por nombre de marca..."
                value={filtroNombre}
                onChange={(e) => dispatch(establecerFiltroNombre(e.target.value))}
              />
            </div>

            {/* Errores generales */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
              <div className="alert alert-success" role="alert">
                {mensajeExito}
              </div>
            )}

            {/* Advertencias fuera del formulario */}
            {!mostrarFormulario && advertencia && (
              <div className="alert alert-warning" role="alert">
                {advertencia}
              </div>
            )}

            {marcasFiltradas.length === 0 ? (
              <p>
                {filtroNombre
                  ? "No se encontraron marcas que coincidan con la búsqueda."
                  : "No hay marcas registradas."}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marcasFiltradas.map((marca) => (
                      <tr key={marca.id}>
                        <td>{marca.id}</td>
                        <td>{marca.nombre}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => manejarEditar(marca)}
                            disabled={cargando}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => manejarEliminar(marca.id)}
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

export default GestionMarcas
