# Eliminacion de Tablas
DROP TABLE IF EXISTS ProyectoXGrupoProyecto;
DROP TABLE IF EXISTS GrupoProyecto;
DROP TABLE IF EXISTS Proyecto;
DROP TABLE IF EXISTS Herramienta;
DROP TABLE IF EXISTS Cronograma;
DROP TABLE IF EXISTS EDT;
DROP TABLE IF EXISTS ComponenteEDT;
DROP TABLE IF EXISTS ComponenteCriterioDeAceptacion;
DROP TABLE IF EXISTS ActaConstitucion;
DROP TABLE IF EXISTS HitoAC;
DROP TABLE IF EXISTS InteresadoAC;
DROP TABLE IF EXISTS TipoDatoAC;
DROP TABLE IF EXISTS DetalleAC;
DROP TABLE IF EXISTS Presupuesto;
DROP TABLE IF EXISTS Ingreso;
DROP TABLE IF EXISTS Moneda;
DROP TABLE IF EXISTS Egreso;
DROP TABLE IF EXISTS EstimacionCosto;
DROP TABLE IF EXISTS LineaEgreso;
DROP TABLE IF EXISTS LineaEstimacionCosto;
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

CREATE TABLE Rol(
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol VARCHAR(255),
    descripcion VARCHAR(500),
    activo TINYINT
)
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Grupo Proyecto
-- -----------------------------------------------------
CREATE TABLE GrupoProyecto (
    idGrupoProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    activo tinyint NOT NULL
)
ENGINE = InnoDB;

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
)
ENGINE = InnoDB;

--------------------------------------------------------
-- Tabla intermedia
--------------------------------------------------------

CREATE TABLE ProyectoXGrupoProyecto(
    idGrupoProyecto INT,
    idProyecto INT,
    PRIMARY KEY (idGrupoProyecto, idProyecto),
    FOREIGN KEY (idGrupoProyecto) REFERENCES GrupoProyecto(idGrupoProyecto),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

CREATE TABLE UsuarioXProyecto(
    idUsuario INT,
    idProyecto INT,
    PRIMARY KEY (idUsuario, idProyecto),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

--------------------------------------------------------
-- Herramientas
--------------------------------------------------------

CREATE TABLE Herramienta(
	idHerramienta INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    nombre VARCHAR(200) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imageURL VARCHAR(400) NOT NULL,
    activo tinyint NOT NULL,
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

CREATE TABLE Cronograma(
	idCronograma INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    fechaInicio DATE,
    fechaFin DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;
------------
-- EDT
------------
CREATE TABLE EDT(
	idEDT INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    nombreEDT VARCHAR(255),
    descripcionEDT VARCHAR(255),
    idUsuarioCreacion INT,
    fechaCreacion DATE,
    hayResponsable TINYINT ,
    activo tinyint ,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;

CREATE TABLE ComponenteEDT(
	idComponente INT AUTO_INCREMENT PRIMARY KEY,
    idElementoPadre INT,
    idEDT INT,
    descripcion VARCHAR(255),
    codigo VARCHAR(255),
    nombreEntregable VARCHAR(255),
    observaciones VARCHAR(255),
    activo tinyint ,
    FOREIGN KEY (idElementoPadre) REFERENCES ComponenteEDT(idComponente),
    FOREIGN KEY (idEDT) REFERENCES EDT(idEDT)
)
ENGINE = InnoDB;

CREATE TABLE ComponenteCriterioDeAceptacion(
	idComponenteCriterioDeAceptacion INT PRIMARY KEY,
    idComponenteEDT INT,
    descripcion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idComponenteEDT) REFERENCES ComponenteEDT(idComponente)
)
ENGINE = InnoDB;

-----------------------
-- Acta de Constitucion
-----------------------
CREATE TABLE ActaConstitucion(
	idActa INT PRIMARY KEY,
    idHerramienta INT,
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;

CREATE TABLE HitoAC(
	idHito INT PRIMARY KEY,
    idActa INT,
    descripcion VARCHAR(255),
    fechaLimite DATE,
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

CREATE TABLE InteresadoAC(
	idInteresado INT PRIMARY KEY,
    idActa INT,
    nombre VARCHAR(255),
    cargo VARCHAR(255),
    organizacion DATE,
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

CREATE TABLE DetalleAC(
	idDetalle INT PRIMARY KEY,
    idActa INT,
    idTipoDatoAC INT,
    detalle VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa),
    FOREIGN KEY (idTipoDatoAC) REFERENCES TipoDatoAC(idTipoDato)
)
ENGINE = InnoDB;

CREATE TABLE TipoDatoAC(
	idTipoDato INT PRIMARY KEY,
    idActa INT,
    nombre VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

-----------------------
-- Presupuesto
-----------------------

CREATE TABLE Presupuesto(
	idPresupuesto INT PRIMARY KEY,
    idHerramienta INT,
    presupuestoInicial  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;

CREATE TABLE Ingreso(
	idIngreso INT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto)
)
ENGINE = InnoDB;

CREATE TABLE TransaccionTipo(
	idTransaccion INT PRIMARY KEY,
    descripcion VARCHAR(255),
    activo TINYINT
)
ENGINE = InnoDB;

CREATE TABLE Egreso(
	idEgreso INT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto)
)
ENGINE = InnoDB;

CREATE TABLE LineaEgreso(
	idLineaEgreso INT PRIMARY KEY,
    idEgreso INT,
    idMoneda INT,
    costoReal  DECIMAL(10,2),
    cantidad INT,
    activo TINYINT,
    FOREIGN KEY (idEgreso) REFERENCES Egreso(idEgreso),
    FOREIGN KEY (idMoneda) REFERENCES Moneda(idMoneda)
)
ENGINE = InnoDB;

CREATE TABLE LineaEstimacionCosto(
	idLineaEstimacion INT PRIMARY KEY,
    idLineaEgreso INT,
    idMoneda INT,
    idEstimacion INT,
    descripcion VARCHAR(255),
    tarifaUnitaria  DECIMAL(10,2),
    cantidadRecurso INT,
    subtotal  DECIMAL(10,2),
    fechaInicio DATE,
    activo TINYINT,
    FOREIGN KEY (idMoneda) REFERENCES Moneda(idMoneda),
    FOREIGN KEY (idLineaEgreso) REFERENCES LineaEgreso(idLineaEgreso),
    FOREIGN KEY (idEstimacion) REFERENCES EstimacionCosto(idEstimacion)
)
ENGINE = InnoDB;

CREATE TABLE EstimacionCosto(
	idEstimacion INT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    reservaContigencia  DECIMAL(10,2),
    lineaBase  DECIMAL(10,2),
    ganancia  DECIMAL(10,2),
	IGV DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto)
)
ENGINE = InnoDB;

CREATE TABLE Moneda(
	idMoneda INT PRIMARY KEY,
    tipoCambio DECIMAL(10,2),
    activo TINYINT
)
ENGINE = InnoDB;


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
