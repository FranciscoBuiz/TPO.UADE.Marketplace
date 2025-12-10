"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  registrarse,
  limpiarError,
  actualizarFormularioRegistro,
  limpiarFormularioRegistro,
  establecerErrorLocal,
} from "../../store/slices/authSlice"
import "./Registrarse.css"

const Registrarse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const { cargando, error, estaAutenticado, formularioRegistro, errorLocal } = useSelector((state) => state.auth)

  useEffect(() => {
    if (estaAutenticado) {
      navigate("/")
    }
  }, [estaAutenticado, navigate])

  useEffect(() => {
    dispatch(limpiarError())
    dispatch(limpiarFormularioRegistro())
  }, [dispatch])

  const manejarCambio = (e) => {
    dispatch(
      actualizarFormularioRegistro({
        [e.target.name]: e.target.value,
      }),
    )
  }

  const validarFormulario = () => {
    if (formularioRegistro.password !== formularioRegistro.confirmarPassword) {
      dispatch(establecerErrorLocal("Las contraseñas no coinciden"))
      return false
    }

    if (formularioRegistro.password.length < 6) {
      dispatch(establecerErrorLocal("La contraseña debe tener al menos 6 caracteres"))
      return false
    }

    return true
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    dispatch(limpiarError())

    if (!validarFormulario()) {
      return
    }

    const resultado = await dispatch(
      registrarse({
        nombre: formularioRegistro.nombre,
        apellido: formularioRegistro.apellido,
        email: formularioRegistro.email,
        password: formularioRegistro.password,
      }),
    )

    if (registrarse.fulfilled.match(resultado)) {
      navigate("/")
    }
  }

  const errorMostrar = errorLocal || error

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Crear Cuenta</h2>
          <p className="register-subtitle">Únete a UrbanStride</p>
        </div>

        {errorMostrar && <div className="alert alert-danger">{errorMostrar}</div>}

        <form className="register-form" onSubmit={manejarEnvio}>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formularioRegistro.nombre}
                  onChange={manejarCambio}
                  placeholder="Tu nombre"
                  required
                  disabled={cargando}
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={formularioRegistro.apellido}
                  onChange={manejarCambio}
                  placeholder="Tu apellido"
                  required
                  disabled={cargando}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formularioRegistro.email}
              onChange={manejarCambio}
              placeholder="tu@email.com"
              required
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formularioRegistro.password}
              onChange={manejarCambio}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmarPassword"
              className="form-control"
              value={formularioRegistro.confirmarPassword}
              onChange={manejarCambio}
              placeholder="Repite tu contraseña"
              required
              disabled={cargando}
            />
          </div>

          <button type="submit" className="register-button" disabled={cargando}>
            {cargando ? (
              <>
                <span className="spinner"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link to="/iniciar-sesion" className="register-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registrarse
