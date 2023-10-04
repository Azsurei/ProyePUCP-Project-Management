# Eliminacion de Tablas
DROP TABLE IF EXISTS UsuarioXRolXProyecto;
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
    nombre VARCHAR(255),
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

CREATE TABLE GrupoDeProyecto(
	idGrupoDeProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200),
    codigo VARCHAR(50),
    activo tinyint
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

CREATE TABLE UsuarioXRolXProyecto (
    idUsuarioRolProyecto INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT ,
    idProyecto INT ,
    idRol INT,
    fechaAsignacion DATE,
    activo TINYINT NOT NULL DEFAULT 1,
    UNIQUE KEY (idUsuario, idProyecto, idRol),
    FOREIGN KEY (idRol) REFERENCES Rol (idRol) ,
    FOREIGN KEY (idProyecto) REFERENCES Proyecto (idProyecto),
    FOREIGN KEY (idUsuario) REFERENCES Usuario (idUsuario) 
)
ENGINE = InnoDB;




--------------------------------------------------------
-- Herramientas
--------------------------------------------------------



CREATE TABLE Herramienta(
	idHerramienta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imageURL VARCHAR(400) NOT NULL,
    activo tinyint NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE HerramientaXProyecto(
	idHerramientaXProyecto INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    idHerramienta INT,
    activo tinyint NOT NULL,
	UNIQUE(idProyecto,idHerramienta),
	FOREIGN KEY(idProyecto) REFERENCES Proyecto(idProyecto),
    FOREIGN KEY(idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;


CREATE TABLE Cronograma(
	idCronograma INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    idHerramienta INT,
    fechaInicio DATE,
    fechaFin DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
	FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;


------------
-- EDT
------------
CREATE TABLE EDT(
	idEDT INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    idHerramienta INT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    idUsuarioCreacion INT,
    fechaCreacion DATE,
    hayResponsable TINYINT ,
    activo tinyint ,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;





CREATE TABLE ComponenteEDT(
	idComponente INT AUTO_INCREMENT PRIMARY KEY,
    idElementoPadre INT,
    idEDT INT,
    descripcion VARCHAR(255),
    codigo VARCHAR(255),
    observaciones VARCHAR(255),
    idComponenteTags INT,
    nombre VARCHAR(100),
    responsables VARCHAR(100),
    fechaInicio DATE,
    fechaFin DATE,
    recursos VARCHAR(500),
    hito VARCHAR(500),
	activo tinyint,
    FOREIGN KEY (idElementoPadre) REFERENCES ComponenteEDT(idComponente),
    FOREIGN KEY (idEDT) REFERENCES EDT(idEDT),
    FOREIGN KEY (idComponenteTags) REFERENCES ComponenteTags(idComponenteTags)
)
ENGINE = InnoDB;


CREATE TABLE ComponenteCriterioDeAceptacion(
	idComponenteCriterioDeAceptacion INT AUTO_INCREMENT PRIMARY KEY,
    idComponenteEDT INT,
    descripcion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idComponenteEDT) REFERENCES ComponenteEDT(idComponente)
)
ENGINE = InnoDB;

CREATE TABLE ComponenteTags (
  idComponenteTags INT NOT NULL,
  nombre VARCHAR(200) NULL,
  colorRGB VARCHAR(45) NULL,
  PRIMARY KEY (idComponenteTags))
ENGINE = InnoDB;

-----------------------
-- Acta de Constitucion
-----------------------
DROP TABLE IF EXISTS ActaConstitucion;
CREATE TABLE ActaConstitucion(
    idActa INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;



CREATE TABLE HitoAC(
	idHito INT AUTO_INCREMENT PRIMARY KEY,
    idActa INT,
    descripcion VARCHAR(255),
    fechaLimite DATE,
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

CREATE TABLE InteresadoAC(
	idInteresado INT AUTO_INCREMENT PRIMARY KEY,
    idActa INT,
    nombre VARCHAR(255),
    cargo VARCHAR(255),
    organizacion DATE,
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

CREATE TABLE DetalleAC(
	idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idActa INT,
    idTipoDatoAC INT,
    detalle VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa),
    FOREIGN KEY (idTipoDatoAC) REFERENCES TipoDatoAC(idTipoDato)
)
ENGINE = InnoDB;

CREATE TABLE TipoDatoAC(
	idTipoDato INT AUTO_INCREMENT PRIMARY KEY,
    idActa INT,
    nombre VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idActa) REFERENCES ActaConstitucion(idActa)
)
ENGINE = InnoDB;

-----------------------
-- Acta Reunion
-----------------------

CREATE TABLE ActaReunion(
	idActaReunion INT AUTO_INCREMENT PRIMARY KEY,
	idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------
-- Matriz de responsabilidad
-----------------------
DROP TABLE IF EXISTS MatrizResponsabilidad;
CREATE TABLE MatrizResponsabilidad(
    idMatrizResponsabilidad INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------
-- Matriz de comunicaciones
-----------------------

DROP TABLE IF EXISTS MatrizComunicacion;
CREATE TABLE MatrizComunicacion(
    idMatrizComunicacion INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;



-----------------------
-- Catalogo de riesgos
-----------------------

DROP TABLE IF EXISTS CatalogoRiesgo;
CREATE TABLE CatalogoRiesgo(
    idCatalogo INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------------
-- Catalogo de interesados
-----------------------------

DROP TABLE IF EXISTS CatalogoInteresado;
CREATE TABLE CatalogoInteresado(
    idCatalogoInteresado INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------
-- Autoevaluacion
-----------------------

CREATE TABLE Autoevaluacion(
	idAutoevaluacion INT AUTO_INCREMENT PRIMARY KEY,
	idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------
-- Retrospectiva
-----------------------

CREATE TABLE Retrospectiva(
	idRetrospectiva INT AUTO_INCREMENT PRIMARY KEY,
	idHerramienta INT,
    idProyecto INT,
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

-----------------------
-- Presupuesto
-----------------------

CREATE TABLE Moneda(
	idMoneda INT AUTO_INCREMENT PRIMARY KEY,
    tipoCambio DECIMAL(10,2),
    activo TINYINT
)
ENGINE = InnoDB;

CREATE TABLE Presupuesto(
	idPresupuesto INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    presupuestoInicial  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;

CREATE TABLE Ingreso(
	idIngreso INT AUTO_INCREMENT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto)
)
ENGINE = InnoDB;

CREATE TABLE Egreso(
	idEgreso INT AUTO_INCREMENT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto)
)
ENGINE = InnoDB;

CREATE TABLE LineaEgreso(
	idLineaEgreso INT AUTO_INCREMENT PRIMARY KEY,
    idEgreso INT,
    idMoneda INT,
    costoReal  DECIMAL(10,2),
    cantidad INT,
    activo TINYINT,
    FOREIGN KEY (idEgreso) REFERENCES Egreso(idEgreso),
    FOREIGN KEY (idMoneda) REFERENCES Moneda(idMoneda)
)
ENGINE = InnoDB;

CREATE TABLE EstimacionCosto(
	idEstimacion INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE LineaEstimacionCosto(
	idLineaEstimacion INT AUTO_INCREMENT PRIMARY KEY,
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

-----------------------
-- Product Backlog
-----------------------
DROP TABLE IF EXISTS HistoriaRequisito;
DROP TABLE IF EXISTS HistoriaCriterioDeAceptacion;
DROP TABLE IF EXISTS HistoriaPrioridad;
DROP TABLE IF EXISTS HistoriaEstado;
DROP TABLE IF EXISTS HistoriaDeUsuario;
DROP TABLE IF EXISTS ProductBacklog;
DROP TABLE IF EXISTS Epica;
DROP TABLE IF EXISTS Sprint;

CREATE TABLE Sprint(
	idSprint INT AUTO_INCREMENT PRIMARY KEY,
    idProductBacklog INT,
    descripcion VARCHAR(255),
    fechaInicio DATE,
    fechaFin DATE,
    estaCompletado TINYINT,
    activo TINYINT,
	FOREIGN KEY (idProductBacklog) REFERENCES ProductBacklog(idProductBacklog)
)
ENGINE = InnoDB;

CREATE TABLE HistoriaEstado(
	idHistoriaEstado INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    activo TINYINT
)
ENGINE = InnoDB;

CREATE TABLE HistoriaPrioridad(
	idHistoriaPrioridad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    RGB VARCHAR(18),
    activo TINYINT
)
ENGINE = InnoDB;

CREATE TABLE HistoriaDeUsuario(
	idHistoriaDeUsuario INT AUTO_INCREMENT PRIMARY KEY,
    idEpica INT,
    descripcion VARCHAR(400),
    como VARCHAR(255),
    quiero VARCHAR(255),
    para VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idEpica) REFERENCES Epica(idEpica)
)
ENGINE = InnoDB;

CREATE TABLE Epica(
	idEpica INT AUTO_INCREMENT PRIMARY KEY,
    idProductBacklog INT,
    nombre VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idProductBacklog) REFERENCES ProductBacklog(idProductBacklog)
)
ENGINE = InnoDB;


CREATE TABLE HistoriaDeUsuario(
    idHistoriaDeUsuario INT AUTO_INCREMENT PRIMARY KEY,
    idEpica INT,
	idHistoriaPrioridad INT,
    idHistoriaEstado INT,
    descripcion VARCHAR(400),
    como VARCHAR(255),
    quiero VARCHAR(255),
    para VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idEpica) REFERENCES Epica(idEpica),
    FOREIGN KEY (idHistoriaPrioridad) REFERENCES HistoriaPrioridad(idHistoriaPrioridad),
    FOREIGN KEY (idHistoriaEstado) REFERENCES HistoriaEstado(idHistoriaEstado)
)
ENGINE = InnoDB;



CREATE TABLE HistoriaRequisito(
	idHistoriaRequisito INT AUTO_INCREMENT PRIMARY KEY,
    idHistoriaDeUsuario INT,
    descripcion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idHistoriaDeUsuario) REFERENCES HistoriaDeUsuario(idHistoriaDeUsuario)
)
ENGINE = InnoDB;

CREATE TABLE HistoriaCriterioDeAceptacion(
	idHistoriaCriterioDeAceptacion INT AUTO_INCREMENT PRIMARY KEY,
	idHistoriaDeUsuario INT,
    escenario VARCHAR(255),
    dadoQue VARCHAR(255),
	cuando VARCHAR(255),
	entonces VARCHAR(255),
    activo TINYINT,
	FOREIGN KEY (idHistoriaDeUsuario) REFERENCES HistoriaDeUsuario(idHistoriaDeUsuario)
)
ENGINE = InnoDB;

ALTER TABLE HistoriaCriterioDeAceptacion
ADD COLUMN escenario VARCHAR(255);

CREATE TABLE ProductBacklog(
	idProductBacklog INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
	idHerramienta INT,
    fechaCreacion DATE,
    activo TINYINT,
	FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)ENGINE = InnoDB;


-----------------------
-- Plantillas
-----------------------

CREATE TABLE Plantilla(
	idPlantilla INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idUsuario INT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    tamano_bytes   DECIMAL(12,2),
    documentoURL  VARCHAR(400),
	fechaCreacion  DATE,
    fechaUltimaActualizacion  DATE,
    activo TINYINT,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaActaConstitucion(
	idPlantillaAC INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    activo TINYINT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaACTipoDato(
	idPlantillaACTipoDato INT AUTO_INCREMENT PRIMARY KEY,
    idPlantillaAC INT,
    nombre VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idPlantillaAC) REFERENCES PlantillaActaConstitucion(idPlantillaAC)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaEstadoTarea(
	idPlantillaEstadoTarea INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    activo TINYINT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaEstadoTareaEstado(
	idPlantillaEstadoTareaEstado INT AUTO_INCREMENT PRIMARY KEY,
    idPlantillaEstadoTarea INT,
    nombre VARCHAR(255),
    colorEstado INT,
    activo TINYINT,
    FOREIGN KEY (idPlantillaEstadoTarea) REFERENCES PlantillaEstadoTarea(idPlantillaEstadoTarea)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaMatrizComunicacion(
	idPlantillaMComunicacion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    activo TINYINT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaMComunicacionRol(
	idMComunicacionRol INT AUTO_INCREMENT PRIMARY KEY,
    idPlantillaMComunicacion INT,
    letra VARCHAR(1),
    nombre VARCHAR(255),
    color INT,
    activo TINYINT,
    FOREIGN KEY (idPlantillaMComunicacion) REFERENCES PlantillaMatrizComunicacion(idPlantillaMComunicacion)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaAutoevaluacion(
	idPlantillaAutoevaluacion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    activo TINYINT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaValorEvaluacion(
	idValorEvaluacion INT AUTO_INCREMENT PRIMARY KEY,
    idPlantillaAutoevaluacion INT,
    nombre VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idPlantillaAutoevaluacion) REFERENCES PlantillaAutoevaluacion(idPlantillaAutoevaluacion)
)
ENGINE = InnoDB;

CREATE TABLE PlantillaCampoAutoevaluacion(
	idCampoAutoevaluacion INT AUTO_INCREMENT PRIMARY KEY,
    idPlantillaAutoevaluacion INT,
    descripcion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idPlantillaAutoevaluacion) REFERENCES PlantillaAutoevaluacion(idPlantillaAutoevaluacion)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- ENTREGABLE
-- -----------------------------------------------------
CREATE TABLE Entregable (
	idEntregable INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(500) NULL,
	idComponente INT NOT NULL,
	activo TINYINT NULL,
    FOREIGN KEY (idComponente) REFERENCES ComponenteEDT(idComponente)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- PROCEDURES
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS VERIFICAR_CUENTA_USUARIO;
DROP PROCEDURE IF EXISTS INSERTAR_CUENTA_USUARIO;
DROP PROCEDURE IF EXISTS INSERTAR_PROYECTO;
DROP PROCEDURE IF EXISTS LISTAR_PROYECTOS_X_ID_USUARIO;
/*Registrar*/
DELIMITER $
CREATE PROCEDURE INSERTAR_CUENTA_USUARIO(
    IN _nombres VARCHAR(200),
    IN _apellidos VARCHAR(200),
    IN _correoElectronico VARCHAR(200),
    IN _password VARCHAR(200)
)
BEGIN
	INSERT INTO Usuario(nombres,apellidos,correoElectronico,password,activo,Privilegios_idPrivilegios) VALUES(_nombres, _apellidos, _correoElectronico, md5(_password), true, 1);
    SELECT @@last_insert_id AS idUsuario;
END$

/*LOGIN*/
DELIMITER $
CREATE PROCEDURE VERIFICAR_CUENTA_USUARIO(
    IN _correoElectronico VARCHAR(200),
    IN _password VARCHAR(200)
)
BEGIN
  DECLARE _idUsuario INT;
  SELECT idUsuario INTO _idUsuario
  FROM Usuario
  WHERE correoElectronico = _correoElectronico AND password = md5(_password);
  -- Devolver un valor para indicar el resultado de la autenticación
  IF _idUsuario > 0 THEN
    SELECT _idUsuario AS 'idUsuario'; -- Usuario autenticado
  ELSE
    SELECT 0 AS 'idUsuario'; -- Usuario no autenticado
  END IF;
END$
DROP PROCEDURE INSERTAR_PROYECTO;
------------
-- Proyecto
------------

-- Insertar proyecto hace referencia a crear un proyecto por parte de un jefe
DELIMITER $
CREATE PROCEDURE INSERTAR_PROYECTO(
	IN _idUsuario INT,
	IN _nombre VARCHAR(200),
    IN _maxCantParticipantes INT,
    IN _fechaInicio DATE,
    IN _fechaFinINSERTAR_PROYECTO DATE
)
BEGIN
	DECLARE _id_proyecto INT;
	INSERT INTO Proyecto(nombre,maxCantParticipantes,fechaInicio,fechaFin,fechaUltimaModificacion,activo) VALUES(_nombre,_maxCantParticipantes,_fechaInicio,_fechaFin,NOW(),1);
    SET _id_proyecto = @@last_insert_id;
    INSERT INTO UsuarioXRolXProyecto(idUsuario,idProyecto,idRol,fechaAsignacion,activo)VALUES(_idUsuario,_id_proyecto,1,NOW(),1);
    SELECT _id_proyecto AS idProyecto;
END$


DELIMITER $
CREATE PROCEDURE LISTAR_PROYECTOS_X_ID_USUARIO(IN _idUsuario INT)
BEGIN
	SELECT p.idProyecto, p.nombre, p.maxCantParticipantes, p.fechaInicio, p.fechaFin, p.fechaUltimaModificacion ,r.nombre
    FROM Proyecto p,UsuarioXRolXProyecto urp INNER JOIN Rol r ON r.idRol=urp.idRol WHERE p.idProyecto = urp.idProyecto AND urp.idUsuario = _idUsuario;
END$
DELIMITER $

-- ---------------------
-- PROCEDURES HERRAMIENTAS
-- ---------------------
DROP PROCEDURE IF EXISTS INSERTAR_PRODUCT_BACKLOG;
DROP PROCEDURE IF EXISTS LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO;
DROP PROCEDURE IF EXISTS INSERTAR_EPICA;
DROP PROCEDURE IF EXISTS LISTAR_EPICAS_X_ID_BACKLOG;
DROP PROCEDURE IF EXISTS INSERTAR_EDT;
DROP PROCEDURE IF EXISTS LISTAR_EDT_X_ID_PROYECTO;
DROP PROCEDURE IF EXISTS INSERTAR_COMPONENTE_EDT;
DROP PROCEDURE IF EXISTS LISTAR_HISTORIAS_PRIORIDAD;
DROP PROCEDURE IF EXISTS LISTAR_HISTORIAS_ESTADO;
DROP PROCEDURE IF EXISTS LISTAR_COMPONENTES_EDT_X_ID_EDT;
DROP PROCEDURE IF EXISTS LISTAR_USUARIOS_X_NOMBRE_CORREO;
CREATE PROCEDURE LISTAR_HERRAMIENTAS;


DELIMITER $
CREATE PROCEDURE INSERTAR_PRODUCT_BACKLOG(
	IN  _id_Proyecto INT
)
BEGIN
	DECLARE _id_backlog INT;
	INSERT INTO ProductBacklog(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(1,_id_Proyecto,NOW(),1);
    SET _id_backlog = @@last_insert_id;
    SELECT _id_backlog AS idProductBacklog;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *FROM ProductBacklog pb WHERE _idProyecto = pb.idProyecto AND pb.activo =1;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_EPICA(
	IN  _idProductBacklog INT,
    IN _nombre VARCHAR(255)
)
BEGIN
	DECLARE _id_Epica INT;
	INSERT INTO Epica(idProductBacklog,nombre,fechaCreacion,activo) VALUES(_idProductBacklog,_nombre,NOW(),1);
    SET _id_Epica = @@last_insert_id;
    SELECT _id_Epica AS idEpica;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_EPICAS_X_ID_BACKLOG(
	IN _idBacklog INT
)
BEGIN
	SELECT *FROM Epica p WHERE _idBacklog = p.idProductBacklog AND p.activo =1;
END$

CREATE PROCEDURE LISTAR_HISTORIAS_DE_USUARIO_X_ID_EPICA(
	IN _idEpica INT
)
BEGIN
	SELECT *FROM HistoriaDeUsuario hu WHERE _idEpica = hu.idEpica AND hu.activo =1;
END

## VERIFICAR INSERTAR_HISTORIA_DE_USUARIO
DELIMITER $
CREATE PROCEDURE INSERTAR_HISTORIA_DE_USUARIO(
	IN  _idEpica INT,
    IN _idHistoriaPrioridad INT,
    IN _idHistoriaEstado INT,
	IN descripcion VARCHAR(255),
    IN como VARCHAR(255),
    IN quiero VARCHAR(255),
    IN para VARCHAR(255)
)
BEGIN
	DECLARE _id_HU INT;
	INSERT INTO HistoriaDeUsuario(idEpica,idHistoriaPrioridad,idHistoriaEstado,descripcion,como,quiero,para,fechaCreacion,activo) 
    VALUES(_idEpica,_idHistoriaPrioridad,_idHistoriaEstado,descripcion,como,quiero,para,NOW(),1);
    SET _id_HU = @@last_insert_id;
    SELECT _id_HU AS idHistoriaDeUsuario;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_HISTORIAS_PRIORIDAD()
BEGIN
	SELECT *FROM HistoriaPrioridad WHERE activo =1;
END$

DROP PROCEDURE LISTAR_HISTORIAS_ESTADO;

DELIMITER $
CREATE PROCEDURE LISTAR_HISTORIAS_ESTADO()
BEGIN
	SELECT * FROM HistoriaEstado WHERE activo =1;
END$

------------------------------
DELIMITER $
CREATE PROCEDURE INSERTAR_EDT(
	IN  _idProyecto INT,
    IN _nombre VARCHAR(255),
    IN _descripcion	VARCHAR(255),
    IN _idUsuarioCreacion INT,
    IN _hayResponsable TINYINT
)
BEGIN
	DECLARE _id_EDT INT;
	INSERT INTO EDT(idHerramienta,idProyecto,nombre,descripcion,idUsuarioCreacion,fechaCreacion,hayResponsable,activo) 
    VALUES(2,_idProyecto,_nombre,_descripcion,_idUsuarioCreacion,NOW(),_hayResponsable,1);
    SET _id_EDT = @@last_insert_id;
    SELECT _id_EDT AS idEDT;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_EDT_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *FROM EDT edt WHERE _idProyecto = edt.idProyecto AND edt.activo =1;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_COMPONENTE_EDT(
	IN  _idElementoPadre INT,
    IN _idEDT INT,
    IN _descripcion	VARCHAR(255),
    IN _codigo	VARCHAR(255),
    IN _observaciones VARCHAR(255)
)
BEGIN
	DECLARE _idComponenteEDT INT;
	INSERT INTO ComponenteEDT(idElementoPadre,idEDT,descripcion,codigo,observaciones,activo) 
    VALUES(_idElementoPadre,_idEDT,_descripcion,_codigo,_observaciones,1);
    SET _idComponenteEDT = @@last_insert_id;
    SELECT _idComponenteEDT AS idComponenteEDT;
END$


DELIMITER $
CREATE PROCEDURE LISTAR_COMPONENTES_EDT_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *
	FROM ComponenteEDT ce
	WHERE ce.idEDT = (SELECT idEDT FROM EDT WHERE idProyecto = _idProyecto);
END



DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_NOMBRE_CORREO(
    IN _nombreCorreo VARCHAR(255)
)
BEGIN
    SELECT * 
    FROM Usuario 
    WHERE ( _nombreCorreo IS NULL OR (CONCAT(nombres, ' ', apellidos) LIKE CONCAT('%', _nombreCorreo, '%')) OR
    correoElectronico LIKE CONCAT('%', _nombreCorreo, '%')) 
    AND activo = 1;
END$

SELECT * FROM UsuarioXRolXProyecto;

DROP PROCEDURE INSERTAR_USUARIO_X_ROL_X_PROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_USUARIO_X_ROL_X_PROYECTO(
    IN _idUsuario INT,
    IN _idRol INT,
    IN _idProyecto INT
)
BEGIN
	DECLARE _idUsuarioXRolXProyecto INT;
	INSERT INTO UsuarioXRolXProyecto (idUsuario,idProyecto,idRol,fechaAsignacion,activo)VALUES(_idUsuario,_idProyecto,_idRol,CURDATE(),1);
    SET _idUsuarioXRolXProyecto = @@last_insert_id;
    SELECT _idUsuarioXRolXProyecto AS idUsuarioXRolXProyecto;
END$

CREATE PROCEDURE LISTAR_HERRAMIENTAS()
BEGIN
	SELECT * FROM Herramienta WHERE activo =1;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_HISTORIAS_DE_USUARIO_X_ID_PROYECTO(IN _idProyecto INT)
BEGIN
	SELECT hu.idHistoriaDeUsuario, hu.idEpica, hu.idHistoriaPrioridad,hu.idHistoriaEstado, hu.descripcion,hu.como,hu.quiero,hu.para,hu.fechaCreacion 
FROM HistoriaDeUsuario  hu 
WHERE hu.idEpica IN (SELECT e.idEpica FROM Epica e WHERE e.idProductBacklog = 
							(SELECT idProductBacklog FROM ProductBacklog WHERE idProyecto = _idProyecto))
AND activo=1
ORDER BY hu.idEpica;
END$

DELIMITER $
CREATE PROCEDURE ELIMINAR_HISTORIA_DE_USUARIO(IN _idHistoriaDeUsuario INT)
BEGIN
	UPDATE HistoriaDeUsuario SET activo = 0 WHERE _idHistoriaDeUsuario;
END$


DROP PROCEDURE LISTAR_PROYECTO_Y_GRUPO_DE_PROYECTO;

DELIMITER $
CREATE PROCEDURE LISTAR_PROYECTO_Y_GRUPO_DE_PROYECTO(IN _idProyecto INT)
BEGIN
	SELECT p.idProyecto, p.nombre as nombreProyecto, p.maxCantParticipantes, p.fechaInicio, p.fechaFin, p.fechaUltimaModificacion, p.idGrupoDeProyecto, gp.nombre as nombreGrupoDeProyecto 
    FROM GrupoDeProyecto gp, Proyecto p WHERE gp.idGrupoDeProyecto = p.idGrupoDeProyecto AND p.idProyecto = _idProyecto AND p.activo =1;
END$


DROP PROCEDURE LISTAR_HISTORIA_DE_USUARIO_DETALLES;

DELIMITER $
CREATE PROCEDURE LISTAR_HISTORIA_DE_USUARIO_DETALLES(IN _idHistoriaDeUsuario INT)
BEGIN
		SELECT hu.idHistoriaDeUsuario, hu.descripcion as descripcionHistoria, ep.idEpica, ep.nombre as nombreEpica, hp.idHistoriaPrioridad, hp.nombre, hp.RGB, he.idHistoriaEstado, he.descripcion as descripcionEstado
        FROM HistoriaDeUsuario hu 	INNER JOIN Epica ep ON hu.idEpica = ep.idEpica	
											INNER JOIN HistoriaPrioridad hp ON hp.idHistoriaPrioridad = hu.idHistoriaPrioridad
                                            INNER JOIN HistoriaEstado he ON hu.idHistoriaEstado = he.idHistoriaEstado WHERE hu.activo=1;
END$

CALL LISTAR_HISTORIA_DE_USUARIO_DETALLES(1);


CALL LISTAR_HISTORIA_DE_USUARIO_DETALLES(4);
-- ---------------------
-- COMPONENTE EDT
-- ---------------------

DELIMITER $
CREATE PROCEDURE INSERTAR_COMPONENTE_EDT(
	IN  _idElementoPadre INT,
    IN _idProyecto INT,
    IN _descripcion	VARCHAR(255),
    IN _codigo	VARCHAR(255),
    IN _observaciones VARCHAR(255),
    IN _nombre VARCHAR(100),
    IN _responsables VARCHAR(100),
    IN _fechaInicio DATE,
    IN _fechaFin DATE,
    IN _recursos VARCHAR(500),
    IN _hito VARCHAR(500)
)
BEGIN
	DECLARE _idComponenteEDT INT;
    DECLARE _idEDT INT;
    
    SELECT idEDT INTO _idEDT FROM EDT edt WHERE _idProyecto = edt.idProyecto and edt.activo=1;
    
	INSERT INTO ComponenteEDT(idElementoPadre,idEDT,descripcion,codigo,observaciones,activo,nombre,responsables,fechaInicio,fechaFin,recursos,hito) 
    VALUES(_idElementoPadre,_idEDT,_descripcion,_codigo,_observaciones,1,_nombre,_responsables,_fechaInicio,_fechaFin,_recursos,_hito);
    SET _idComponenteEDT = @@last_insert_id;
    SELECT _idComponenteEDT AS idComponenteEDT;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_CRITERIOS_ACEPTACION(
    IN _idComponenteEDT INT,
    IN _descripcion	VARCHAR(255)
)
BEGIN
	DECLARE _idComponenteCriterioDeAceptacion INT;
	INSERT INTO ComponenteCriterioDeAceptacion(idComponenteEDT,descripcion,activo) 
    VALUES(_idComponenteEDT,_descripcion,1);
    SET _idComponenteCriterioDeAceptacion = @@last_insert_id;
    SELECT _idComponenteCriterioDeAceptacion AS idComponenteCriterioDeAceptacion;
END$


DELIMITER $
CREATE PROCEDURE INSERTAR_ENTREGABLE(
    IN _nombre VARCHAR(255),
    IN _idComponente	INT
)
BEGIN
	DECLARE _idEntregable INT;
	INSERT INTO Entregable(nombre,idComponente,activo) 
    VALUES(_nombre,_idComponente,1);
    SET _idEntregable = @@last_insert_id;
    SELECT _idEntregable AS idEntregable;
END$

DROP PROCEDURE LISTAR_PROYECTOS_X_NOMBRE;
DELIMITER $
CREATE PROCEDURE LISTAR_PROYECTOS_X_NOMBRE(
    IN _nombre VARCHAR(255)
)
BEGIN
	SELECT *FROM Proyecto WHERE nombre LIKE CONCAT('%',_nombre,'%')AND activo =1;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_ACTA_CONSTITUCION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idActaConstitucion INT;
	INSERT INTO ActaConstitucion(idHerramienta,idProyecto,fechaCreacion,activo) 
    VALUES(3,_idProyecto,curdate(),1);
    SET _idActaConstitucion = @@last_insert_id;
    SELECT _idActaConstitucion AS idActaConstitucion;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_ACTA_REUNION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idActaReunion INT;
	INSERT INTO ActaReunion(idHerramienta,idProyecto,fechaCreacion,activo) 
    VALUES(11,_idProyecto,curdate(),1);
    SET _idActaReunion = @@last_insert_id;
    SELECT _idActaReunion AS idActaReunion;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_RETROSPECTIVA(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idRetrospectiva INT;
	INSERT INTO Retrospectiva(idHerramienta,idProyecto,fechaCreacion,activo) 
    VALUES(10,_idProyecto,curdate(),1);
    SET _idRetrospectiva = @@last_insert_id;
    SELECT _idRetrospectiva AS idRetrospectiva;
END$


DELIMITER $
CREATE PROCEDURE INSERTAR_AUTOEVALUACION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idAutoevaluacion INT;
	INSERT INTO Autoevaluacion(idHerramienta,idProyecto,fechaCreacion,activo) 
    VALUES(9,_idProyecto,curdate(),1);
    SET _idAutoevaluacion = @@last_insert_id;
    SELECT _idAutoevaluacion AS idAutoevaluacion;
END$

DROP PROCEDURE IF EXISTS INSERTAR_HERRAMIENTA_X_PROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_HERRAMIENTA_X_PROYECTO(
    IN _idProyecto INT,
    IN _idHerramienta INT
)
BEGIN
	DECLARE _idHerramientaXProyecto INT;
	INSERT INTO HerramientaXProyecto(idProyecto, idHerramienta, activo) 
    VALUES(_idProyecto,_idHerramienta,1);
    SET _idHerramientaXProyecto = @@last_insert_id;
    SELECT _idHerramientaXProyecto AS idHerramientaXProyecto;
END$

DROP PROCEDURE IF EXISTS INSERTAR_CRONOGRAMA;
DELIMITER $
CREATE PROCEDURE INSERTAR_CRONOGRAMA(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idCronograma INT;
	INSERT INTO Cronograma(idHerramienta,fechaInicio,fechaFin,activo,idProyecto) VALUES(4,NULL,NULL,1,_idProyecto);		#Luego, al darle click por primera vez al cronograma, se debera solicitar estos datos
    SET _idCronograma = @@last_insert_id;
    SELECT _idCronograma AS idCronograma;
END$


DROP PROCEDURE IF EXISTS INSERTAR_CATALOGO_RIESGO;
DELIMITER $
CREATE PROCEDURE INSERTAR_CATALOGO_RIESGO(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idCatalogo INT;
	INSERT INTO CatalogoRiesgo(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(5,_idProyecto,curdate(),1);		
    SET _idCatalogo = @@last_insert_id;
    SELECT _idCatalogo AS idCatalogo;
END$

DROP PROCEDURE IF EXISTS INSERTAR_CATALOGO_INTERESADO;
DELIMITER $
CREATE PROCEDURE INSERTAR_CATALOGO_INTERESADO(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idCatalogoInteresado INT;
	INSERT INTO CatalogoInteresado(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(6,_idProyecto,curdate(),1);		
    SET _idCatalogoInteresado = @@last_insert_id;
    SELECT _idCatalogoInteresado AS idCatalogoInteresado;
END$


DROP PROCEDURE IF EXISTS INSERTAR_MATRIZ_RESPONSABILIDAD;
DELIMITER $
CREATE PROCEDURE INSERTAR_MATRIZ_RESPONSABILIDAD(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idMatrizResponsabilidad INT;
	INSERT INTO MatrizResponsabilidad(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(7,_idProyecto,curdate(),1);		
    SET _idMatrizResponsabilidad = @@last_insert_id;
    SELECT _idMatrizResponsabilidad AS idMatrizResponsabilidad;
END$


DROP PROCEDURE IF EXISTS INSERTAR_MATRIZ_COMUNICACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_MATRIZ_COMUNICACION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idMatrizComunicacion INT;
	INSERT INTO MatrizResponsabilidad(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(8,_idProyecto,curdate(),1);		
    SET _idMatrizComunicacion = @@last_insert_id;
    SELECT _idMatrizComunicacion AS idMatrizComunicacion;
END$