# TP TTADS Cine
Trabajo practico para la materia **Técnicas y Tecnologías Avanzadas de Desarrollo de Software** de la **Universidad Tecnológica Nacional (Facultad Regional Rosario)**

Alumno: 40283 - **Hernán Caparros**

## Breve descripción de la app
Aplicación Web de un Cine en el que un usuario puede comprar entradas para las funciones de las películas que están en cartelera, así como también poder ver los detalles de las películas que se estrenarán en el futuro y poder agregarlas a favoritos en su perfil.

Por otro lado, los usuarios de tipo administrador, además de tener control total en todo lo relacionado a la gestión de los datos de la aplicación, también podrá acceder a reportes que muestran un ranking de películas a estrenar según cuántos usuarios la agregaron a favoritos (útil para el momento de decidir cuántas funciones se le dedicarán a cada película en el momento de su estreno) y a reportes que muestran un ranking de películas según la cantidad de entradas vendidas en los últimos 7 días (útil para el momento de decidir cuántas funciones se le dedicarán a cada película ya estrenada en la próxima semana).

La aplicación está desarrollada en **TypeScript**. Utiliza **Node.js** como entorno de ejecución y **Express** como framework web para construir APIs y manejar rutas. La seguridad se implementa mediante **JWT (JSON Web Tokens)**. Para interactuar con la base de datos de **MongoDB**, se usa **MikroORM** como ORM.

## Deploy de la aplicación
https://frontend-ttads-cine.onrender.com

## Repositorio del backend
https://github.com/hernancap/backend-TTADS-CINE.git


# Credenciales de Prueba

## Usuarios de Prueba

| Rol           | Email       | Contraseña  |
|--------------|----------------------|-------------|
| **Admin** | `admin@admin.com`               | `12345678`  |
| **Cliente**      | `juan@mail.com`               | `juanjuan`  |

---

## Tarjeta para Pago Aprobado  

| **Número de Tarjeta** | `4002 7686 9439 5619` |
|-------------------------|----------------------|
| **Código de Seguridad** | `123` |
| **Fecha de Expiración** | `11/30` |
| **Nombre en la Tarjeta** | `APRO` |
| **DNI** | `12345678` |

---

# Para instalación local:

## Requisitos previos
- Node.js (versión 18.x o superior) y npm instalados.

## Instalación y ejecución
1. Clona el repositorio:
   ```bash
   git clone https://github.com/hernancap/frontend-TTADS-CINE.git
   cd frontend-TTADS-CINE
   ```
2. Instala las dependencias
    ```bash
    npm install
    ```
3. (OPCIONAL) Crea un archivo `.env.development` basado en el ejemplo proporcionado (ver sección de Variables de Entorno). 

4. Ejecuta la aplicación en modo desarrollo
    ```bash
    npm run dev
    ```
---

### **Configuración de variables de entorno**
#### **Archivo `.env.development` de ejemplo:** 
```env
# API URL (URL del backend de la aplicación)
# En caso de no configurarlo, se asignará la siguiente URL por defecto:
VITE_API_BASE_URL=http://localhost:3000/api
```

