import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navigation from "./components/router/Navigation";
import Home from "./components/router/Home";
import Productos from "./components/router/Productos";
import SobreNosotros from "./components/router/SobreNosotros";
import Contacto from "./components/router/Contacto";
import IniciarSesion from "./components/autenticacion/IniciarSesion";
import Registrarse from "./components/autenticacion/Registrarse";
import DetalleProducto from "./components/productos/DetalleProducto";
import Carrito from "./components/carrito/Carrito";
import Perfil from "./components/usuario/Perfil";
import GestionProductos from "./components/productos/GestionProductos";
import RutaProtegida from "./components/comunes/RutaProtegida";
import Footer from "./components/comunes/Footer";
import DashboardAdmin from "./components/admin/DashboardAdmin";
import GestionMarcas from "./components/admin/GestionMarcas";
import GestionTalles from "./components/admin/GestionTalles";
import GestionUsuarios from "./components/admin/GestionUsuarios";
import InformacionCompra from "./components/checkout/InformacionCompra";
import PagoCompra from "./components/checkout/PagoCompra";
import ConfirmacionCompra from "./components/checkout/ConfirmacionCompra";
import GuiaTalles from "./components/comunes/GuiaTalles";
import HistorialCompras from "./components/admin/HistorialCompras";
import { useEffect } from "react";

function App() {
    useEffect(() => {
      const originalTitle = document.title;
      const mensajes = [
        "👟 ¡Volvé! Tus zapatillas te esperan...",
        "🛒 Hay ofertas que no viste...",
        "🚀 No te quedes sin tu par ideal...",
        "🔥 UrbanStride sigue abierto...",
      ];

      let mensajeIndex = 0;
      let intervalId;

      const handleVisibilityChange = () => {
        if (document.hidden) {
          intervalId = setInterval(() => {
            document.title = mensajes[mensajeIndex];
            mensajeIndex = (mensajeIndex + 1) % mensajes.length;
          }, 1000);
        } else {
          clearInterval(intervalId);
          document.title = originalTitle;
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        clearInterval(intervalId); 
      };
    }, []);

  return (
    <Provider store={store}>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/guia-talles" element={<GuiaTalles />} />
            <Route
              path="/carrito"
              element={
                <RutaProtegida>
                  <Carrito />
                </RutaProtegida>
              }
            />
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />
            {/* Rutas de compra/checkout */}
            <Route
              path="/checkout/informacion"
              element={
                <RutaProtegida>
                  <InformacionCompra />
                </RutaProtegida>
              }
            />
            <Route
              path="/checkout/pago"
              element={
                <RutaProtegida>
                  <PagoCompra />
                </RutaProtegida>
              }
            />
            <Route
              path="/checkout/confirmacion"
              element={
                <RutaProtegida>
                  <ConfirmacionCompra />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <GestionProductos />
                </RutaProtegida>
              }
            />
            <Route
              path="/gestion-productos"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <GestionProductos />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <DashboardAdmin />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/marcas"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <GestionMarcas />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <GestionUsuarios />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/talles"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <GestionTalles />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/historial-compras"
              element={
                <RutaProtegida requiereVendedor={true}>
                  <HistorialCompras />
                </RutaProtegida>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
