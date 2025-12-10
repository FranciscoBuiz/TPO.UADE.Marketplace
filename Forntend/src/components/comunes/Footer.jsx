"use client"

import { Link } from "react-router-dom"
import { Instagram, MessageCircle, Twitter, Facebook } from "lucide-react"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-background">
        <div className="footer-overlay"></div>
      </div>

      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h3 className="footer-logo">UrbanStride</h3>
              <p className="footer-description">
                Tu destino premium para las mejores zapatillas. Calidad, estilo y comodidad en cada paso que das.
              </p>

              <div className="social-links">
                <a href="#" className="social-link instagram" aria-label="Síguenos en Instagram">
                  <Instagram size={16} />
                </a>
                <a href="#" className="social-link whatsapp" aria-label="Contáctanos por WhatsApp">
                  <MessageCircle size={16} />
                </a>
                <a href="#" className="social-link twitter" aria-label="Síguenos en Twitter">
                  <Twitter size={16} />
                </a>
                <a href="#" className="social-link facebook" aria-label="Síguenos en Facebook">
                  <Facebook size={16} />
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Productos</h4>
                <ul>
                  <li>
                    <Link to="/productos">Todas las Zapatillas</Link>
                  </li>
                  <li>
                    <Link to="/productos">Adidas</Link>
                  </li>
                  <li>
                    <Link to="/productos">Nike</Link>
                  </li>
                  <li>
                    <Link to="/productos">Puma</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Ayuda</h4>
                <ul>
                  <li>
                    <Link to="/contacto">Contacto</Link>
                  </li>
                  <li>
                    <Link to="/contacto">Envíos y Devoluciones</Link>
                  </li>
                  <li>
                    <Link to="/guia-talles">Guía de Talles</Link>
                  </li>
                  <li>
                    <a href="/contacto">Preguntas Frecuentes</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Empresa</h4>
                <ul>
                  <li>
                    <Link to="/sobre-nosotros">Sobre Nosotros</Link>
                  </li>
                  <li>
                    <Link to="/sobre-nosotros">Comienzos</Link>
                  </li>
                  <li>
                    <Link to="/sobre-nosotros">Sostenibilidad</Link>
                  </li>
                  <li>
                    <Link to="/sobre-nosotros">Miembros</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 UrbanStride. Todos los derechos reservados.</p>
              <div className="footer-legal">
                <p>Términos y Condiciones</p>
                <p>Política de Privacidad</p>
                <p>Cookies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
