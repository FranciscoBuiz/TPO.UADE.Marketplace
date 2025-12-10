"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  cargarDatosProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  limpiarMensajes,
  mostrarFormularioProducto,
  resetearFormulario,
  establecerFormulario,
  inicializarFormulario,
  actualizarStockFormulario,
  establecerFiltroModelo,
  aplicarFiltroModelo,
  establecerProductoEditando,
  limpiarMensajeExito,
  limpiarAdvertencia,
  establecerAdvertencia,
  ocultarFormularioProducto,
  limpiarProductoEditando,

} from "../../store/slices/productosSlice"
import { obtenerTalles } from "../../store/slices/tallesSlice"
import "./GestionProductos.css"

const GestionProductos = () => {
  const dispatch = useDispatch()

  const {
    productos,
    productosFiltrados,
    marcas,
    cargando,
    error,
    mensajeExito,
    advertencia,
    mostrarFormulario,
    productoEditando,
    formulario,
    filtroModelo,
  } = useSelector((state) => state.productos)

  const { talles } = useSelector((state) => state.talles)

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(cargarDatosProductos()) // ✅ CAMBIÉ ESTO - ahora carga productos Y marcas
    dispatch(obtenerTalles())
  }, [dispatch])


  useEffect(() => {
    dispatch(aplicarFiltroModelo())
  }, [filtroModelo, productos, dispatch])


  useEffect(() => {
  if (mensajeExito) {
    const timer = setTimeout(() => {
      dispatch(limpiarMensajeExito())
      dispatch(ocultarFormularioProducto())
      dispatch(limpiarProductoEditando())
    }, 3000)
    return () => clearTimeout(timer)
  }
}, [mensajeExito, dispatch])


  useEffect(() => {
    if (advertencia) {
      const timer = setTimeout(() => dispatch(limpiarAdvertencia()), 5000)
      return () => clearTimeout(timer)
    }
  }, [advertencia, dispatch])

  const manejarSubmit = async (e) => {
    e.preventDefault()
    dispatch(limpiarMensajes())


    if (!formulario.modelo.trim()) {
      dispatch(establecerAdvertencia("El nombre/modelo es requerido"))
      return
    }

    if (!formulario.precio || isNaN(Number(formulario.precio)) || Number(formulario.precio) <= 0) {
      dispatch(establecerAdvertencia("El precio debe ser un número mayor a 0"))
      return
    }

    if (!formulario.marcaId) {
      dispatch(establecerAdvertencia("Debe seleccionar una marca"))
      return
    }


    const productoData = {
      modelo: formulario.modelo.trim(),
      precio: Number(formulario.precio),
      marcaId: Number(formulario.marcaId),
      stockPorTalle: formulario.stockPorTalle
        .filter((stock) => stock.cantidad > 0)
        .map((stock) => ({
          talleId: Number(stock.talleId),
          cantidad: Number(stock.cantidad),
        })),
    }


    if (formulario.descripcion?.trim()) {
      productoData.descripcion = formulario.descripcion.trim()
    }

    if (formulario.imagen?.trim()) {
      productoData.imagen = formulario.imagen.trim()
    }
/*
    if (productoEditando) {
      const datosActualizacion = {
        id: productoEditando.id,
        ...productoData,
      }
      dispatch(
        actualizarProducto({
          id: productoEditando.id,
          productoData: datosActualizacion,
        }),
      )
    } else {
      dispatch(crearProducto(productoData))
    }

 CAMBIOOOO 
    if (productoEditando) {
  const datosActualizacion = {
    id: productoEditando.id,
    ...productoData,
  }

  dispatch(
    actualizarProducto({
      id: productoEditando.id,
      productoData: datosActualizacion,
    }),
  ).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(cargarDatosProductos()) 
    }
  })
}
  */

if (productoEditando) {
  const datosActualizacion = {
    id: productoEditando.id,
    ...productoData,
  }

  dispatch(
    actualizarProducto({
      id: productoEditando.id,
      productoData: datosActualizacion,
    }),
  ).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(cargarDatosProductos()) 
    }
  })
} else {
  dispatch(crearProducto(productoData)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(cargarDatosProductos()) 
    }
  })
}




  }

  const manejarEditar = (producto) => {
    dispatch(establecerProductoEditando(producto))
    dispatch(inicializarFormulario({ producto, talles }))
    dispatch(mostrarFormularioProducto())
  }

  const manejarEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    dispatch(limpiarMensajes())
    dispatch(eliminarProducto(id))
  }

  const manejarCambioFormulario = (campo, valor) => {
    dispatch(establecerFormulario({ [campo]: valor }))
  }

  const manejarCambioStock = (talleId, cantidad) => {
    dispatch(actualizarStockFormulario({ talleId, cantidad }))
  }

  const obtenerStockTotal = (producto) => {
    const stockArray = producto.stockDisponible || producto.stockPorTalle || []
    return stockArray.reduce((total, stock) => total + (stock.cantidad || 0), 0)
  }

  const obtenerNombreMarca = (marca) => {
    if (typeof marca === 'string') return marca
    if (typeof marca === 'object' && marca?.nombre) return marca.nombre
    return "Sin marca"
  }

  const manejarNuevoProducto = () => {
    dispatch(inicializarFormulario({ producto: null, talles }))
    dispatch(mostrarFormularioProducto())
  }

  if (cargando) {
    return <div className="text-center p-4">Cargando productos...</div>
  }

  return (
    <div className="gestion-productos-full-width">
      {/* Modal para formulario */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-formulario">
            <div className="card">
              <div className="card-header">
                <h5 className="modal-title">{productoEditando ? "Editar Producto" : "Nuevo Producto"}</h5>
                <button type="button" className="btn-close-modal" onClick={() => dispatch(resetearFormulario())}>
                  ×
                </button>
              </div>
              <div className="card-body">
                {advertencia && (
                  <div className="alert alert-warning mb-3" role="alert">
                    {advertencia}
                  </div>
                )}

                <form onSubmit={manejarSubmit}>
                  <div className="form-container">
                    {/* Primera fila: Modelo y Precio */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="modelo" className="form-label">
                          Modelo del Producto
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="modelo"
                          value={formulario.modelo}
                          onChange={(e) => manejarCambioFormulario("modelo", e.target.value)}
                          required
                          disabled={cargando}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="precio" className="form-label">
                          Precio
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="precio"
                          value={formulario.precio}
                          onChange={(e) => manejarCambioFormulario("precio", e.target.value)}
                          step="0.01"
                          min="0"
                          required
                          disabled={cargando}
                        />
                      </div>
                    </div>

                    {/* Segunda fila: Marca y URL */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="marcaId" className="form-label">
                          Marca ({marcas.length} disponibles)
                        </label>
                        <select
                          className="form-control"
                          id="marcaId"
                          value={formulario.marcaId}
                          onChange={(e) => manejarCambioFormulario("marcaId", e.target.value)}
                          required
                          disabled={cargando}
                        >
                          <option value="">Selecciona una marca</option>
                          {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                              {marca.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="imagen" className="form-label">
                          URL de Imagen
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="imagen"
                          value={formulario.imagen || ""}
                          onChange={(e) => manejarCambioFormulario("imagen", e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          disabled={cargando}
                        />
                      </div>
                    </div>

                    {/* Tercera fila: Descripción (ancho completo) */}
                    <div className="form-row-full">
                      <div className="form-group">
                        <label htmlFor="descripcion" className="form-label">
                          Descripción
                        </label>
                        <textarea
                          className="form-control"
                          id="descripcion"
                          rows="3"
                          value={formulario.descripcion || ""}
                          onChange={(e) => manejarCambioFormulario("descripcion", e.target.value)}
                          placeholder="Descripción del producto..."
                          disabled={cargando}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección de talles */}
                  <div className="stock-section">
                    <h6 className="stock-title">Stock por Talle ({talles.length} talles)</h6>
                    <div className="talles-grid">
                      {talles.map((talle) => (
                        <div key={talle.id} className="talle-item">
                          <label className="talle-label">{talle.numero}</label>
                          <input
                            type="number"
                            className="talle-input"
                            min="0"
                            value={formulario.stockPorTalle.find((s) => s.talleId === talle.id)?.cantidad || 0}
                            onChange={(e) => manejarCambioStock(talle.id, e.target.value)}
                            disabled={cargando}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="btn btn-success" disabled={cargando}>
                      {cargando ? "Guardando..." : productoEditando ? "Actualizar" : "Crear"} Producto
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary1"
                      onClick={() => dispatch(resetearFormulario())}
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

      {/* Lista de productos */}
      <div className="lista-productos">
        <div className="card">
          <div className="card-header">
            <h5 className="tituloContainerGestion">Lista de Productos</h5>
            <button className="btn-header btn-agregar-producto" onClick={manejarNuevoProducto} disabled={cargando}>
              Agregar Producto
            </button>
          </div>
          <div className="card-body">
            <div className="filtro-busqueda">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar por modelo o marca..."
                value={filtroModelo}
                onChange={(e) => dispatch(establecerFiltroModelo(e.target.value))}
              />
            </div>

            {error && (
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

            {productosFiltrados.length === 0 ? (
              <p>
                {filtroModelo
                  ? "No se encontraron productos que coincidan con la búsqueda."
                  : "No hay productos registrados."}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Modelo</th>
                      <th>Marca</th>
                      <th>Precio</th>
                      <th>Stock Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>
                          <img
                            src={
                              producto.imagen ||
                              `/placeholder.svg?height=50&width=50&query=zapatilla+${producto.modelo || "producto"}`
                            }
                            alt={producto.modelo || "Producto"}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            className="rounded"
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{producto.modelo || "Sin nombre"}</strong>
                            {producto.descripcion && (
                              <div>
                                <small className="text-muted">
                                  {producto.descripcion.length > 50
                                    ? `${producto.descripcion.substring(0, 50)}...`
                                    : producto.descripcion}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{obtenerNombreMarca(producto.marca)}</td>
                        <td>${producto.precio?.toLocaleString() || "0"}</td>
                        <td>
                          <span className={`badge ${obtenerStockTotal(producto) > 0 ? "bg-success" : "bg-danger"}`}>
                            {obtenerStockTotal(producto)} unidades
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => manejarEditar(producto)}
                            disabled={cargando}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => manejarEliminar(producto.id)}
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

export default GestionProductos
