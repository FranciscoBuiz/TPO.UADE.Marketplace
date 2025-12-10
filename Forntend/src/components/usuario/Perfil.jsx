import { useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Form, Alert } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { actualizarUsuario } from "../../store/slices/authSlice"
import {
  cargarHistorialCompras,
  actualizarDatosUsuario,
  iniciarEdicion,
  cancelarEdicion,
  actualizarDatosEdicion,
  establecerMensaje,
  limpiarMensaje,
} from "../../store/slices/perfilSlice"
import "./Perfil.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"

const Perfil = () => {
  const dispatch = useDispatch()
  const { usuario, esAdmin } = useSelector((state) => state.auth)
  const { historialCompras, cargandoHistorial, editando, datosEdicion, guardando, mensaje } = useSelector(
    (state) => state.perfil
  )

  useEffect(() => {
    if (usuario && !esAdmin) {
      const usuarioId = usuario.id || usuario.usuarioId || usuario.userId
      if (usuarioId) {
        dispatch(cargarHistorialCompras(usuarioId))
      }
    }
  }, [usuario, esAdmin, dispatch])

  useEffect(() => {
    if (mensaje.texto && mensaje.tipo === "success") {
      const timer = setTimeout(() => {
        dispatch(limpiarMensaje())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensaje, dispatch])

  const manejarIniciarEdicion = () => {
    dispatch(
      iniciarEdicion({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
      })
    )
  }

  const manejarCancelarEdicion = () => {
    dispatch(cancelarEdicion())
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    dispatch(actualizarDatosEdicion({ [name]: value }))
  }

  const validarDatos = () => {
    if (!datosEdicion.nombre.trim()) {
      dispatch(establecerMensaje({ tipo: "danger", texto: "El nombre es obligatorio" }))
      return false
    }
    if (!datosEdicion.apellido.trim()) {
      dispatch(establecerMensaje({ tipo: "danger", texto: "El apellido es obligatorio" }))
      return false
    }
    if (!datosEdicion.email.trim()) {
      dispatch(establecerMensaje({ tipo: "danger", texto: "El email es obligatorio" }))
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEdicion.email)) {
      dispatch(establecerMensaje({ tipo: "danger", texto: "El email no tiene un formato válido" }))
      return false
    }
    return true
  }

  const manejarGuardarCambios = async () => {
    if (!validarDatos()) return

    const usuarioId = usuario.id || usuario.usuarioId || usuario.userId

    try {
      const resultAction = await dispatch(
        actualizarDatosUsuario({
          usuarioId,
          datos: datosEdicion,
        })
      )

      if (actualizarDatosUsuario.fulfilled.match(resultAction)) {
        dispatch(actualizarUsuario(resultAction.payload))
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible"
    try {
      const fechaObj = new Date(fecha)
      if (isNaN(fechaObj.getTime())) return "Fecha no disponible"
      return fechaObj.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Fecha no disponible"
    }
  }

  const obtenerEstadoBadge = (estado) => {
    const estados = {
      PENDIENTE: "warning",
      CONFIRMADA: "success",
      ENVIADA: "info",
      ENTREGADA: "primary",
      CANCELADA: "danger",
    }
    return estados[estado] || "secondary"
  }

  const obtenerMetodoPago = (metodoPago) => {
  const metodos = {
    'tarjeta': 'Tarjeta de crédito/débito',
    'transferencia': 'Transferencia bancaria', 
    'efectivo': 'Pago en efectivo'
  }
  return metodos[metodoPago] || 'Tarjeta de crédito'
}

  return (
    <div className="perfil-container">
      <Container>
        <div className="perfil-header">
          <h1 className="perfil-title">Mi Perfil</h1>
          <p className="perfil-subtitle">Gestiona tu información personal y revisa tu actividad</p>
        </div>

        {mensaje.texto && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="perfil-card">
              <Card.Header className="perfil-card-header">
                <h5>👤 Datos Personales</h5>
                {!editando ? (
                  <Button variant="outline-primary" size="sm" onClick={manejarIniciarEdicion}>
                    Editar
                  </Button>
                ) : (
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={manejarCancelarEdicion}
                      disabled={guardando}
                    >
                      Cancelar
                    </Button>
                    <Button variant="primary" size="sm" onClick={manejarGuardarCambios} disabled={guardando}>
                      {guardando ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body className="perfil-card-body">
                {!editando ? (
                  <>
                    <div className="info-item">
                      <div className="info-label">Nombre Completo</div>
                      <p className="info-value">
                        {usuario?.nombre} {usuario?.apellido}
                      </p>
                    </div>

                    <div className="info-item">
                      <div className="info-label">Correo Electrónico</div>
                      <p className="info-value">{usuario?.email}</p>
                    </div>

                    <div className="info-item">
                      <div className="info-label">Tipo de Usuario</div>
                      <Badge className={`info-badge ${usuario?.rol === "ADMIN" ? "bg-danger" : "bg-primary"}`}>
                        {usuario?.rol === "ADMIN" ? "Administrador" : "Cliente"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={datosEdicion.nombre}
                            onChange={manejarCambio}
                            placeholder="Ingresa tu nombre"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Apellido *</Form.Label>
                          <Form.Control
                            type="text"
                            name="apellido"
                            value={datosEdicion.apellido}
                            onChange={manejarCambio}
                            placeholder="Ingresa tu apellido"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={datosEdicion.email}
                        onChange={manejarCambio}
                        placeholder="Ingresa tu email"
                      />
                    </Form.Group>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* historial de compras */}
        {!esAdmin && (
          <Row>
            <Col>
              <Card className="perfil-card">
                <Card.Header className="perfil-card-header">
                  <h5>🛍️ Historial de Compras ({historialCompras.length})</h5>
                </Card.Header>
                <Card.Body className="perfil-card-body p-0">
                  {cargandoHistorial ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                      <p className="mt-3 text-muted">Cargando historial de compras...</p>
                    </div>
                  ) : historialCompras.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🛒</div>
                      <h5 className="empty-title">No tienes compras realizadas</h5>
                      <p className="empty-text">¡Explora nuestro catálogo y realiza tu primera compra!</p>
                    </div>
                  ) : (
                    <div className="historial-table">
                      <div className="table-responsive">
                        <Table className="mb-0">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Productos</th>
                              <th>Total</th>
                              <th>Estado</th>
                              <th>Detalles</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historialCompras.map((compra, index) => (
                              <tr key={compra.id || `compra-${index}`}>
                                <td>
                                  <strong>{formatearFecha(compra.fechaCompra)}</strong>
                                </td>
                                <td>
                                  {compra.items?.length ? (
                                    compra.items.map((item, itemIndex) => (
                                      <div key={itemIndex} className="producto-item">
                                        <strong>{item.nombre}</strong> - Talle {item.talle} (x{item.cantidad})
                                        <br />
                                        <small className="text-muted">{item.marca}</small>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="producto-item">Sin datos</div>
                                  )}
                                </td>
                                <td>
                                  <strong className="text-success fs-5">${compra.total.toLocaleString()}</strong>
                                </td>
                                <td>
                                  <Badge className={`estado-badge bg-${obtenerEstadoBadge(compra.estado || "CONFIRMADA")}`}>
                                    {compra.estado || "CONFIRMADA"}
                                  </Badge>
                                </td>
                                <td>
                                  <details>
                                    <summary className="detalles-btn">Ver más información</summary>
                                    <div className="detalles-contenido">
                                      <div>
                                        <strong>📦 Cantidad de items:</strong> {compra.items?.length || 0}
                                      </div>
                                      <div>
                                        <strong>🆔 Producto ID:</strong> {compra.items?.[0]?.productoId || "N/A"}
                                      </div>
                                      <div>
                                        <strong>💳 Método de pago:</strong> Tarjeta de crédito
                                      </div>
                                      <div>
                                        <strong>📅 Fecha completa:</strong> {compra.fechaCompra || "No disponible"}
                                      </div>
                                      <div>
                                        <strong>🏪 Estado del pedido:</strong> {compra.estado || "CONFIRMADA"}
                                      </div>
                                    </div>
                                  </details>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="perfil-card">
              <Card.Header className="perfil-card-header">
                <h5>⚙️ Configuración de Cuenta</h5>
              </Card.Header>
              <Card.Body className="perfil-card-body">
                <div className="config-section">
                  <h6 className="config-title">🔔 Notificaciones</h6>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="form-check">
                      <input className="form-check-input" type="checkbox" defaultChecked id={`notif${i}`} />
                      <label className="form-check-label" htmlFor={`notif${i}`}>
                        {[
                          "Recibir notificaciones de nuevos productos",
                          "Recibir notificaciones de ofertas especiales",
                          "Recibir actualizaciones de estado de pedidos",
                        ][i - 1]}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="info-alert">
                  <h6>💡 Información Importante</h6>
                  <p>Para cambiar tu contraseña, contacta con nuestro equipo de soporte técnico.</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ChatBotWidget />
    </div>
  )
}

export default Perfil