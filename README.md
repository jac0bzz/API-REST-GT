# 🛠️ Help Desk Corporativo - Sistema de Gestión de Incidentes (Full-Stack)

¡Bienvenido! Este es un sistema integral de mesa de ayuda (Help Desk) diseñado bajo una arquitectura **desacoplada (Decoupled)** y organizado en un formato de **Monorepo**. El proyecto permite a las empresas gestionar incidentes de soporte técnico de manera eficiente, separando por completo los flujos de trabajo de los **Clientes** y del equipo de **Soporte Técnico (Ejecutadores/Staff)**.

Este repositorio fue construido con estándares profesionales para demostrar buenas prácticas de desarrollo de software, control de roles, seguridad JWT y analítica de datos en tiempo real.

---

## 🏗️ Arquitectura del Proyecto (Monorepo)

El proyecto está organizado en dos grandes bloques independientes dentro del mismo repositorio:

* **`API-REST-BACK/`**: API REST pura construida con **Django** y **Django REST Framework (DRF)**, conectada a una base de datos relacional **MySQL**. Se encarga de la lógica de negocio, encriptación de contraseñas, seguridad y persistencia de datos.
* **`API-REST-FRONT/`**: Interfaz de usuario dinámica e interactiva construida con **React (Vite)**, estilizada de forma profesional con **Tailwind CSS** y potenciada con **Lucide Icons**.

---

## 🎯 Características Principales

### 🔐 1. Seguridad Avanzada y Gestión de Sesiones (JWT)
* Autenticación basada en **JSON Web Tokens (JWT)** mediante `SimpleJWT`.
* **Token Customization**: El token de acceso lleva inyectado el `username` y el rol `is_staff` de forma encriptada desde el backend.
* **Auto-Refresh Invisible**: Implementación de un interceptor inteligente (`customFetch`) en React que detecta de forma automática cuándo el token de acceso expira, solicita uno nuevo al backend usando el `Refresh Token` y reintenta la petición original del usuario de forma transparente y sin cerrar la sesión.

### 👥 2. Control de Roles y Flujo Dinámico (RBAC)
* **Vista Cliente**: Los usuarios autónomos pueden registrarse mediante el módulo web de la aplicación. Al ingresar, solo pueden reportar tickets nuevos y ver/dar seguimiento exclusivamente a los incidentes que ellos mismos crearon.
* **Vista Soporte Técnico (Staff)**: El personal técnico cuenta con un panel global con acceso a todos los tickets del sistema, capacidad de cambiar los estados del ciclo de vida del ticket (Abierto, En Proceso, Resuelto) mediante controles exclusivos y herramientas de auditoría.

### 💬 3. Hilo de Conversación por Incidente
* Cada ticket cuenta con un chat interno dinámico donde el cliente y el técnico asignado pueden comunicarse directamente para agilizar la resolución de la incidencia mediante comentarios detallados.

### 📊 4. Dashboard Ejecutivo en Tiempo Real
* El personal de soporte cuenta con un centro de control analítico en la parte superior de la interfaz que calcula instantáneamente:
    * Métricas de rendimiento generales (Total de incidentes, Abiertos, En Proceso, Resueltos).
    * Distribución visual mediante barras de porcentaje para medir la criticidad de los incidentes (Alta, Media, Baja).

---

## 🛠️ Tecnologías Utilizadas

**Backend:**
* Python 3
* Django 4.2+ & Django REST Framework (DRF)
* SimpleJWT (Autenticación Avanzada)
* MySQL

**Frontend:**
* React (Vite)
* Tailwind CSS (Diseño UI/UX Profesional y Responsivo)
* Lucide React (Librería de Iconos)
* JWT-Decode

---

## 🚦 Cómo Ejecutar el Proyecto en Local (Levantar Servidores)

### 1. Clonar el repositorio
```bash
git clone [https://github.com/jac0bzz/API-REST-GT.git](https://github.com/jac0bzz/API-REST-GT.git)
cd API-REST-GT