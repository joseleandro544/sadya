-- ============================================================================
-- PROYECTO SADYA (Seguridad Alimentaria con Dios y Amor)
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - POSTGRESQL
-- Versión alineada con el backend (noviembre 2026). Ejecutar en una base vacía
-- (por ejemplo en el SQL Editor de Neon). Incluye los catálogos de roles y estados.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MÓDULO DE USUARIOS Y ROLES
-- ----------------------------------------------------------------------------

CREATE TABLE t_roles (
	id_rol SERIAL PRIMARY KEY,
	tipo_rol VARCHAR(50) NOT NULL -- Ej: Productor, Tendero, Domiciliario, Cliente, Admin
);

CREATE TABLE t_usuarios (
	id_usuario SERIAL PRIMARY KEY,
	id_rol INT NOT NULL,
	nombres VARCHAR(150) NOT NULL,
	apellidos VARCHAR(150),
	email VARCHAR(100) UNIQUE,
	password VARCHAR(255),
	id_social VARCHAR(255), -- El ID que manda Google/Apple
	telefono VARCHAR(20),
	metodo_registro VARCHAR(50) DEFAULT 'Local', -- Ej: Google, Apple, Celular
	numero_identidad VARCHAR(50),
	fecha_nacimiento DATE,
	genero VARCHAR(20),
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	-- Campos de Seguridad y Notificaciones
	foto_perfil TEXT,
	fcm_token VARCHAR(255), -- Para Notificaciones Push
	token_recuperacion VARCHAR(255), -- Para recuperar la contraseña
	fecha_expiracion_token TIMESTAMP
);

CREATE TABLE t_datos_tienda (
	id_tienda SERIAL PRIMARY KEY,
	id_usuario INT UNIQUE NOT NULL,
	nombre_establecimiento VARCHAR(150) NOT NULL,
	direccion_local VARCHAR(255),
	banco VARCHAR(100), -- Ej: Bancolombia, Nequi, Daviplata
	numero_cuenta VARCHAR(50),
	tipo_cuenta VARCHAR(50), -- Ahorros, Corriente
	tiene_domicilio_propio BOOLEAN DEFAULT FALSE,
	nit VARCHAR(50) NOT NULL
);

CREATE TABLE t_datos_domiciliario (
	id_domiciliario SERIAL PRIMARY KEY,
	id_usuario INT UNIQUE NOT NULL,
	direccion_residencia VARCHAR(255),
	banco VARCHAR(100), 
	numero_cuenta VARCHAR(50),
	tipo_cuenta VARCHAR(50),
	tipo_repartidor VARCHAR(50), -- Ej: 'Moto/Bici (Local)', 'Camion (Mayorista)'
	foto_cedula_url VARCHAR(255),
	foto_rostro_url VARCHAR(255),
	estado_verificacion VARCHAR(50) DEFAULT 'Pendiente', -- Estados sugeridos: Pendiente, Aprobado, Rechazado
	no_documento VARCHAR(50) NOT NULL
);

