# Plan de Implementación: Plataforma AV-PSI

Este plan detalla los pasos atómicos y secuenciales para implementar la arquitectura full-stack de la plataforma web para Alejandra Valenzuela. La implementación se adhiere estrictamente a las reglas de `CONSTITUTION.md` y al `spec.md` aprobado.

---

### Fase 1: Configuración Inicial e Infraestructura Core

**Objetivo:** Establecer la estructura del proyecto backend, la conexión a la base de datos y las reglas estrictas de desarrollo.

1. **[x] Inicializar Backend (NestJS):**
   - [x] Crear el directorio `/backend`.
   - [x] Inicializar un nuevo proyecto NestJS.
   - [x] Configurar `tsconfig.json` para TypeScript estricto (`noImplicitAny`, `strictNullChecks`, etc.).
   - [x] Configurar ESLint y Prettier para garantizar cero errores de linting según la constitución.

2. **[x] Servicios Core (Cumplimiento de Constitución):**
   - [x] Implementar `LoggerService` para obligar el uso de la firma de logs requerida (`trx_trace_id`, `country`, `process_trace_id`).
   - [x] Implementar `SecretManagerService` para el acceso aislado a variables de entorno.
   - [x] Crear middlewares/interceptores globales para generar y propagar el `trx_trace_id` automáticamente en cada petición HTTP.

3. **[x] Configuración de Base de Datos y Prisma:**
   - [x] Inicializar Prisma ORM.
   - [x] Definir el esquema de la base de datos (Users, Patients, Appointments, Config).
   - [x] Aplicar migraciones a la base de datos PostgreSQL en Supabase.

---

### Fase 2: Seguridad y Autenticación

**Objetivo:** Implementar Supabase Auth, roles y la encriptación a nivel de aplicación (Application-Level Encryption) para la privacidad de los pacientes.

4. **[x] Módulo de Autenticación:**
   - [x] Integrar la verificación de JWT de Supabase utilizando estrategias de Passport en NestJS.
   - [x] Implementar `RolesGuard` para proteger estrictamente los endpoints de `/admin`.

5. **[x] Módulo de Encriptación:**
   - [x] Implementar un `CryptoService` genérico usando `crypto` de Node.js (AES-256-GCM) combinado con el `SecretManagerService` para gestionar la llave maestra.
   - [x] Inyectar este servicio en los servicios de dominio para encriptar/desencriptar datos sensibles (RUT, teléfonos, notas) antes de que Prisma los guarde o recupere de la BD.

---

### Fase 3: Módulos de Negocio Core (Backend)

**Objetivo:** Implementar la API REST para citas y fichas clínicas siguiendo el patrón de Puertos y Adaptadores.

6. **[x] Módulo de Configuración y Disponibilidad:**
   - [x] CRUD para los bloques de disponibilidad de la psicóloga (días, bloques de 45 min, modalidad online/presencial).

7. **[x] Módulo de Pacientes y Fichas Clínicas:**
   - [x] Endpoints para crear y gestionar pacientes (Nombre, RUT, Fecha de Nac., Teléfono, estado activo/inactivo).
   - [x] Endpoints para gestionar las notas privadas encriptadas.
   - [x] Endpoints para el historial médico (lista de citas por paciente).

8. **[x] Módulo de Citas (Appointments):**
   - [x] Lógica de negocio para calcular los bloques de 45 minutos disponibles considerando las reservas existentes y la regla de 24 horas mínimas de anticipación.
   - [x] Endpoints para el paciente: agendar, cancelar y reprogramar.
   - [x] Endpoints para el administrador: ver, cancelar y editar todas las citas.

---

### Fase 4: Integraciones (Correos y CRON)

**Objetivo:** Implementar el adaptador externo para Resend y el webhook para `pg_cron` de Supabase.

9. **[x] Adaptador de Correo (Resend):**
   - [x] Implementar la interfaz interna `IEmailPort`.
   - [x] Crear un `ResendEmailAdapter` que implemente el puerto para enviar confirmaciones y mensajes del formulario de contacto.

10. **[x] Webhook de Recordatorios (pg_cron):**
    - [x] Crear un endpoint seguro en el backend (ej. `/webhooks/reminders`) que Supabase `pg_cron` pueda llamar de manera diaria/horaria.
    - [x] Este endpoint consultará las citas que comiencen en exactamente 24 horas y despachará los correos de recordatorio mediante el Adaptador de Correo.

---

### Fase 5: Integración del Frontend

**Objetivo:** Conectar la webapp existente (React/Vite) al backend y construir las vistas de administración.

11. **[x] Configuración de Auth y API en el Frontend:**
    - [x] Configurar Supabase Auth UI en la aplicación React (Google + Magic Links).
    - [x] Configurar instancias de Axios/Fetch con inyección automática del token Bearer.
    - [x] Configurar clientes de React Query.

12. **[/] Integración de Vistas Públicas:**
    - [ ] Conectar el componente del Calendario al endpoint real de disponibilidad del backend.
    - [ ] Conectar el flujo de agendamiento de citas.
    - [x] Arreglar enlaces internos de la landing page.

13. **[/] Vistas del Panel de Administración (`/admin`):**
    - [x] Implementar rutas protegidas para `/admin`.
    - [x] Construir el Dashboard de Métricas (UI base lista).
    - [ ] Construir las vistas y funcionalidad de Gestión de Pacientes y Fichas Clínicas (con notas privadas).
    - [ ] Construir el calendario/lista de Gestión de Citas para la psicóloga.
    - [ ] Construir la gestión de Configuraciones de Disponibilidad.

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar `npm run test` para pruebas unitarias que cubran la lógica de dominio (especialmente el cálculo de disponibilidad y la encriptación).
- Ejecutar `npm run lint` y `npm run build` para garantizar cero errores en modo estricto antes de cualquier commit.

### Verificación Manual
- Desplegar servidores de desarrollo locales (`webapp` y `backend`).
- Completar un flujo de usuario: Iniciar sesión vía Magic Link -> Agendar una cita (validar regla de 24 hrs) -> Revisar correo de confirmación.
- Completar un flujo de administrador: Iniciar sesión como Admin -> Ver Ficha Clínica -> Agregar una nota privada -> Verificar que la nota está encriptada en la base de datos pero legible en la interfaz de usuario.
