## Arbol de directorios:

mi-proyecto/
│
├── backend/                  # Carpeta principal del backend
│   ├── config/               # Configuraciones del proyecto (base de datos, otros servicios)
│   ├── models/               # Modelos de la base de datos (si usas un ORM como Mongoose)
│   ├── routes/               # Rutas y controladores de la API
│   ├── middleware/           # Middlewares (autenticación, validaciones, etc.)
│   ├── utils/                # Funciones de utilidad
│   ├── tests/                # Tests del backend
│   ├── package.json          # Dependencias y scripts del backend
│   └── server.js             # Punto de entrada del servidor
│
├── frontend/                 # Carpeta principal del frontend (React)
│   ├── public/               # Archivos públicos (index.html, favicon, etc.)
│   ├── src/                  # Código fuente de React
│   │   ├── assets/           # Recursos como imágenes, fuentes, etc.
│   │   ├── components/       # Componentes reutilizables de React
│   │   ├── views/            # Componentes de página o vistas principales
│   │   ├── services/         # Servicios para comunicarse con el backend (API calls)
│   │   ├── store/            # Si usas Redux o algún estado global, aquí va la configuración
│   │   ├── App.js            # Componente principal de React
│   │   └── index.js          # Punto de entrada de React
│   ├── package.json          # Dependencias y scripts del frontend
│   └── README.md             # Documentación específica del frontend
│
└── README.md                 # Documentación principal del proyecto

# Falta revisar

Estilo de programacion
Cohesion con el DC
Organizacion de carpetas