CREATE TABLE t_datos_fundacion (
	id_fundacion SERIAL PRIMARY KEY,
	id_usuario INT UNIQUE NOT NULL,
	nombre_fundacion VARCHAR(150) NOT NULL,
	tiene_transporte_propio BOOLEAN DEFAULT FALSE, -- Resuelve la pregunta del formulario
	CONSTRAINT fk_fundacion_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuarios(id_usuario) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 2. MÓDULO DE UBICACIONES
-- ----------------------------------------------------------------------------

CREATE TABLE t_ubicaciones (
	id_ubicacion SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL,
	direccion VARCHAR(255) NOT NULL,
	ciudad VARCHAR(100) NOT NULL,
	departamento VARCHAR(100) NOT NULL,
	latitud NUMERIC(10, 8),
	longitud NUMERIC(11, 8),
	es_principal BOOLEAN DEFAULT FALSE,
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. MÓDULO DE PRODUCTOS Y ESTADOS
-- ----------------------------------------------------------------------------

CREATE TABLE t_estados_producto (
	id_estado SERIAL PRIMARY KEY,
	nombre_estado VARCHAR(50) NOT NULL -- Ej: Inventario, Vendido, Vencido, Donado, Perdido
);

CREATE TABLE t_productos (
	id_producto SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL, -- Creador del producto (Productor o Tienda)
	id_estado INT NOT NULL,
	categoria VARCHAR(50) NOT NULL,
	nombre_producto VARCHAR(150) NOT NULL,
	costo_original NUMERIC (12, 2) NOT NULL,
	costo_con_descuento NUMERIC(12, 2),
	cantidad_disponible INT NOT NULL,
	fecha_vencimiento DATE NOT NULL,
	fecha_fin_promocion TIMESTAMP, -- Control temporal de rebajas y alertas
	descripcion TEXT,
	imagen_url TEXT, -- URL o imagen en base64 (temporal)
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. MÓDULO DE CARRITO DE COMPRAS (NUEVO)
-- ----------------------------------------------------------------------------

CREATE TABLE t_carrito (
	id_carrito SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL,
	estado_carrito VARCHAR(50) DEFAULT 'Activo', -- Ej: Activo, Abandonado, Procesado
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_detalle_carrito (
	id_detalle_carrito SERIAL PRIMARY KEY,
	id_carrito INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad INT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. MÓDULO DE PEDIDOS Y VENTAS
-- ----------------------------------------------------------------------------

CREATE TABLE t_pedidos (
	id_pedido SERIAL PRIMARY KEY,
	id_cliente INT NOT NULL,
	id_domiciliario INT, -- Puede ser NULL hasta que un domiciliario lo acepte
	id_ubicacion_entrega INT NOT NULL,
	fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	estado_pedido VARCHAR(50) NOT NULL, -- Ej: Pendiente, En Camino, Entregado, Cancelado
	tipo_entrega VARCHAR(50) DEFAULT 'Domicilio',
	total_costo NUMERIC(12, 2) NOT NULL
);

CREATE TABLE t_detalle_pedido (
	id_detalle_pedido SERIAL PRIMARY KEY,
	id_pedido INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad INT NOT NULL,
	precio_unidad NUMERIC(12, 2) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. MÓDULO DE PAGOS
-- ----------------------------------------------------------------------------

CREATE TABLE t_pagos (
	id_pago SERIAL PRIMARY KEY,
	id_pedido INT NOT NULL,
	monto NUMERIC(12, 2) NOT NULL,
	metodo_pago VARCHAR(50) NOT NULL, -- Ej: Efectivo, Tarjeta, Wompi, Bold
	estado_pago VARCHAR(50) NOT NULL, -- Ej: Pendiente, Aprobado, Rechazado
	transaccion_id VARCHAR(150),
	fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. MÓDULO DE DONACIONES (LEY 2380)
-- ----------------------------------------------------------------------------

CREATE TABLE t_donaciones (
	id_donacion SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	cantidad INT NOT NULL,
	precio_unidad NUMERIC(12, 2), -- Valor referencial para la deduccion
	precio_total NUMERIC(12, 2), -- Total tasado de la donacion
	url_certificado VARCHAR(255),-- Ruta o link al pdf generado por ley 2380
	fecha_emicion_certificado TIMESTAMP,
	estado_certificado VARCHAR(50) DEFAULT 'Pendiente', -- Ej: Pediente, Emitido
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. MÓDULO DE ANALÍTICA PREDICTIVA Y SIPSA (NUEVO)
-- ----------------------------------------------------------------------------

CREATE TABLE t_precios_sipsa (
    id_precio_sipsa SERIAL PRIMARY KEY,
    nombre_producto_sipsa VARCHAR(150) NOT NULL,
    precio_promedio NUMERIC(12, 2) NOT NULL,
    ciudad_mercado VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL -- Fecha del lote de datos oficial (DANE)
);

-- ============================================================================
-- CREACIÓN DE LLAVES FORÁNEAS (FOREIGN KEYS)
-- ============================================================================

-- Modulo Usuarios
ALTER TABLE t_usuarios ADD CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES t_roles(id_rol);

ALTER TABLE t_datos_tienda ADD CONSTRAINT fk_tienda_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuarios(id_usuario) 
ON DELETE CASCADE;

ALTER TABLE t_datos_domiciliario ADD CONSTRAINT fk_domiciliario_usuario FOREIGN KEY (id_usuario) 
REFERENCES t_usuarios(id_usuario) ON DELETE CASCADE;

-- Modulo Ubicaciones
ALTER TABLE t_ubicaciones ADD CONSTRAINT fk_ubicaciones_usuario FOREIGN KEY (id_usuario) 
REFERENCES t_usuarios(id_usuario) ON DELETE CASCADE;

-- Modulo Productos
ALTER TABLE t_productos ADD CONSTRAINT fk_productos_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuarios(id_usuario);

ALTER TABLE t_productos ADD CONSTRAINT fk_productos_estado FOREIGN KEY (id_estado) 
REFERENCES t_estados_producto(id_estado);

-- Modulo Carrito (Nuevo)
ALTER TABLE t_carrito ADD CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES t_usuarios(id_usuario) 
ON DELETE CASCADE;

ALTER TABLE t_detalle_carrito ADD CONSTRAINT fk_detalle_carrito_padre FOREIGN KEY (id_carrito) 
REFERENCES t_carrito(id_carrito) ON DELETE CASCADE;

ALTER TABLE t_detalle_carrito ADD CONSTRAINT fk_detalle_carrito_producto FOREIGN KEY (id_producto) 
REFERENCES t_productos(id_producto);

-- Modulo Pedidos
ALTER TABLE t_pedidos ADD CONSTRAINT fk_pedidos_domiciliario FOREIGN KEY (id_domiciliario) 
REFERENCES t_usuarios(id_usuario);

ALTER TABLE t_pedidos ADD CONSTRAINT fk_pedidos_ubicacion FOREIGN KEY (id_ubicacion_entrega) 
REFERENCES t_ubicaciones(id_ubicacion);

ALTER TABLE t_detalle_pedido ADD CONSTRAINT fk_detalle_pedido_padre FOREIGN KEY (id_pedido) 
REFERENCES t_pedidos(id_pedido) ON DELETE CASCADE;

ALTER TABLE t_detalle_pedido ADD CONSTRAINT fk_detalle_pedido_producto FOREIGN KEY (id_producto) 
REFERENCES t_productos(id_producto);

-- Modulo Pagos
ALTER TABLE t_pagos ADD CONSTRAINT fk_pagos_pedido FOREIGN KEY (id_pedido) REFERENCES t_pedidos(id_pedido);

-- Modulo Donaciones
ALTER TABLE t_donaciones ADD CONSTRAINT fk_donaciones_producto FOREIGN KEY (id_producto) 
REFERENCES t_productos(id_producto);

-- ============================================================================
-- INMUTABILIDAD DE DATOS HISTORICOS
-- ============================================================================

-- VISTAS
-- Se crea una vista que filtra automaticamente lo que esta disponible
CREATE VIEW v_productos_catalogo AS 
SELECT p.* 
FROM t_productos p
JOIN t_estados_producto e ON e.id_estado = p.id_estado
WHERE e.nombre_estado = 'Inventario' AND p.fecha_vencimiento >= CURRENT_DATE;

-- FUNCTIONS y TRIGGERS
-- Paso A: Se crea la funcion del guardian de seguridad
CREATE OR REPLACE FUNCTION bloquear_edicion_historico()
RETURNS TRIGGER AS $$
DECLARE
	estado_actual VARCHAR;
BEGIN
	-- Verificamos cual es el esatdo actual del producto en la BD antes de que lo modifiquen
	SELECT nombre_estado INTO estado_actual
	FROM t_estados_producto
	WHERE id_estado = OLD.id_estado;

	-- Si el producto ya paso a la historia, cancelamos la actualizacion
	IF estado_actual IN ('Vencido', 'Donado', 'Vendido', 'Descartado') THEN
		RAISE EXCEPTION 'Seguridad DB: Operación denegada. Este producto ya es un 
		dato historico (%) y no puede ser alterado.', estado_actual;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Paso B: Activamos el TRIGGER (Gatillo) para qeu vigile la tabla t_productos
CREATE TRIGGER trg_proteger_historico
BEFORE UPDATE ON t_productos
FOR EACH ROW
EXECUTE FUNCTION bloquear_edicion_historico();

-- ============================================================================
-- CATÁLOGOS INICIALES (los ID son los que usa el backend)
-- ============================================================================

-- Roles: el backend los busca por nombre. 'Cliente' debe ser el id 3
-- porque es el valor por defecto del registro con Google/Apple.
INSERT INTO t_roles (id_rol, tipo_rol) VALUES
	(1, 'Campesino'),
	(2, 'Tienda'),
	(3, 'Cliente'),
	(4, 'Domiciliario'),
	(5, 'Fundación'),
	(6, 'Administrador'),
	(7, 'Transportador');
SELECT setval('t_roles_id_rol_seq', (SELECT MAX(id_rol) FROM t_roles));

-- Estados de producto: el backend usa estos ID directamente.
-- 1, 4 y 6 aparecen en el catálogo; 3 = donado; 5 = descartado.
INSERT INTO t_estados_producto (id_estado, nombre_estado) VALUES
	(1, 'Inventario'),
	(2, 'Vendido'),
	(3, 'Donado'),
	(4, 'En promoción'),
	(5, 'Descartado'),
	(6, 'Próximo a vencer'),
	(7, 'Vencido');
SELECT setval('t_estados_producto_id_estado_seq', (SELECT MAX(id_estado) FROM t_estados_producto));
