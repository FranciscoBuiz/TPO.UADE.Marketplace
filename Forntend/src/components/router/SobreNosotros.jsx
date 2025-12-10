import "./SobreNosotros.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">

      <section className="sobre-hero">
        <div className="hero-background">
          <img src="/public/img/sobreNosotrosFondo.jpg" alt="Hero Background" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="brand-name">Sobre Nosotros</span>
            </h1>
            <p className="hero-description">
              Más que una tienda, somos una comunidad apasionada por el calzado premium y el estilo urbano.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Historia */}
        <section className="historia-section">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Nuestra Historia</h2>
              <p className="section-description">
                Fundada en 2020, UrbanStride nació de la pasión por las zapatillas premium y el deseo de ofrecer a
                nuestros clientes productos de la más alta calidad. Comenzamos como una pequeña tienda online y hoy
                somos referentes en el mercado argentino.
              </p>
              <p className="section-description">
                Nuestra misión es simple: conectar a las personas con las mejores zapatillas del mundo, brindando una
                experiencia de compra excepcional y un servicio al cliente incomparable.
              </p>
            </div>
            
          </div>
        </section>

        {/* Valores */}
        <section className="valores-section">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">🏆</div>
              <h3>Calidad Premium</h3>
              <p>Solo trabajamos con las mejores marcas y productos de calidad superior.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">🤝</div>
              <h3>Confianza</h3>
              <p>Construimos relaciones duraderas basadas en la transparencia y honestidad.</p>
            </div>
          
            <div className="valor-card">
              <div className="valor-icon">💚</div>
              <h3>Sostenibilidad</h3>
              <p>Comprometidos con prácticas responsables y el cuidado del medio ambiente.</p>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="equipo-section">
          <h2 className="section-title">Nuestro Equipo</h2>
          <div className="equipo-grid">
            <div className="miembro-card">
              <img
                src="/public/img/personal1.jpg"
                alt="CEO"
                className="miembro-imagen"
              />
              <h3>Delfina González</h3>
              <p className="miembro-cargo">CEO & Fundadora</p>
              <p className="miembro-descripcion">
                Apasionada por las zapatillas desde siempre, María fundó UrbanStride
              </p>
            </div>
            <div className="miembro-card">
              <img
                src="/public/img/personal2.jpg"
                alt="CTO"
                className="miembro-imagen"
              />
              <h3>Carlos Rodríguez</h3>
              <p className="miembro-cargo">Director de Tecnología</p>
              <p className="miembro-descripcion">
                Experto en e-commerce y tecnología, Carlos lidera nuestra plataforma digital
              </p>
            </div>
            <div className="miembro-card">
              <img
                src="/public/img/personal3.jpg"
                alt="CMO"
                className="miembro-imagen"
              />
              <h3>Ana Martínez</h3>
              <p className="miembro-cargo">Directora de Marketing</p>
              <p className="miembro-descripcion">
                Especialista en tendencias y marketing digital
              </p>
            </div>
          </div>
        </section>

      {/* Estadísticas */}
        <section className="estadisticas-section">
          <h2 className="section-title">UrbanStride en Números</h2>
          <div className="estadisticas-grid">
            <div className="estadistica-item">
              <div className="estadistica-numero">50K+</div>
              <div className="estadistica-label">Clientes Satisfechos</div>
            </div>
            <div className="estadistica-item">
              <div className="estadistica-numero">500+</div>
              <div className="estadistica-label">Modelos Disponibles</div>
            </div>
            <div className="estadistica-item">
              <div className="estadistica-numero">15+</div>
              <div className="estadistica-label">Marcas Premium</div>
            </div>
            <div className="estadistica-item">
              <div className="estadistica-numero">4.9</div>
              <div className="estadistica-label">Rating Promedio</div>
            </div>
          </div>
        </section>
        
      </div>
      <ChatBotWidget />
    </div>
  )
}

export default SobreNosotros