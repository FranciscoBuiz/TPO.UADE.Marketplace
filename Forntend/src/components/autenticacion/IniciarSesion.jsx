"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  iniciarSesion,
  limpiarError,
  actualizarFormularioLogin,
  limpiarFormularioLogin,
} from "../../store/slices/authSlice"
import "./IniciarSesion.css"

const IniciarSesion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const { cargando, error, estaAutenticado, formularioLogin } = useSelector((state) => state.auth)

  useEffect(() => {
    if (estaAutenticado) {
      navigate("/")
    }
  }, [estaAutenticado, navigate])

  useEffect(() => {

    dispatch(limpiarError())
    dispatch(limpiarFormularioLogin())
  }, [dispatch])

  const manejarCambio = (e) => {
    dispatch(
      actualizarFormularioLogin({
        [e.target.name]: e.target.value,
      }),
    )
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    dispatch(limpiarError())

    const resultado = await dispatch(
      iniciarSesion({
        email: formularioLogin.email,
        password: formularioLogin.password,
      }),
    )

    if (iniciarSesion.fulfilled.match(resultado)) {
      navigate("/")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Iniciar Sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="login-form" onSubmit={manejarEnvio}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formularioLogin.email}
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
              value={formularioLogin.password}
              onChange={manejarCambio}
              placeholder="Tu contraseña"
              required
              disabled={cargando}
            />
          </div>

          <button type="submit" className="login-button" disabled={cargando}>
            {cargando ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/registrarse" className="login-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default IniciarSesion
