# Especificación de Requerimientos y Blueprint Técnico (Final)

## 1. Visión General
El proyecto es una aplicación web para la psicóloga Alejandra Valenzuela. Permite a los pacientes agendar citas (presenciales u online), iniciar sesión y contactar a la profesional. Incluye un panel de administración para la gestión de citas, pacientes y configuración del sitio.

## 2. Historias de Usuario y Criterios de Aceptación

### 2.1 Agendamiento de Citas (Pacientes)
**Historia de Usuario:** Como paciente, quiero poder ver un calendario con los horarios disponibles para poder agendar una cita.
**Criterios de Aceptación:**
- El sistema debe mostrar un calendario interactivo.
- Se debe distinguir visualmente los horarios disponibles de los ocupados.
- Se debe distinguir claramente si el bloque horario es para atención presencial u online.
- **La duración de cada cita/sesión será de 45 minutos.**
- **Se requerirá un mínimo de 24 horas de anticipación para poder agendar una cita.**
- El usuario debe poder seleccionar una fecha y hora disponible para confirmar su cita.
- *Nota:* El pago se realiza fuera del sistema (no hay pasarela de pago online integrada).

### 2.2 Autenticación de Usuarios
**Historia de Usuario:** Como paciente, quiero poder iniciar sesión con mi cuenta de Google o correo electrónico para gestionar mis citas.
**Criterios de Aceptación:**
- Integración de inicio de sesión con Google (OAuth).
- Opción de inicio de sesión "Magic Link" (enlace al correo, sin contraseñas).
- Solo los usuarios autenticados pueden confirmar una cita.

### 2.3 Notificaciones y Recordatorios
**Historia de Usuario:** Como paciente, quiero recibir confirmaciones y recordatorios de mis citas en mi correo electrónico para no olvidarlas.
**Criterios de Aceptación:**
- Envío automático de correo al confirmar una cita.
- Envío automático de correo de recordatorio 24 horas antes de la cita.
- Los correos deben incluir detalles de la cita (fecha, hora, modalidad y link si es online).

### 2.4 Gestión de Citas (Pacientes)
**Historia de Usuario:** Como paciente, quiero poder cancelar o reprogramar mi cita en caso de un imprevisto.
**Criterios de Aceptación:**
- El paciente puede cancelar una cita desde su perfil.
- El paciente puede reprogramar seleccionando un nuevo horario disponible.
- Se deben enviar notificaciones por correo de la cancelación/reprogramación.

### 2.5 Panel de Administración (Dashboard y Citas)
**Historia de Usuario:** Como administrador, quiero visualizar métricas de uso y gestionar todas las citas y la configuración de disponibilidad en la misma plataforma web.
**Criterios de Aceptación:**
- El panel vivirá en la misma aplicación bajo la ruta privada `/admin`.
- El administrador debe tener un dashboard con métricas clave (ej. número de citas, visitas).
- El administrador puede ver una lista de todas las citas (pasadas y futuras).
- El administrador puede cancelar, editar o reprogramar cualquier cita.
- El administrador puede configurar bloques de horarios de atención (días, horas) indicando si son online o presenciales.
- El administrador puede actualizar la información de contacto (correo, teléfono).

### 2.6 Ficha Clínica de Pacientes (Administrador)
**Historia de Usuario:** Como administrador, quiero mantener una ficha clínica encriptada de cada paciente para llevar un registro seguro de sus datos y mi atención.
**Criterios de Aceptación:**
- La ficha debe contener: Nombre, Apellido, RUT, Fecha de Nacimiento, Correo y Teléfono.
- Debe existir un campo para "notas y observaciones" generales del paciente (confidencial).
- Los pacientes tendrán un estado ("Activo" o "Inactivo"). Por defecto es "Activo".

### 2.7 Historial Médico por Paciente (Administrador)
**Historia de Usuario:** Como administrador, quiero ver el historial de citas asociadas a un paciente y poder agregar notas específicas por cita.
**Criterios de Aceptación:**
- Cada ficha de paciente mostrará su lista histórica de citas médicas agendadas.
- El administrador podrá agregar notas u observaciones a cada cita individualmente (solo visible para el admin).

### 2.8 Formulario de Contacto
**Historia de Usuario:** Como visitante del sitio, quiero poder enviar un mensaje a través de un formulario para realizar consultas generales.
**Criterios de Aceptación:**
- Formulario con campos: Nombre, Correo, Asunto y Mensaje.
- El mensaje se envía automáticamente al correo de la psicóloga.

## 3. Blueprint Técnico (Arquitectura Propuesta)

### 3.1 Frontend (Webapp)
- **Framework:** React + Vite
- **Estilos:** Tailwind CSS (basado en Material Design 3)
- **Estado/Fetching:** React Query
- **Autenticación:** Supabase Auth UI / SDK de Supabase (Google + Magic Links)

### 3.2 Backend (API Rest)
Basado en las reglas de arquitectura limpias definidas en `CONSTITUTION.md`:
- **Framework:** **NestJS** (Controladores, Servicios, DI, `class-validator`).
- **Lenguaje:** TypeScript (Estricto).
- **Autenticación y Autorización:** Guards de NestJS integrados con JWT de Supabase. Roles claros (`ADMIN`, `USER`).
- **Base de Datos:** **Supabase** (PostgreSQL).
- **ORM:** Prisma.

### 3.3 Seguridad y Encriptación de Fichas Clínicas
- **Application-Level Encryption:** Encriptación con algoritmos robustos (ej. AES-256-GCM) directamente en el backend (NestJS) antes de guardar en la BD. Campos protegidos: RUT, teléfono, notas de paciente, notas de cita.
- **Autorización Estricta (RLS / Guards):** Solo tokens JWT con rol de `ADMIN` podrán acceder a los endpoints de fichas clínicas.

### 3.4 Infraestructura de Notificaciones y Tareas (Colas)
- **Email Provider:** Resend.
- **Cola de Tareas (Task Queue):** Tareas programadas nativas de Supabase (`pg_cron`) llamando a Supabase Edge Functions (o webhooks al backend NestJS) para el envío del recordatorio de 24 hrs.

### 3.5 SEO y Optimización
- **SSR / SSG:** Optimización del `index.html` público con meta tags usando `react-helmet-async` y `sitemap.xml`.
- **Idioma y Región:** `lang="es-CL"` y contenido localizado.
