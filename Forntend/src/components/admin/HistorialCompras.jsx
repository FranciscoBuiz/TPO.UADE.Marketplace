"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  cargarTodosLosDatos,
  cargarComprasPorFecha,
  actualizarFiltro,
  limpiarFiltros,
  cambiarOrdenamiento,
  cambiarPagina,
  cambiarItemsPorPagina,
  toggleFiltros,
  limpiarError,
  selectComprasPaginadas,
  selectEstadisticas,
  selectVentasPorMes,
  selectLoading,
  selectLoadingCompras,
  selectError,
  selectErrorCompras,
  selectFiltros,
  selectMostrarFiltros,
  selectOrdenamiento,
  selectPaginaActual,
  selectItemsPorPagina,
  selectTotalPaginas,
  selectEstadisticasFiltradas,
  selectHayFiltrosActivos,
} from "../../store/slices/historialComprasSlice"
import "./HistorialCompras.css"

const HistorialCompras = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const comprasPaginadas = useSelector(selectComprasPaginadas)
  const estadisticas = useSelector(selectEstadisticas)
  const ventasPorMes = useSelector(selectVentasPorMes)
  const estadisticasFiltradas = useSelector(selectEstadisticasFiltradas)
  const loading = useSelector(selectLoading)
  const loadingCompras = useSelector(selectLoadingCompras)
  const error = useSelector(selectError)
  const errorCompras = useSelector(selectErrorCompras)
  const filtros = useSelector(selectFiltros)
  const mostrarFiltros = useSelector(selectMostrarFiltros)
  const ordenamiento = useSelector(selectOrdenamiento)
  const paginaActual = useSelector(selectPaginaActual)
  const itemsPorPagina = useSelector(selectItemsPorPagina)
  const totalPaginas = useSelector(selectTotalPaginas)
  const hayFiltrosActivos = useSelector(selectHayFiltrosActivos)

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]


  useEffect(() => {
    if (usuario && usuario.rol === "ADMIN") {
      dispatch(cargarTodosLosDatos())
    }
  }, [usuario, dispatch])


  const manejarCambioFiltro = (campo, valor) => {
    dispatch(actualizarFiltro({ campo, valor }))
  }

  const manejarLimpiarFiltros = () => {
    dispatch(limpiarFiltros())
  }

  const manejarCambioOrdenamiento = (nuevoOrden) => {
    dispatch(cambiarOrdenamiento(nuevoOrden))
  }

  const manejarCambioPagina = (nuevaPagina) => {
    dispatch(cambiarPagina(nuevaPagina))
  }

  const manejarCambioItemsPorPagina = (nuevosItems) => {
    dispatch(cambiarItemsPorPagina(Number.parseInt(nuevosItems)))
  }

  const manejarToggleFiltros = () => {
    dispatch(toggleFiltros())
  }

  const manejarReintentar = () => {
    dispatch(limpiarError())
    dispatch(cargarTodosLosDatos())
  }

  const manejarBuscarPorFecha = () => {
    if (filtros.fechaInicio && filtros.fechaFin) {
      dispatch(
        cargarComprasPorFecha({
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        }),
      )
    }
  }



  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(valor)
  }


  if (!usuario || usuario.rol !== "ADMIN") {
    return (
      <div className="historial-compras">
        <div className="error-message">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="historial-compras">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando historial de compras...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="historial-compras">
      <div className="container">
        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <h1>Historial de Compras</h1>
            <p>Gestiona y analiza todas las compras realizadas</p>
            
          </div>
          
        </div>

        {/* Errores */}
        {(error || errorCompras) && (
          <div className="error-message">
            <p>{error || errorCompras}</p>
            <button onClick={manejarReintentar} className="btn-retry">
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Estadísticas Principales */}
        {estadisticas && (
          <div className="estadisticas-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Ventas</h3>
                <p className="stat-value">{formatearMoneda(estadisticas.totalVentas)}</p>
                
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <h3>Total Compras</h3>
                <p className="stat-value">{estadisticas.totalCompras}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Promedio por Compra</h3>
                <p className="stat-value">{formatearMoneda(estadisticas.promedioCompra)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔍</div>
              <div className="stat-content">
                <h3>Compras Filtradas</h3>
                <p className="stat-value">{estadisticasFiltradas.totalCompras}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ventas por Mes */}
        {ventasPorMes.length > 0 && (
          <div className="ventas-mes-section">
            <h2>Ventas por Mes</h2>
            <div className="ventas-mes-grid">
              {ventasPorMes.slice(0, 6).map((venta, index) => (
                <div key={index} className="venta-mes-card">
                  <div className="venta-mes-header">
                    <span className="mes-nombre">
                      {meses[venta.mes - 1]} {venta.año}
                    </span>
                    <span className="cantidad-badge">{venta.cantidad} compras</span>
                  </div>
                  <div className="venta-total">{formatearMoneda(venta.total)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="filtros-section">
            <div className="filtros-header">
              <h2>
                <span className="icon">🔍</span>
                Filtros
              </h2>
            </div>

            <div className="filtros-grid">
              <div className="filtro-group">
                <label>Buscar Usuario</label>
                <input
                  type="text"
                  placeholder="Nombre o email..."
                  value={filtros.usuario}
                  onChange={(e) => manejarCambioFiltro("usuario", e.target.value)}
                  className="filtro-input"
                />
              </div>

              <div className="filtro-group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => manejarCambioFiltro("fechaInicio", e.target.value)}
                  className="filtro-input"
                />
              </div>

              <div className="filtro-group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => manejarCambioFiltro("fechaFin", e.target.value)}
                  className="filtro-input"
                />
              </div>

              <div className="filtro-group">
                <label>Mes</label>
                <select
                  value={filtros.mes}
                  onChange={(e) => manejarCambioFiltro("mes", e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todos los meses</option>
                  {meses.map((mes, index) => (
                    <option key={index} value={index + 1}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filtro-group">
                <label>Ordenar por</label>
                <select
                  value={ordenamiento}
                  onChange={(e) => manejarCambioOrdenamiento(e.target.value)}
                  className="filtro-select"
                >
                  <option value="fecha-desc">Fecha (Más reciente)</option>
                  <option value="fecha-asc">Fecha (Más antigua)</option>
                  <option value="total-desc">Total (Mayor a menor)</option>
                  <option value="total-asc">Total (Menor a mayor)</option>
                </select>
              </div>

              <div className="filtros-actions">
                <button onClick={manejarLimpiarFiltros} className="btn-limpiar" disabled={!hayFiltrosActivos}>
                  Limpiar Filtros
                </button>
                
              </div>
            </div>
          </div>
        )}

        {/* Controles de Paginación Superior */}
        <div className="controles-superiores">
          <div className="info-resultados">
            <span>
              Mostrando {(paginaActual - 1) * itemsPorPagina + 1} -{" "}
              {Math.min(paginaActual * itemsPorPagina, estadisticasFiltradas.totalCompras)} de{" "}
              {estadisticasFiltradas.totalCompras} compras
            </span>
          </div>
          <div className="controles-paginacion">
            <select
              value={itemsPorPagina}
              onChange={(e) => manejarCambioItemsPorPagina(e.target.value)}
              className="select-items-pagina"
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>
        </div>

        {/* Lista de Compras */}
        <div className="compras-section">
          {loadingCompras ? (
            <div className="loading-compras">
              <div className="loading-spinner"></div>
              <p>Cargando compras...</p>
            </div>
          ) : comprasPaginadas.length === 0 ? (
            <div className="no-compras">
              <div className="no-compras-icon">📋</div>
              <h3>No hay compras</h3>
              <p>
                {hayFiltrosActivos
                  ? "No se encontraron compras que coincidan con los filtros aplicados."
                  : "No hay compras registradas en el sistema."}
              </p>
              {hayFiltrosActivos && (
                <button onClick={manejarLimpiarFiltros} className="btn-limpiar-filtros">
                  Limpiar Filtros
                </button>
              )}
            </div>
          ) : (
            <div className="compras-lista">
              {comprasPaginadas.map((compra) => (
                <div key={compra.id} className="compra-card">
                  <div className="compra-header">
                    <div className="compra-info">
                      <div className="compra-badges">
                        <span className="compra-id">#{compra.id}</span>
                        <span className="usuario-nombre">{compra.usuarioNombre}</span>
                        <span className="usuario-email">({compra.usuarioEmail})</span>
                      </div>
                      <div className="compra-fecha">
                        <span className="icon">📅</span>
                        {formatearFecha(compra.fechaCompra)}
                      </div>
                    </div>
                    <div className="compra-total-section">
                      <div className="compra-total">{formatearMoneda(compra.total)}</div>
                      <div className="compra-items-count">
                        {compra.items?.length || 0} producto{(compra.items?.length || 0) !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {compra.items && compra.items.length > 0 && (
                    <div className="compra-items">
                      <div className="items-grid">
                        {compra.items.map((item, index) => (
                          <div key={index} className="item-card">
                            <div className="item-info">
                              <span className="item-nombre">
                                {item.marca} {item.nombre} (T.{item.talle})
                              </span>
                            </div>
                            <div className="item-precio">
                              {item.cantidad}x {formatearMoneda(item.precioUnitario)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="paginacion">
            <button
              onClick={() => manejarCambioPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="btn-paginacion"
            >
              ← Anterior
            </button>

            <div className="numeros-pagina">
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let numeroPagina
                if (totalPaginas <= 5) {
                  numeroPagina = i + 1
                } else if (paginaActual <= 3) {
                  numeroPagina = i + 1
                } else if (paginaActual >= totalPaginas - 2) {
                  numeroPagina = totalPaginas - 4 + i
                } else {
                  numeroPagina = paginaActual - 2 + i
                }

                return (
                  <button
                    key={numeroPagina}
                    onClick={() => manejarCambioPagina(numeroPagina)}
                    className={`btn-numero ${paginaActual === numeroPagina ? "activo" : ""}`}
                  >
                    {numeroPagina}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => manejarCambioPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="btn-paginacion"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Información adicional */}

      </div>
    </div>
  )
}

export default HistorialCompras
