# Contact Manager - Prueba Técnica

Una aplicación web completa para gestionar contactos construida con **Next.js**, **TypeScript**, **Prisma ORM**, y **MySQL**. La aplicación está completamente dockerizada para facilitar su despliegue.

## 🚀 Características

- ✅ **CRUD completo** de contactos (Crear, Leer, Actualizar, Eliminar)
- ✅ **Interfaz moderna** con Tailwind CSS y componentes interactivos
- ✅ **Base de datos** MySQL con Prisma ORM
- ✅ **Validaciones** tanto en frontend como backend con Zod
- ✅ **Búsqueda** de contactos en tiempo real
- ✅ **Responsive Design** para móviles y desktop
- ✅ **Dockerizado** para fácil despliegue
- ✅ **TypeScript** para mayor seguridad de tipos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MySQL 8.0
- **ORM**: Prisma
- **Containerización**: Docker + Docker Compose
- **Iconos**: Lucide React
- **Validaciones**: Zod

## 📋 Prerequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (solo para desarrollo local)

## 🚀 Instrucción para Ejecutar el Proyecto (1 comando)

Para correr todo el proyecto con **un solo comando**, ejecuta:

```bash
docker-compose up --build
```

Este comando:
1. Construye la imagen de la aplicación Next.js
2. Levanta la base de datos MySQL
3. Ejecuta las migraciones de Prisma
4. Inicia la aplicación en http://localhost:3000

### Comando de Limpieza (Opcional)

Si quieres limpiar todo y empezar de nuevo:

```bash
docker-compose down -v && docker-compose up --build
```

## 🏗️ Estructura del Proyecto

```
front-contact-manager/
├── app/                      # App Router de Next.js
│   ├── api/contacts/         # API Routes para CRUD
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
├── components/              # Componentes React
│   ├── ContactCard.tsx      # Tarjeta de contacto
│   ├── ContactForm.tsx      # Formulario de contacto
│   ├── ConfirmDialog.tsx    # Modal de confirmación
│   └── UIStates.tsx         # Estados de carga y vacío
├── lib/                     # Utilidades y configuración
│   └── prisma.ts           # Cliente de Prisma
├── prisma/                  # Configuración de base de datos
│   └── schema.prisma       # Esquema de la base de datos
├── types/                   # Tipos TypeScript
│   └── contact.ts          # Tipos de contactos
├── Dockerfile               # Configuración Docker
├── docker-compose.yml      # Orquestación de servicios
└── README.md               # Esta documentación
```

## 💾 Modelo de Datos

### Contact (Contacto)

```typescript
{
  id: number         // ID único autogenerado
  firstName: string  // Nombre (requerido)
  lastName: string   // Apellido (requerido)  
  email: string      // Email único (requerido)
  phone?: string     // Teléfono (opcional)
  address?: string   // Dirección (opcional)
  createdAt: Date    // Fecha de creación
  updatedAt: Date    // Fecha de última actualización
}
```

## 🔗 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/contacts` | Obtener todos los contactos |
| `POST` | `/api/contacts` | Crear nuevo contacto |
| `GET` | `/api/contacts/[id]` | Obtener contacto por ID |
| `PUT` | `/api/contacts/[id]` | Actualizar contacto |
| `DELETE` | `/api/contacts/[id]` | Eliminar contacto |

### Ejemplos de uso:

**Crear contacto:**
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez", 
    "email": "juan@email.com",
    "phone": "+56912345678",
    "address": "Santiago, Chile"
  }'
```

**Obtener todos los contactos:**
```bash
curl http://localhost:3000/api/contacts
```

## 🧪 Desarrollo Local (Sin Docker)

Si prefieres desarrollar sin Docker:

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar base de datos MySQL local:**
```bash
# Actualizar .env con tu configuración local
DATABASE_URL="mysql://usuario:password@localhost:3306/contact_manager"
```

3. **Ejecutar migraciones:**
```bash
npx prisma db push
npx prisma generate
```

4. **Iniciar en modo desarrollo:**
```bash
npm run dev
```

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de la aplicación
docker-compose logs app

# Ver logs de la base de datos  
docker-compose logs db

# Ejecutar comandos en el contenedor de la app
docker-compose exec app sh

# Reiniciar solo la aplicación
docker-compose restart app

# Parar todo
docker-compose down

# Parar y eliminar volúmenes (limpia la BD)
docker-compose down -v
```

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a MySQL | `mysql://user:pass@host:3306/db` |
| `NEXTAUTH_SECRET` | Clave secreta para sesiones | `tu-clave-secreta` |
| `NEXTAUTH_URL` | URL base de la aplicación | `http://localhost:3000` |

## 🐛 Solución de Problemas

### Error de conexión a la base de datos:
- Verifica que MySQL esté ejecutándose: `docker-compose ps`
- Revisa los logs: `docker-compose logs db`

### La aplicación no carga:
- Verifica que el puerto 3000 esté libre
- Revisa los logs: `docker-compose logs app`

### Problemas con Prisma:
```bash
# Regenerar cliente de Prisma
docker-compose exec app npx prisma generate

# Reiniciar migraciones
docker-compose exec app npx prisma db push --force-reset
```

## 📝 Funcionalidades Implementadas

### ✅ CRUD Completo
- [x] **Crear** contactos con validación
- [x] **Listar** todos los contactos  
- [x] **Buscar** contactos por nombre, email o teléfono
- [x] **Editar** contactos existentes
- [x] **Eliminar** con confirmación

### ✅ Validaciones
- [x] Validación de email único
- [x] Campos requeridos (nombre, apellido, email)
- [x] Validación de formato de email
- [x] Mensajes de error descriptivos

### ✅ Experiencia de Usuario  
- [x] Interfaz responsive (móvil/desktop)
- [x] Estados de carga
- [x] Confirmación antes de eliminar
- [x] Búsqueda en tiempo real
- [x] Contadores de resultados

### ✅ Técnico
- [x] TypeScript en todo el proyecto
- [x] Manejo de errores robusto  
- [x] API RESTful bien estructurada
- [x] Dockerización completa
- [x] Documentación completa

## 👨‍💻 Autor

Desarrollado como prueba técnica para demostrar habilidades en desarrollo full-stack con Next.js y tecnologías modernas.

## 📄 Licencia

Este proyecto es de uso libre para fines de evaluación técnica.
