# SADYA: Seguridad Alimentaria con Dios y Amor

Plataforma web de la fundación SADYA para prevenir la pérdida de alimentos: conecta campesinos, tiendas, domiciliarios, fundaciones y clientes para vender con descuento los productos próximos a vencer y donar los excedentes.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/` | Frontend en React 19 + Vite + Tailwind |
| `backend/` | API en Node.js (Express 5) + PostgreSQL |
| `database/` | `Creacion DB.sql` crea todas las tablas y los catálogos (roles y estados). `Insercion y prubas de la BD.sql` es un script antiguo de pruebas y no coincide con el esquema actual. `EDR SADYA.pgerd` es el diagrama de pgAdmin |

## Cómo correrlo en local

Necesitas Node.js 20 o superior y PostgreSQL.

1. Crea una base de datos vacía y ejecuta `database/Creacion DB.sql` (sirve igual en Neon, desde su SQL Editor).
2. Backend:
   ```bash
   cd backend
   cp .env.example .env   # y completa DATABASE_URL y demás variables
   npm install
   npm run dev            # http://localhost:3001
   ```
3. Frontend, en otra terminal desde la raíz:
   ```bash
   npm install
   npm run dev            # http://localhost:5185
   ```

El archivo `backend/.env` nunca se sube al repositorio.
