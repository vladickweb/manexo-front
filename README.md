
<div align="center">
  <img src="public/manexo-logo.svg" alt="Manexo Logo" width="200"/>
  <br/>
  <p><i>Conectando personas con los mejores servicios profesionales</i></p>
</div>

# Manexo - Plataforma de Servicios Profesionales


## 🚀 Características

- **Catálogo de Servicios** - Encuentra servicios organizados por categorías
- **Ubicación Inteligente** - Busca servicios cerca de ti con Google Places
- **Perfiles de Usuario** - Gestiona tu perfil y tus servicios favoritos
- **Mensajería** - Comunícate directamente con los proveedores de servicios
- **Diseño Responsive** - Experiencia perfecta en dispositivos móviles y desktop

## 🔧 Tecnologías

- **Frontend:**
  - React 18+
  - TypeScript
  - Tailwind CSS
  - React Router
  - Zustand (Gestión de estado)
  - React Query (Manejo de datos)
  - Formik & Yup (Validación de formularios)

- **Integración:**
  - Google Places API
  - Axios (Cliente HTTP)
  - JWT Authentication

## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/manexo-front.git
   cd manexo-front
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_api_aqui
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
manexo-front/
├── public/                  # Archivos estáticos
├── src/
│   ├── api/                 # Cliente Axios y configuración
│   ├── assets/              # Imágenes, íconos, etc.
│   ├── components/          # Componentes reutilizables
│   ├── hooks/
│   │   ├── api/             # Hooks para llamadas a la API
│   │   └── useAuth.ts       # Hook de autenticación
│   ├── layouts/             # Layouts de la aplicación
│   ├── modules/             # Módulos principales
│   │   ├── LandingPage/
│   │   ├── ProfilePage/
│   │   ├── ServicesPage/
│   │   └── ...
│   ├── routes/              # Configuración de rutas
│   └── stores/              # Estados globales (Zustand)
├── .env                     # Variables de entorno
└── package.json
```

## 🔐 Autenticación

La aplicación utiliza JWT para la autenticación:

- **Access Token**: Para peticiones autenticadas
- **Refresh Token**: Para renovar el acceso cuando caduque
- **Persistencia**: Los tokens se almacenan en localStorage

## 🌎 Selector de Ubicación

El componente `AddressSelector` permite buscar direcciones:

- Utiliza Google Places Autocomplete
- Restringido a direcciones en España
- Adaptativo: En desktop aparece junto al logo, en mobile debajo del header

## 📱 Navegación

La aplicación incluye:

- **Servicios**: Página principal con categorías
- **Favoritos**: Servicios guardados
- **Mensajes**: Comunicación con proveedores
- **Perfil**: Gestión de cuenta

## 🧩 Componentes Principales

### MainLayout

Proporciona la estructura común para todas las páginas:
- Header con logo y selector de ubicación
- Navegación inferior
- Contenido principal adaptable

### ServicesPage

Muestra las categorías de servicios en un formato visual atractivo.

### AddressSelector

Permite buscar y seleccionar ubicaciones usando Google Places API.

## 🔄 Flujo de Datos

1. **Autenticación**:
   - Login/Registro → Obtención de tokens
   - Almacenamiento en el store → Persistencia
   - Verificación automática al iniciar la app

2. **Peticiones a la API**:
   - Interceptores para añadir token
   - React Query para caché y revalidación
   - Manejo de errores centralizado

## 📝 Requisitos

- Node.js 16+
- Cuenta de Google Cloud (para API Key)
- API backend en funcionamiento

## 🤝 Contribución

1. Fork el repositorio
2. Crea una nueva rama (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  <p>Desarrollado con ❤️ por <a href="https://github.com/vladickweb">Vladick</a></p>
</div>
