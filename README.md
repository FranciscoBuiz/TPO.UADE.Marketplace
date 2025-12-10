# 👟 UrbanStride - Marketplace de Zapatillas

> Trabajo Práctico Obligatorio (TPO) - UADE
> Materia: Aplicaciones Interactivas

UrbanStride es una plataforma de E-commerce moderna y responsiva dedicada a la venta de zapatillas premium. Este proyecto implementa un flujo completo de compra, gestión de usuarios y un panel de administración robusto para el control de inventario y ventas.

![UrbanStride Banner](/Forntend/public/img/fondo-hero.jpg)

## 🚀 Tecnologías Utilizadas

Este proyecto fue construido utilizando una arquitectura **SPA (Single Page Application)** moderna:

### Frontend
* **React 19** + **Vite**: Para un desarrollo rápido y optimizado.
* **Redux Toolkit**: Gestión global del estado (Auth, Carrito, Productos, Chatbot).
* **React Router DOM**: Navegación y rutas protegidas.
* **CSS Moderno**: Diseño responsivo con Variables CSS, Flexbox y Grid.
* **Bootstrap / React-Bootstrap**: Componentes de UI y sistema de grillas.
* **Lucide React**: Iconografía.

### Backend (Conexión)
* El frontend se comunica con una API REST (Java/Spring Boot) alojada por defecto en `http://localhost:8080/api`.

---

## ✨ Funcionalidades Principales

### 👤 Cliente / Usuario
* **Catálogo de Productos:** Filtrado por Marca, Precio y Búsqueda por nombre.
* **Detalle de Producto:** Selección de talles con validación de stock en tiempo real.
* **Carrito de Compras:** Gestión de items, cantidades y cálculo de totales.
* **Checkout Completo:** Proceso de 3 pasos (Información -> Pago -> Confirmación).
* **Perfil de Usuario:** Edición de datos personales y **Historial de Compras**.
* **Chatbot (Urbanbot):** Asistente virtual automatizado para preguntas frecuentes.
* **Autenticación:** Login y Registro con validaciones y manejo de tokens (JWT).

### 🛡️ Panel de Administración (Backoffice)
* **Dashboard:** Accesos rápidos a las secciones de gestión.
* **Gestión de Productos:** CRUD completo (Crear, Leer, Actualizar, Borrar) con control de stock por talle e imágenes.
* **Gestión de Marcas y Talles:** ABM para administrar las variantes del negocio.
* **Gestión de Usuarios:** Visualización de usuarios registrados y roles.
* **Historial de Ventas:** Reportes de ventas, estadísticas y filtrado por fechas.

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para correr el proyecto en tu entorno local:

### Prerrequisitos
* Node.js (versión 18 o superior)
* Backend (API Java/Spring Boot) corriendo en el puerto 8080.

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/FranciscoBuiz/TPO.UADE.Marketplace.git](https://github.com/FranciscoBuiz/TPO.UADE.Marketplace.git)
    cd TPO.UADE.Marketplace/Forntend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno (Opcional):**
    Si necesitas cambiar la URL de la API, edita el archivo `src/servicios/api.js` o crea un archivo `.env`.
    *Por defecto apunta a:* `http://localhost:8080/api`

4.  **Correr el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Abrir en el navegador:**
    Visita `http://localhost:5173` (o el puerto que te indique la terminal).

---

## 📂 Estructura del Proyecto

```text
src/
├── components/
│   ├── admin/          # Dashboard, Gestión de Productos, Marcas, Usuarios
│   ├── autenticacion/  # Login, Registro
│   ├── carrito/        # Componente y lógica del carrito
│   ├── chatbot/        # Widget del Chatbot
│   ├── checkout/       # Pasos de compra (Info, Pago, Confirmación)
│   ├── comunes/        # Footer, Rutas Protegidas, Guía de Talles
│   ├── productos/      # Listado, Detalle, Filtros
│   ├── router/         # Home, Navigation, Contacto, Sobre Nosotros
│   └── usuario/        # Perfil de usuario
├── servicios/          # api.js (Llamadas fetch al Backend)
├── store/              # Redux Store y Slices (auth, carrito, productos...)
├── App.jsx             # Configuración de Rutas
└── main.jsx            # Punto de entrada
```
## 📝 Notas Adicionales
Roles: El sistema cuenta con roles USER y ADMIN. Para acceder al panel de administración, el usuario debe tener el rol ADMIN en la base de datos.

Seguridad: Las rutas administrativas están protegidas mediante el componente RutaProtegida.
