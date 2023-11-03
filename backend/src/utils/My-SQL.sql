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

CREATE TABLE Equipo(
	idEquipo INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    nombre VARCHAR(200),
    descripcion VARCHAR(500),
    fechaCreacion DATE,
    activo tinyint,
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

CREATE TABLE UsuarioXEquipo(
	idUsuarioXEquipo INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idEquipo INT,
    activo tinyint,
    idRol INT,
    UNIQUE(idUsuario,idEquipo),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idEquipo) REFERENCES Equipo(idEquipo),
    FOREIGN KEY (idRol) REFERENCES RolesEquipo(idRolEquipo)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS RolesEquipo;
CREATE TABLE RolesEquipo(
    idRolEquipo INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol VARCHAR(200),
    idEquipo INT,
    estado TINYINT,
    FOREIGN KEY (idEquipo) REFERENCES Equipo(idEquipo)
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
    idHerramientaCreada INT,
    activo tinyint NOT NULL,
	UNIQUE(idProyecto,idHerramienta),
	FOREIGN KEY(idProyecto) REFERENCES Proyecto(idProyecto),
    FOREIGN KEY(idHerramienta) REFERENCES Herramienta(idHerramienta)
)
ENGINE = InnoDB;


------------
-- Cronograma
------------

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

DROP TABLE IF EXISTS Tarea;

CREATE TABLE Tarea(
	idTarea INT AUTO_INCREMENT PRIMARY KEY,
    idCronograma INT,
    idTareaEstado INT,
    idEquipo INT,
    idPadre INT,			## Si el id es null la tarea es padre sino, es hijo
    idTareaAnterior INT,
	sumillaTarea VARCHAR(255),
    descripcion VARCHAR (500),
    fechaInicio DATE,
    fechaFin DATE,
    cantSubTareas INT,
    cantPosteriores INT,
    horasPlaneadas TIME,
    fechaUltimaModificacionEstado DATE, ## Campo para verificar cuando se cambio el estado de la tarea
    esPosterior TINYINT,
    activo TINYINT,
	FOREIGN KEY (idCronograma) REFERENCES Cronograma(idCronograma),
    FOREIGN KEY (idTareaEstado) REFERENCES TareaEstado(idTareaEstado)
)
ENGINE = InnoDB;


DROP TABLE IF EXISTS TareaEstado;

CREATE TABLE TareaEstado(
	idTareaEstado INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    nombre VARCHAR(255),
    color VARCHAR(8),
    activo TINYINT,
	FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

CREATE TABLE UsuarioXTarea(
	idUsuarioXTarea INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idTarea INT,
    activo TINYINT,
    UNIQUE(idUsuario,idTarea),
	FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idTarea) REFERENCES Tarea(idTarea)
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
    nombreProyecto VARCHAR(200),
    empresa VARCHAR(200),
    cliente VARCHAR(200),
    patrocinador VARCHAR(200),
    gerente VARCHAR(200),
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;



CREATE TABLE HitoAC(
	idHito INT AUTO_INCREMENT PRIMARY KEY,
    idActaConstitucion INT,
    descripcion VARCHAR(255),
    fechaLimite DATE,
    activo TINYINT,
    FOREIGN KEY (idActaConstitucion) REFERENCES ActaConstitucion(idActaConstitucion)
)
ENGINE = InnoDB;

CREATE TABLE InteresadoAC(
	idInteresado INT AUTO_INCREMENT PRIMARY KEY,
    idActaConstitucion INT,
    nombre VARCHAR(255),
    cargo VARCHAR(255),
    organizacion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idActaConstitucion) REFERENCES ActaConstitucion(idActaConstitucion)
)
ENGINE = InnoDB;

CREATE TABLE DetalleAC(
	idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idActaConstitucion INT,
    nombre VARCHAR(500),
    detalle VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idActaConstitucion) REFERENCES ActaConstitucion(idActaConstitucion)
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

CREATE TABLE LineaActaReunion(
	idLineaActaReunion INT AUTO_INCREMENT PRIMARY KEY,
    idActaReunion INT,
	nombreReunion VARCHAR(255),
    fechaReunion DATE,
    horaReunion TIME,
    nombreConvocante VARCHAR(255),
    motivo VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idActaReunion) REFERENCES ActaReunion(idActaReunion)
)
ENGINE = InnoDB;

