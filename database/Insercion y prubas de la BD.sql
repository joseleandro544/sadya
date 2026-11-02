-- ======= Prueba 1: Configuracion inicial (Crear el ecosistema) =======

-- 1. Insertar Roles en el sistema
INSERT INTO t_roles (tipo_rol) VALUES ('Productor'), ('Tendero'), ('Cliente'), ('Domiciliario'), ('Administrador');

-- 2. Registrar 3 usuarios con roles distintos
INSERT INTO t_usuarios (id_rol, nombre_completo, email, password) VALUES
(1, 'Carlos (Campesino)', 'carlos@finca.com', 'hash_pass_1'),
(2, 'María (Cliente)', 'maria@correo.com', 'hash_pass_2'),
(1, 'Pedro (Repartidor)', 'pedro@moto.com', 'hash_pass_3');

-- 3. Crear los esatdos de Producto básicos
INSERT INTO t_estados_producto (nombre_estado) VALUES ('Inventario'), ('Vandido'), ('Donado');

-- 4. Registrar la ubicacion del Cliente (A donde llegar el pedido)
INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal) VALUES
(2, 'Calle 10 # 5-20', 'Bogotá', 'Cundinamarca', TRUE);


-- ======= Prueba 2: Flujo del Productor/Tendero (CRUD de productos) =======

-- Crear el Producto (Solo el id_usuario = 1 lo crea)
INSERT INTO t_productos (id_usuario, id_estado, nombre_producto, costo_original, costo_con_descuento, cantidad_disponible, fecha_vencimiento, categoria)
VALUES (1, 1, 'Bulto de Papa Criolla', 45000, 5, '2026-06-30', 'Tubérculos'),
(1, 1, 'Canasta de Tomats', 30000, 10, '2026-06-15', 'Verduras');

-- Editar un producto (El productor baja el precio porque se acerca el vencimiento)
UPDATE t_productos SET costo_con_descuento = 18000 WHERE id_producto = 2;


-- ======= Prueba 3: Flujo de Cliente y Domiciliario (Compras y Aceptacion) =======

-- 1. El Cliente hace la compra (Se crea elñ pedido)
-- El id.domiciliario es NULL porque apenas lo esat pidiendo
INSERT INTO t_pedidos (id_cliente, id_domiciliario, id_ubicacion_entrega, estado_pedido, total_costo, tipo_entrega) VALUES
(2, NULL, 1, 'Buscando Repartidor', 18000, 'Domicilio');

-- (Se registra qué compro en el detalle)
INSERT INTO t_detalle_pedido (id_pedido, id_producto, cantidad, precio_unidad) VALUES (1, 2, 1, 18000);

-- 2. El Domiciliario acepta el viaje
-- El repartidor oprime aceptar en la app. La BD se actualiza y vincula al Domiciliario (Usuario 2)
UPDATE t_pedidos SET id_domiciliario = 3, estado_pedido = 'En camino' WHERE id_pedido = 1;


-- ======= Pruebas adicionales =======

-- 1. Prueba antibasura

-- Crear Datos de la moto de Pedro
INSERT INTO t_datos_domiciliario (id_usuario, no_documento, banco, numero_cuenta) 
VALUES (6, '123456789', 'Nequi', 3001234567);

-- Ahora, Pedro borra su cuenta de la App
DELETE FROM t_usuarios WHERE id_usuario = 6;

-- Al ejecutar el SELECT, se ve que la cuenta de Nequi de Pedro tambien se borro automaticamente, ahorrando memoria en el servidor.
SELECT * FROM t_datos_domiciliario;

-- 2. Prubas de seguridad de Laves Faraneas

-- Intentar crear un producto qeu el creador es el usuario 999 (No existe)
INSERT INTO t_productos (id_usuario, id_estado, nombre_producto, costo_original, cantidad_disponible, fecha_vencimiento, categoria)
VALUES (999, 1, 'Manzanas Fantasma', 1000, 1, '2026-12-31', 'Frutas');