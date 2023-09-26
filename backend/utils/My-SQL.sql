# Eliminacion de Tablas
DROP TABLE IF EXISTS ProyectoXGrupoProyecto;
DROP TABLE IF EXISTS GrupoProyecto;
DROP TABLE IF EXISTS Proyecto;

-- -----------------------------------------------------
-- CREACION DE TABLAS
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table IngresoTipo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS IngresoTipo (
  idIngresoTipo INT AUTO_INCREMENT,
  descripcion VARCHAR(200) NULL,
  activo TINYINT NULL,
  PRIMARY KEY (idIngresoTipo))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table TransaccionTipo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TransaccionTipo (
  idTransaccionTipo INT AUTO_INCREMENT,
  descripcion VARCHAR(200) NULL,
  activo TINYINT NULL,
  PRIMARY KEY (idTransaccionTipo))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table LineaIngreso
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS LineaIngreso (
  idLineaIngreso INT AUTO_INCREMENT,
  monto DOUBLE NULL,
  descripcion VARCHAR(200) NULL,
  activo TINYINT NULL,
  cantidad INT NULL,
  fechaTransaccion DATE NULL,
  TransaccionTipo_idTransaccionTipo INT NOT NULL,
  IngresoTipo_idIngresoTipo INT NOT NULL,
  PRIMARY KEY (idLineaIngreso),
  INDEX fk_LineaIngreso_TransaccionTipo_idx (TransaccionTipo_idTransaccionTipo ASC) VISIBLE,
  INDEX fk_LineaIngreso_IngresoTipo1_idx (IngresoTipo_idIngresoTipo ASC) VISIBLE,
  CONSTRAINT fk_LineaIngreso_TransaccionTipo
    FOREIGN KEY (TransaccionTipo_idTransaccionTipo)
    REFERENCES dbdibujitos.TransaccionTipo (idTransaccionTipo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_LineaIngreso_IngresoTipo1
    FOREIGN KEY (IngresoTipo_idIngresoTipo)
    REFERENCES dbdibujitos.IngresoTipo (idIngresoTipo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Privilegios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Privilegios (
  idPrivilegios INT AUTO_INCREMENT,
  nombrePrivilegio VARCHAR(200) NULL,
  descripcionPrivilegio VARCHAR(200) NULL,
  activo TINYINT NULL,
  PRIMARY KEY (idPrivilegios))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT AUTO_INCREMENT,
  nombres VARCHAR(200) NULL,
  apellidos VARCHAR(200) NULL,
  fechaNacimiento DATE NULL,
  correoElectronico VARCHAR(200) NULL,
  telefono VARCHAR(10) NULL,
  usuario VARCHAR(200) NULL,
  password VARCHAR(200) NULL,
  activo TINYINT NULL,
  Privilegios_idPrivilegios INT NOT NULL,
  PRIMARY KEY (idUsuario),
  INDEX fk_Usuario_Privilegios1_idx (Privilegios_idPrivilegios ASC) VISIBLE,
  CONSTRAINT fk_Usuario_Privilegios1
    FOREIGN KEY (Privilegios_idPrivilegios)
    REFERENCES dbdibujitos.Privilegios (idPrivilegios)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Grupo Proyecto
-- -----------------------------------------------------
CREATE TABLE GrupoProyecto (
    idGrupoProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    activo tinyint NOT NULL
);

-- -----------------------------------------------------
-- Proyecto
-- -----------------------------------------------------
CREATE TABLE Proyecto(
	idProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    maxCantParticipantes INT DEFAULT 8,
    fechaInicio DATE,
    fechaFin DATE,
    fechaUltimaModificacion DATE ,
    activo tinyint NOT NULL
);

--------------------------------------------------------
-- Tabla intermedia
--------------------------------------------------------

CREATE TABLE ProyectoXGrupoProyecto(
    idGrupoProyecto INT,
    idProyecto INT,
    PRIMARY KEY (idGrupoProyecto, idProyecto),
    FOREIGN KEY (idGrupoProyecto) REFERENCES GrupoProyecto(idGrupoProyecto),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
);

-- -----------------------------------------------------
-- PROCEDURES
-- -----------------------------------------------------

/*Registrar*/
DELIMITER $
CREATE PROCEDURE REGISTRAR(
	OUT _idUsuario INT,
    IN _nombres VARCHAR(200),
    IN _apellidos VARCHAR(200),
    IN _correoElectronico VARCHAR(200),
    IN _password VARCHAR(200)
)
BEGIN
	INSERT INTO Usuario(nombres,apellidos,correoElectronico,password,activo,Privilegios_idPrivilegios) VALUES(_nombres, _apellidos, _correoElectronico, _password, true, 1);
    SET _idUsuario =  @@last_insert_id;
END$

/*LOGIN*/
DELIMITER $
CREATE PROCEDURE LOGIN(
    IN _correoElectronico VARCHAR(200),
    IN _password VARCHAR(200)
)
BEGIN
  DECLARE usuarioExiste INT;
  SELECT COUNT(*) INTO usuarioExiste
  FROM Usuario
  WHERE correoElectronico = _correoElectronico AND password = _password;
  -- Devolver un valor para indicar el resultado de la autenticación
  IF usuarioExiste > 0 THEN
    SELECT 1 AS 'Autenticado'; -- Usuario autenticado
  ELSE
    SELECT 0 AS 'Autenticado'; -- Usuario no autenticado
  END IF;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_PROYECTO(
	OUT _id_proyecto INT,
	IN _nombre VARCHAR(200),
    IN _maxCantParticipantes INT,
    IN _fechaInicio DATE,
    IN _fechaFin DATE,
    IN _fechaUltimaModificacion DATE
)
BEGIN
	INSERT INTO Proyecto(nombre,maxCantParticipantes,fechaInicio,fechaFin,fechaUltimaModificacion) VALUES(_nombre,_maxCantParticipantes,_fechaInicio,_fechaFin,_fechaUltimaModificacion,1);
    SET _id_proyecto = @@last_insert_id;
END$