CREATE TABLE ComentarioReunion (
	idComentarioReunion INT AUTO_INCREMENT PRIMARY KEY,
    idLineaActaReunion INT,
    descripcion VARCHAR(255),
    activo TINYINT,
    FOREIGN KEY (idLineaActaReunion) REFERENCES LineaActaReunion(idLineaActaReunion)
)
ENGINE = InnoDB;

CREATE TABLE TemaReunion (
	idTemaReunion INT AUTO_INCREMENT PRIMARY KEY,
    idLineaActaReunion INT,
    descripcion VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idLineaActaReunion) REFERENCES LineaActaReunion(idLineaActaReunion)
)
ENGINE = InnoDB;

CREATE TABLE ParticipanteXReunion (
	idParticipanteXReunion INT AUTO_INCREMENT PRIMARY KEY,
	idLineaActaReunion INT,
    idUsuarioXRolXProyecto INT,
	asistio TINYINT,
    activo TINYINT,
    FOREIGN KEY (idLineaActaReunion) REFERENCES LineaActaReunion(idLineaActaReunion),
    FOREIGN KEY (idUsuarioXRolXProyecto) REFERENCES UsuarioXRolXProyecto(idUsuarioRolProyecto)
)
ENGINE = InnoDB;

CREATE TABLE Acuerdo (
	idAcuerdo INT AUTO_INCREMENT PRIMARY KEY,
    idTemaReunion INT,
	descripcion VARCHAR(500),
    fechaObjetivo DATE,
    activo TINYINT,
    FOREIGN KEY (idTemaReunion) REFERENCES TemaReunion(idTemaReunion)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS ResponsableAcuerdo;
CREATE TABLE ResponsableAcuerdo (
	idResponsableAcuerdo INT AUTO_INCREMENT PRIMARY KEY,
    idAcuerdo 	INT,
    idUsuarioXRolXProyecto INT,
    activo TINYINT,
    FOREIGN KEY (idAcuerdo) REFERENCES Acuerdo(idAcuerdo),
    FOREIGN KEY (idUsuarioXRolXProyecto) REFERENCES UsuarioXRolXProyecto(idUsuarioRolProyecto)
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


CREATE TABLE LineaRetrospectiva(
	idLineaRetrospectiva INT AUTO_INCREMENT PRIMARY KEY,
	idRetrospectiva INT,
    idSprint INT,
    idEquipo INT,
    cantBien INT,
    cantMal INT,
    cantQueHacer INT,
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idRetrospectiva) REFERENCES Retrospectiva(idRetrospectiva),
    FOREIGN KEY (idSprint) REFERENCES Sprint(idSprint)
)
ENGINE = InnoDB;


CREATE TABLE CriterioRetrospectiva(
	idCriterioRetrospectiva INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS ItemLineaRetrospectiva;
CREATE TABLE ItemLineaRetrospectiva(
	idItemLineaRetrospectiva INT AUTO_INCREMENT PRIMARY KEY,
    idLineaRetrospectiva INT,
    idCriterioRetrospectiva INT,
    descripcion VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idLineaRetrospectiva) REFERENCES LineaRetrospectiva(idLineaRetrospectiva),
    FOREIGN KEY (idCriterioRetrospectiva) REFERENCES CriterioRetrospectiva(idCriterioRetrospectiva)
)
ENGINE = InnoDB;

SELECT * FROM ItemLineaRetrospectiva;

CREATE TABLE ItemLineaRetrospectiva(
	idItemLineaRetrospectiva INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    fechaCreacion DATE,
    activo TINYINT
)
ENGINE = InnoDB;

-----------------------
-- Presupuesto
-----------------------

CREATE TABLE Moneda(
	idMoneda INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    tipoCambio DECIMAL(10,2),
    activo TINYINT
)
ENGINE = InnoDB;

CREATE TABLE Presupuesto(
    idPresupuesto INT AUTO_INCREMENT PRIMARY KEY,
    idHerramienta INT,
    idProyecto INT,
    idMoneda INT,
    presupuestoInicial DOUBLE,
    fechaCreacion DATE,
    cantidadMeses INT,
    activo tinyint NOT NULL,
    FOREIGN KEY (idHerramienta) REFERENCES Herramienta(idHerramienta),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

SELECT *FROM Presupuesto;

ALTER TABLE Presupuesto ADD COLUMN cantidadMeses INT;
ALTER TABLE Presupuesto ADD FOREIGN KEY (idMoneda) REFERENCES Moneda(idMoneda);

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
    idPresupuesto INT,
    idMoneda INT,
    idLineaEstimacionCosto INT,
    descripcion VARCHAR(255),
    costoReal  DECIMAL(10,2),
    fechaRegistro DATE,
    cantidad INT,
    tiempoRequerido INT,
    activo TINYINT,
    FOREIGN KEY (idPresupuesto) REFERENCES Presupuesto(idPresupuesto),
    FOREIGN KEY (idLineaEstimacionCosto) REFERENCES LineaEstimacionCosto(idLineaEstimacionCosto),
    FOREIGN KEY (idMoneda) REFERENCES Moneda(idMoneda)
)
ENGINE = InnoDB;




CREATE TABLE EstimacionCosto(
	idEstimacion INT AUTO_INCREMENT PRIMARY KEY,
    idPresupuesto INT,
    subtotal  DECIMAL(10,2),
    reservaContingencia  DECIMAL(10,2),
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
    estado INT,
    activo TINYINT,
    nombre VARCHAR(500),
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
    como VARCHAR(400),
    quiero VARCHAR(400),
    para VARCHAR(400),
    fechaCreacion DATE,
    activo TINYINT,
    FOREIGN KEY (idEpica) REFERENCES Epica(idEpica),
    FOREIGN KEY (idHistoriaPrioridad) REFERENCES HistoriaPrioridad(idHistoriaPrioridad),
    FOREIGN KEY (idHistoriaEstado) REFERENCES HistoriaEstado(idHistoriaEstado)
)
ENGINE = InnoDB;
ALTER TABLE HistoriaRequisito 
	MODIFY COLUMN descripcion VARCHAR(400)
    ;



CREATE TABLE HistoriaRequisito(
	idHistoriaRequisito INT AUTO_INCREMENT PRIMARY KEY,
    idHistoriaDeUsuario INT,
    descripcion VARCHAR(400),
    activo TINYINT,
    FOREIGN KEY (idHistoriaDeUsuario) REFERENCES HistoriaDeUsuario(idHistoriaDeUsuario)
)
ENGINE = InnoDB;

CREATE TABLE HistoriaCriterioDeAceptacion(
	idHistoriaCriterioDeAceptacion INT AUTO_INCREMENT PRIMARY KEY,
	idHistoriaDeUsuario INT,
    escenario VARCHAR(400),
    dadoQue VARCHAR(400),
	cuando VARCHAR(400),
	entonces VARCHAR(400),
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

CREATE TABLE Equipo(
	idEquipo INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    nombre VARCHAR(200),
    fechaCreacion DATE,
    activo tinyint,
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
)
ENGINE = InnoDB;

CREATE TABLE UsuarioXEquipo(
	idUsuarioXEquipo INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idEquipo INT,
    activo tinyint,
    UNIQUE(idUsuario,idEquipo),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idEquipo) REFERENCES Equipo(idEquipo)
)
ENGINE = InnoDB;


DROP TABLE ComCanal;
CREATE TABLE ComCanal(
	idCanal INT AUTO_INCREMENT PRIMARY KEY,
    nombreCanal VARCHAR(200),
    activo TINYINT
)
ENGINE = InnoDB;

DROP TABLE ComFrecuencia;
CREATE TABLE ComFrecuencia(
	idFrecuencia INT AUTO_INCREMENT PRIMARY KEY,
    nombreFrecuencia VARCHAR(200),
    activo TINYINT
)
ENGINE = InnoDB;

DROP TABLE ComFormato;
CREATE TABLE ComFormato(
	idFormato INT AUTO_INCREMENT PRIMARY KEY,
    nombreFormato VARCHAR(200),
    activo TINYINT
)
ENGINE = InnoDB;

DROP TABLE Comunicacion;
CREATE TABLE Comunicacion(
	idComunicacion INT AUTO_INCREMENT PRIMARY KEY,
    idCanal INT,
    idFrecuencia INT,
    idFormato INT,
    idMatrizComunicacion INT,
    sumillaInformacion VARCHAR(500),
    detalleInformacion VARCHAR(500),
    responsableDeComunicar INT,
    grupoReceptor VARCHAR(500),
    activo TINYINT,
    FOREIGN KEY (idCanal) REFERENCES ComCanal(idCanal),
    FOREIGN KEY (idFrecuencia) REFERENCES ComFrecuencia(idFrecuencia),
    FOREIGN KEY (idFormato) REFERENCES ComFormato(idFormato),
    FOREIGN KEY (idMatrizComunicacion) REFERENCES MatrizComunicacion(idMatrizComunicacion)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- AUTOEVALUACION
-- -----------------------------------------------------


DROP TABLE IF EXISTS UsuarioXEvaluacion;
CREATE TABLE UsuarioXEvaluacion (
    idUsuarioEvaluacion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idAutoEvaluacionXProyecto INT,
    idUsuarioEvaluado INT,
    observaciones VARCHAR(500),
    activo TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (idAutoEvaluacionXProyecto) REFERENCES AutoEvaluacionXProyecto (idAutoEvaluacionXProyecto) ,
    FOREIGN KEY (idUsuario) REFERENCES Usuario (idUsuario),
    FOREIGN KEY (idUsuarioEvaluado) REFERENCES Usuario (idUsuario) 
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS CriterioEvaluacion;
CREATE TABLE CriterioEvaluacion (
    idCriterioEvaluacion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuarioEvaluacion INT,
    criterio VARCHAR(500),
    nota INT,
    activo TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (idUsuarioEvaluacion) REFERENCES UsuarioXEvaluacion (idUsuarioEvaluacion) 
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS AutoEvaluacionXProyecto;
CREATE TABLE AutoEvaluacionXProyecto (
    idAutoEvaluacionXProyecto INT AUTO_INCREMENT PRIMARY KEY,
    idAutoevaluacion INT,
    nombre VARCHAR(500),
    fechaInicio DATE,
    fechaFin DATE,
    activo TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (idAutoevaluacion) REFERENCES Autoevaluacion (idAutoevaluacion) 
)
ENGINE = InnoDB;

-----------------------
-- Catalogo de Riesgos
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

DROP TABLE IF EXISTS Riesgo;
CREATE TABLE Riesgo(
    idRiesgo INT AUTO_INCREMENT PRIMARY KEY,
    nombreRiesgo VARCHAR(500),
    idCatalogo INT,
    fechaIdentificacion DATE,
    duenoRiesgo INT,
    detalleRiesgo VARCHAR(500),
    causaRiesgo VARCHAR(500),
    impactoRiesgo VARCHAR(500),
    planRespuesta VARCHAR(500),
    estado VARCHAR(100),
    activo tinyint NOT NULL,
    FOREIGN KEY (idCatalogo) REFERENCES CatalogoRiesgo(idCatalogo)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS Riesgo;
CREATE TABLE Riesgo(
    idRiesgo INT AUTO_INCREMENT PRIMARY KEY,
    nombreRiesgo VARCHAR(500),
    idCatalogo INT,
    idProbabilidad INT,
    idImpacto INT,
    fechaIdentificacion DATE,
    duenoRiesgo INT,
    detalleRiesgo VARCHAR(500),
    causaRiesgo VARCHAR(500),
    impactoRiesgo VARCHAR(500),
    estado VARCHAR(100),
    activo tinyint NOT NULL,
    FOREIGN KEY (idCatalogo) REFERENCES CatalogoRiesgo(idCatalogo),
    FOREIGN KEY (idProbabilidad) REFERENCES RiesgoProbabilidad (idProbabilidad),
    FOREIGN KEY (idImpacto) REFERENCES RiesgoProbabilidad (idImpacto)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS RiesgoXResponsable;
CREATE TABLE RiesgoXResponsable(
    idRiesgoXResponsable INT AUTO_INCREMENT PRIMARY KEY,
    idRiesgo INT,
    idResponsable INT,
    activo tinyint NOT NULL,
    FOREIGN KEY (idRiesgo) REFERENCES Riesgo (idRiesgo),
    FOREIGN KEY (idResponsable) REFERENCES Usuario (idUsuario)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS PlanRespuesta;
CREATE TABLE PlanRespuesta(
    idPlanRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    idRiesgo INT,
    descripcion VARCHAR(500),
    activo tinyint NOT NULL,
    FOREIGN KEY (idRiesgo) REFERENCES Riesgo (idRiesgo)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS PlanContingencia;
CREATE TABLE PlanContingencia(
    idPlanContingencia INT AUTO_INCREMENT PRIMARY KEY,
    idRiesgo INT,
    descripcion VARCHAR(500),
    activo tinyint NOT NULL,
    FOREIGN KEY (idRiesgo) REFERENCES Riesgo (idRiesgo)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS RiesgoProbabilidad;
CREATE TABLE RiesgoProbabilidad(
    idProbabilidad INT AUTO_INCREMENT PRIMARY KEY,
    nombreProbabilidad VARCHAR(200),
    valorProbabilidad DOUBLE,
    activo tinyint NOT NULL
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS RiesgoImpacto;
CREATE TABLE RiesgoImpacto(
    idImpacto INT AUTO_INCREMENT PRIMARY KEY,
    nombreImpacto VARCHAR(200),
    valorImpacto DOUBLE,
    activo tinyint NOT NULL
)
ENGINE = InnoDB;


-----------------------
-- Catalogo de Riesgos
-----------------------

DROP TABLE IF EXISTS Interesado;
CREATE TABLE Interesado(
    idInteresado INT AUTO_INCREMENT PRIMARY KEY,
    nombreCompleto VARCHAR(200),
    rolEnProyecto VARCHAR(200),
    organizacion VARCHAR(200),
    cargo VARCHAR(200),
    correo VARCHAR(200),
    telefeno VARCHAR(12),
    datosContacto VARCHAR(200),
    idNivelAutoridad INT,
    idNivelAdhesionActual INT,
    idNivelAdhesionDeseado INT,
    activo tinyint NOT NULL,
    FOREIGN KEY (idRiesgo) REFERENCES Riesgo (idRiesgo)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS Interesado;
CREATE TABLE Interesado(
    idInteresado INT AUTO_INCREMENT PRIMARY KEY,
    idCatalogoInteresado INT,
    nombreCompleto VARCHAR(200),
    rolEnProyecto VARCHAR(200),
    organizacion VARCHAR(200),
    cargo VARCHAR(200),
    correo VARCHAR(200),
    telefono VARCHAR(12),
    datosContacto VARCHAR(200),
    idNivelAutoridad INT,
    idNivelAdhesionActual INT,
    idNivelAdhesionDeseado INT,
    activo tinyint NOT NULL,
    FOREIGN KEY (idCatalogoInteresado) REFERENCES CatalogoInteresado (idCatalogoInteresado),
    FOREIGN KEY (idNivelAutoridad) REFERENCES InteresadoAutoridad (idInteresadoAutoridad),
    FOREIGN KEY (idNivelAdhesionActual) REFERENCES InteresadoAdhesion (idInteresadoAdhesionActual),
    FOREIGN KEY (idNivelAdhesionDeseado) REFERENCES InteresadoAdhesion (idInteresadoAdhesionActual)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS InteresadoAutoridad;
CREATE TABLE InteresadoAutoridad(
    idInteresadoAutoridad INT AUTO_INCREMENT PRIMARY KEY,
    nombreAutoridad VARCHAR(200),
    activo tinyint NOT NULL
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS InteresadoAdhesion;
CREATE TABLE InteresadoAdhesion(
    idInteresadoAdhesionActual INT AUTO_INCREMENT PRIMARY KEY,
    nombreAdhesion VARCHAR(200),
    activo tinyint NOT NULL
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS InteresadoRequerimiento;
CREATE TABLE InteresadoRequerimiento(
    idRequerimiento INT AUTO_INCREMENT PRIMARY KEY,
    idInteresado INT,
    descripcion VARCHAR(500),
    activo tinyint NOT NULL,
    FOREIGN KEY(idInteresado) REFERENCES Interesado (idInteresado)

)
ENGINE = InnoDB;

DROP TABLE IF EXISTS InteresadoEstrategia;
CREATE TABLE InteresadoEstrategia(
    idEstrategia INT AUTO_INCREMENT PRIMARY KEY,
    idInteresado INT,
    descripcion VARCHAR(500),
    activo tinyint NOT NULL,
    FOREIGN KEY(idInteresado) REFERENCES Interesado (idInteresado)

)
ENGINE = InnoDB;

-----------------------
-- Catalogo de Riesgos
-----------------------