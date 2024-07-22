-- Active: 1721670178710@@127.0.0.1@3306@perlopzajobs
CREATE TABLE `user`(  
	`id` int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
	`kind` ENUM('admin', 'user') COMMENT 'Tipo de Usuario',
	`area` int COMMENT 'Area o departamento user',
	`permission` VARCHAR(64) COMMENT 'Permisos que puede hacer el usuario',
	`canaccess` BOOLEAN COMMENT 'Puede acceder al programa',
	`uname` VARCHAR(32) COMMENT 'User name para login',
	`pass` VARCHAR(64) COMMENT 'Contraseña SHA-256 para login',
	`name` VARCHAR(64) COMMENT 'Nombre real usuario',
	`last_name` VARCHAR(64) COMMENT 'Apellidos reales usuario',
	`CURP` VARCHAR(32) COMMENT 'Curp del usuario',
	`RFC` VARCHAR(32) COMMENT 'RFC del usuario',
	`NSS` VARCHAR(32) COMMENT 'Numero de seguro social del usuario',
	`Beneficiary` VARCHAR(128) COMMENT 'Nombre del beneficiario',
	`start_op` DATE COMMENT 'Fecha de inicio de operaciones',
	`CheckIn` TIME COMMENT 'Hora de entrada',
	`CheckOut` TIME COMMENT 'Hora de salida',
	`Salary` VARCHAR(64) COMMENT 'Salario y plazos',
	`email` VARCHAR(128) COMMENT 'Correo de contacto',
	`phone` VARCHAR(16) COMMENT 'Telefono contacto',
	`Last_Updated` DATETIME COMMENT 'Ultima fecha modificación.',
	`Last_Editor` INT COMMENT 'Usuario que edito'
) COMMENT 'Tabla de Usuarios';