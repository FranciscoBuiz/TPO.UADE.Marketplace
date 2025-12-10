import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import carritoReducer from "./slices/carritoSlice"
import marcasReducer from "./slices/marcasSlice"
import tallesReducer from "./slices/tallesSlice"
import usuariosReducer from "./slices/usuariosSlice"
import productosReducer from "./slices/productosSlice"
import compraReducer from "./slices/compraSlice"
import historialComprasReducer from "./slices/historialComprasSlice"
import chatbotReducer from "./slices/chatbotSlice"
import perfilReducer from "./slices/perfilSlice"
import contactoReducer from "./slices/contactoSlice"
import detalleProductoReducer from "./slices/detalleProductoSlice"
import navigationReducer from "./slices/navigationSlice"
import homeReducer from "./slices/homeSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    carrito: carritoReducer,
    marcas: marcasReducer,
    talles: tallesReducer,
    usuarios: usuariosReducer,
    productos: productosReducer,
    compra: compraReducer,
    historialCompras: historialComprasReducer,
    chatbot: chatbotReducer,
    perfil: perfilReducer,
    contacto: contactoReducer,
    detalleProducto: detalleProductoReducer,
    navigation: navigationReducer,
    home: homeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

