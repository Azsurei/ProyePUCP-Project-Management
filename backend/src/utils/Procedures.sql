
-- -----------------------------------------------------
-- PROCEDURES
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS VERIFICAR_CUENTA_USUARIO;
DROP PROCEDURE IF EXISTS INSERTAR_CUENTA_USUARIO;
DROP PROCEDURE IF EXISTS INSERTAR_PROYECTO;
DROP PROCEDURE IF EXISTS LISTAR_PROYECTOS_X_ID_USUARIO;
/*Registrar*/
DROP PROCEDURE IF EXISTS INSERTAR_CUENTA_USUARIO;
DELIMITER $
CREATE PROCEDURE INSERTAR_CUENTA_USUARIO(
    IN _nombres VARCHAR(200),
    IN _apellidos VARCHAR(200),
    IN _correoElectronico VARCHAR(200),
    IN _password VARCHAR(200),
    IN _tieneCuentaGoogle TINYINT
)
BEGIN
	INSERT INTO Usuario(nombres,apellidos,correoElectronico,password,tieneCuentaGoogle,activo,Privilegios_idPrivilegios) 
    VALUES(_nombres, _apellidos, _correoElectronico, md5(_password),_tieneCuentaGoogle, true, 1);
    SELECT @@last_insert_id AS idUsuario;
END$

SELECT * FROM Usuario;
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

DROP PROCEDURE IF EXISTS CAMBIAR_PASSWORD_CUENTA_USUARIO;

DELIMITER $
CREATE PROCEDURE CAMBIAR_PASSWORD_CUENTA_USUARIO(
    IN _correo VARCHAR(255),
    IN _password VARCHAR(200)
)
BEGIN
	UPDATE Usuario 
    SET password = MD5(_password) 
    WHERE correoElectronico = _correo AND activo = 1;
END$

CALL CAMBIAR_PASSWORD_CUENTA_USUARIO('gabriel@gmail.com','HOLA AMIGOS de youtube');
SELECT * FROM Usuario;
DROP PROCEDURE IF EXISTS VERIFICAR_SI_CORREO_ES_DE_GOOGLE;

DELIMITER $
CREATE PROCEDURE VERIFICAR_SI_CORREO_ES_DE_GOOGLE(IN _correoElectronico VARCHAR(255))
BEGIN
	SELECT tieneCuentaGoogle FROM Usuario WHERE correoElectronico = _correoElectronico AND activo = 1;
END$

CALL VERIFICAR_SI_CORREO_ES_DE_GOOGLE('pruebaCorreo@gmail.com');

#########################################################
## Proyecto
#########################################################
DROP PROCEDURE INSERTAR_PROYECTO;
-- CAMBIAR PASSWORD

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
    IN _fechaFin DATE
)
BEGIN
	DECLARE _id_proyecto INT;
	INSERT INTO Proyecto(nombre,maxCantParticipantes,fechaInicio,fechaFin,fechaUltimaModificacion,activo) VALUES(_nombre,_maxCantParticipantes,_fechaInicio,_fechaFin,NOW(),1);
    SET _id_proyecto = @@last_insert_id;
    INSERT INTO UsuarioXRolXProyecto(idUsuario,idProyecto,idRol,fechaAsignacion,activo)VALUES(_idUsuario,_id_proyecto,1,NOW(),1);
    SELECT _id_proyecto AS idProyecto;
END$

DROP PROCEDURE LISTAR_PROYECTOS_X_ID_USUARIO;
DELIMITER $
CREATE PROCEDURE LISTAR_PROYECTOS_X_ID_USUARIO(IN _idUsuario INT)
BEGIN
	SELECT p.idProyecto, p.nombre, p.maxCantParticipantes, p.fechaInicio, p.fechaFin, p.fechaUltimaModificacion ,r.nombre as "nombrerol"
    FROM Proyecto p,UsuarioXRolXProyecto urp INNER JOIN Rol r ON r.idRol=urp.idRol WHERE p.idProyecto = urp.idProyecto AND urp.idUsuario = _idUsuario;
END$
DELIMITER $

DROP PROCEDURE IF EXISTS ELIMINAR_PROYECTO;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_PROYECTO`(
	IN _idProyecto INT
)
BEGIN
	UPDATE Proyecto SET activo = 0 WHERE idProyecto = _idProyecto;
END; //
DELIMITER ;

SELECT *FROM Proyecto;
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

#################################################
## BACKLOG
#################################################

-------------------------------------------------
-- Backlog
-------------------------------------------------

DROP PROCEDURE IF EXISTS INSERTAR_PRODUCT_BACKLOG;
DELIMITER $
CREATE PROCEDURE INSERTAR_PRODUCT_BACKLOG(
	IN  _idProyecto INT
)
BEGIN
	DECLARE _id_backlog INT;
	INSERT INTO ProductBacklog(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(1,_idProyecto,NOW(),1);
    SET _id_backlog = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,1,_id_backlog,1);
    SELECT _id_backlog AS idProductBacklog;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *FROM ProductBacklog pb WHERE _idProyecto = pb.idProyecto AND pb.activo =1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_PRODUCT_BACKLOG_X_ID_PRODUCT_BACKLOG;
DELIMITER //
/* ProductBacklog 85*/
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_PRODUCT_BACKLOG_X_ID_PRODUCT_BACKLOG`(
	IN _idProductBacklog INT
)
BEGIN
	UPDATE ProductBacklog SET activo = 0 WHERE idProductBacklog = _idProductBacklog;
    UPDATE Epica SET activo = 0 WHERE idProductBacklog = _idProductBacklog;
    UPDATE Sprint SET activo = 0 WHERE idProductBacklog = _idProductBacklog;
    UPDATE HistoriaDeUsuario SET activo = 0
        WHERE idEpica IN (
            SELECT idEpica FROM Epica WHERE idProductBacklog = _idProductBacklog
        );
END; //
DELIMITER ;


----------------------------------------------
-- Sprints
----------------------------------------------
DROP PROCEDURE IF EXISTS INSERTAR_SPRINT;
DELIMITER $
CREATE PROCEDURE INSERTAR_SPRINT(
	IN  _idProductBacklog INT,
    IN _descripcion VARCHAR(255),
    IN _fechaInicio DATE,
	IN _fechaFin DATE,
    IN _estado INT,
    IN _nombre VARCHAR(500)
)
BEGIN
	DECLARE _idSprint INT;
	INSERT INTO Sprint(idProductBacklog,descripcion,fechaInicio,fechaFin,estado,activo,nombre) 
    VALUES(_idProductBacklog,_descripcion,_fechaInicio,_fechaFin,_estado,1,_nombre);
    SET _idSprint = @@last_insert_id;
    SELECT _idSprint AS idSprint;
END$


DROP PROCEDURE IF EXISTS LISTAR_SPRINTS_X_ID_BACKLOG;
DELIMITER $
CREATE PROCEDURE LISTAR_SPRINTS_X_ID_BACKLOG(
	IN _idProductBacklog INT
)
BEGIN
	SELECT *FROM Sprint sp WHERE sp.idProductBacklog = _idProductBacklog AND sp.activo =1;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_ESTADO_SPRINT;
DELIMITER $
CREATE PROCEDURE MODIFICAR_ESTADO_SPRINT(
	IN _idSprint INT,
    IN _idEstado INT
)
BEGIN
	UPDATE Sprint SET estado=_idEstado WHERE idSPrint = _idSprint AND activo = 1;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_SPRINT;
DELIMITER $
CREATE PROCEDURE MODIFICAR_SPRINT(
	IN _idSprint INT,
    in _descripcion VARCHAR(255),
    IN _fechaInicio DATE,
    IN _fechaFin DATE,
    IN _idEstado INT,
    IN _nombre VARCHAR(500)
)
BEGIN
	UPDATE Sprint SET descripcion = _descripcion, fechaInicio = _fechaInicio, fechaFin = _fechaFin, estado = _idEstado, nombre=_nombre
    WHERE idSPrint = _idSprint AND activo = 1;
END$



DROP PROCEDURE IF EXISTS ELIMINAR_SPRINT;
DELIMITER $
CREATE PROCEDURE ELIMINAR_SPRINT(
	IN _idSprint INT
)
BEGIN
	UPDATE Sprint SET activo = 0 WHERE idSPrint = _idSprint AND activo = 1;
END$

SELECT * FROM Sprint;

----------------------------------------------
-- Epicas
----------------------------------------------
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


DROP PROCEDURE LISTAR_EPICAS_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_EPICAS_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *FROM Epica p WHERE p.idProductBacklog = (SELECT idProductBacklog FROM ProductBacklog b WHERE b.idProyecto = _idProyecto AND b.activo=1) 
    AND p.activo =1;
END$
SELECT * FROM Epica;
CALL LISTAR_EPICAS_X_ID_BACKLOG(73);
DROP PROCEDURE IF EXISTS LISTAR_EPICAS_X_ID_BACKLOG;
DELIMITER $
CREATE PROCEDURE LISTAR_EPICAS_X_ID_BACKLOG(
	IN _idBacklog INT
)
BEGIN
	SELECT e.idEpica, e.nombre, e.fechaCreacion FROM Epica e WHERE e.idProductBacklog = _idBacklog 
    AND e.activo =1;
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
    IN para VARCHAR(255),
    IN _idUsuarioCreador INT
)
BEGIN
	DECLARE _id_HU INT;
	INSERT INTO HistoriaDeUsuario(idEpica,idHistoriaPrioridad,idHistoriaEstado,descripcion,como,quiero,para,fechaCreacion,activo,idUsuarioCreador) 
    VALUES(_idEpica,_idHistoriaPrioridad,_idHistoriaEstado,descripcion,como,quiero,para,NOW(),1,_idUsuarioCreador);
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

DROP PROCEDURE IF EXISTS INSERTAR_EDT;
DELIMITER $
CREATE PROCEDURE INSERTAR_EDT(
	IN  _idProyecto INT,
    IN _nombre VARCHAR(255),
    IN _descripcion	VARCHAR(255),
    IN _idUsuarioCreacion INT,
    IN _hayResponsable TINYINT
)
BEGIN
	DECLARE _idEDT INT;
	INSERT INTO EDT(idHerramienta,idProyecto,nombre,descripcion,idUsuarioCreacion,fechaCreacion,hayResponsable,activo) 
    VALUES(2,_idProyecto,_nombre,_descripcion,_idUsuarioCreacion,NOW(),_hayResponsable,1);
    SET _idEDT = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,2,_idEDT,1);
    SELECT _idEDT AS idEDT;
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

DROP PROCEDURE IF EXISTS ELIMINAR_EDT_X_ID_EDT;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_EDT_X_ID_EDT`(
	IN _idEDT INT
)
BEGIN
	UPDATE EDT SET activo = 0 WHERE idEDT = _idEDT;
    UPDATE ComponenteEDT SET activo = 0 WHERE idEDT = _idEDT;
    UPDATE Entregable SET activo = 0
		WHERE idComponente IN (
			SELECT idComponente FROM ComponenteEDT WHERE idEDT = _idEDT
		);
    UPDATE ComponenteCriterioDeAceptacion SET activo = 0
		WHERE idComponenteEDT IN (
			SELECT idComponente FROM ComponenteEDT WHERE idEDT = _idEDT
		);
END; //
DELIMITER ;


/************************
    Usuarios
*************************/
DROP PROCEDURE LISTAR_USUARIOS_X_NOMBRE_CORREO;

DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_NOMBRE_CORREO(
    IN _nombreCorreo VARCHAR(255)
)
BEGIN
    SELECT u.idUsuario, u.nombres, u.apellidos, u.correoElectronico
    FROM Usuario u
    WHERE ( _nombreCorreo IS NULL OR (CONCAT(u.nombres, ' ', u.apellidos) LIKE CONCAT('%', _nombreCorreo, '%')) OR
    u.correoElectronico LIKE CONCAT('%', _nombreCorreo, '%')) 
    AND u.activo = 1;
END$

CALL LISTAR_USUARIOS_X_NOMBRE_CORREO('Aug');
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

CALL LISTAR_USUARIOS_X_ID_ROL_X_ID_PROYECTO(1,6);

CREATE PROCEDURE LISTAR_HERRAMIENTAS()
BEGIN
	SELECT * FROM Herramienta WHERE activo =1;
END$

DROP PROCEDURE LISTAR_USUARIOS_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT u.idUsuario, u.nombres, u.apellidos, u.correoElectronico, u.activo, u.imgLink, up.idUsuarioRolProyecto
	FROM Usuario AS u
    JOIN UsuarioXRolXProyecto AS up ON u.idUsuario = up.idUsuario
	WHERE up.idProyecto = _idProyecto AND up.activo=1;
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
	UPDATE HistoriaDeUsuario SET activo = 0 WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario;
    UPDATE HistoriaRequisito SET activo = 0 WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario;
    UPDATE HistoriaCriterioDeAceptacion SET activo = 0 WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario;
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
	IN _idUsuario INT,
    IN _nombre VARCHAR(255)
)
BEGIN
	SELECT p.idProyecto, p.nombre, p.maxCantParticipantes, p.fechaInicio, p.fechaFin, p.fechaUltimaModificacion , urp.fechaAsignacion 
    FROM Proyecto p, UsuarioXRolXProyecto urp WHERE p.nombre LIKE CONCAT('%',_nombre,'%') AND p.idProyecto = urp.idProyecto AND urp.idUsuario
    AND p.activo =1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_ACTA_CONSTITUCION;
DELIMITER $
CREATE PROCEDURE INSERTAR_ACTA_CONSTITUCION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idActaConstitucion INT;
	INSERT INTO ActaConstitucion(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(3,_idProyecto,curdate(),1);
    SET _idActaConstitucion = @@last_insert_id;
    INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,3,_idActaConstitucion,1);
    SELECT _idActaConstitucion AS idActaConstitucion;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_ACTA_CONSTITUCION_X_ID_ACTA_CONSTITUCION;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_ACTA_CONSTITUCION_X_ID_ACTA_CONSTITUCION`(
	IN _idActaConstitucion INT
)
BEGIN
	UPDATE ActaConstitucion SET activo = 0 WHERE idActaConstitucion = _idActaConstitucion;
    UPDATE DetalleAC SET activo = 0 WHERE idActaConstitucion = _idActaConstitucion;
    UPDATE InteresadoAC SET activo = 0 WHERE idActaConstitucion = _idActaConstitucion;
    UPDATE HitoAC SET activo = 0 WHERE idActaConstitucion = _idActaConstitucion;
END; //
DELIMITER ;


SELECT * FROM Herramienta;
#######################################################################
## ACTA REUNION
#######################################################################

-----------------------------------------------------------------------
-- ACTA REUNION
-----------------------------------------------------------------------

DROP PROCEDURE IF EXISTS INSERTAR_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE INSERTAR_ACTA_REUNION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idActaReunion INT;
	INSERT INTO ActaReunion(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(11,_idProyecto,curdate(),1);
    SET _idActaReunion = @@last_insert_id;
    INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,11,_idActaReunion,1);
    SELECT _idActaReunion AS idActaReunion;
END$

DROP PROCEDURE IF EXISTS LISTAR_ACTA_REUNION_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_ACTA_REUNION_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
    SELECT idActaReunion,fechaCreacion
    FROM ActaReunion 
    WHERE idProyecto = _idProyecto 
    AND activo=1;
END$

SELECT * FROM ActaReunion;


DROP PROCEDURE IF EXISTS ELIMINAR_ACTA_REUNION_X_ID_ACTA_REUNION;
DELIMITER //
CREATE PROCEDURE ELIMINAR_ACTA_REUNION_X_ID_ACTA_REUNION(_idActaReunion INT)
BEGIN
    -- Desactivar Acta de Reunión
    UPDATE ActaReunion SET activo = 0 WHERE idActaReunion = _idActaReunion;
    UPDATE LineaActaReunion SET activo = 0 WHERE idActaReunion = _idActaReunion;
    UPDATE ComentarioReunion SET activo = 0 
		WHERE idLineaActaReunion IN (
			SELECT idLineaActaReunion FROM LineaActaReunion WHERE idActaReunion = _idActaReunion
		);
    UPDATE TemaReunion SET activo = 0 
		WHERE idLineaActaReunion IN (
			SELECT idLineaActaReunion FROM LineaActaReunion WHERE idActaReunion = _idActaReunion
		);

    UPDATE ParticipanteXReunion SET activo = 0
		WHERE idLineaActaReunion IN (
			SELECT idLineaActaReunion FROM LineaActaReunion WHERE idActaReunion = _idActaReunion
		);
	UPDATE Acuerdo SET activo = 0
		WHERE idTemaReunion IN (
			SELECT idTemaReunion FROM TemaReunion
            WHERE idLineaActaReunion IN (
				SELECT idLineaActaReunion FROM LineaActaReunion WHERE idActaReunion = _idActaReunion
			)
		);
	UPDATE ResponsableAcuerdo SET activo = 0 
    WHERE idAcuerdo IN (
        SELECT idAcuerdo FROM Acuerdo 
        WHERE idTemaReunion IN (
            SELECT idTemaReunion FROM TemaReunion 
            WHERE idLineaActaReunion IN (
                SELECT idLineaActaReunion FROM LineaActaReunion WHERE idActaReunion = _idActaReunion
            )
        )
    );
END //
DELIMITER ;

--------------------------
--   LINEA ACTA REUNION
--------------------------

DROP PROCEDURE IF EXISTS INSERTAR_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE INSERTAR_LINEA_ACTA_REUNION(
    IN _idActaReunion INT,
    IN _nombreReunion VARCHAR(255),
    IN _fechaReunion DATE,
    IN _horaReunion TIME,
    IN _nombreConvocante VARCHAR(255),
    IN _motivo 	VARCHAR(255)
)
BEGIN
	DECLARE _idLineaActaReunion INT;
    
	INSERT INTO LineaActaReunion(idActaReunion,nombreReunion,fechaReunion,horaReunion,nombreConvocante,motivo,activo)
    VALUES(_idActaReunion,_nombreReunion,_fechaReunion,_horaReunion,_nombreConvocante,_motivo,1);
    
    SET _idLineaActaReunion = @@last_insert_id;
    SELECT _idLineaActaReunion AS idLineaActaReunion;
END$

DROP PROCEDURE IF EXISTS LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(
    IN _idActaReunion INT
)
BEGIN
    SELECT *
    FROM LineaActaReunion 
    WHERE idActaReunion = _idActaReunion 
    AND activo=1;
END$

CALL LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(1)

DROP PROCEDURE IF EXISTS LISTAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION(
    IN _idLineaActaReunion INT
)
BEGIN
    SELECT *
    FROM LineaActaReunion 
    WHERE idLineaActaReunion = _idLineaActaReunion 
    AND activo=1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE ELIMINAR_LINEA_ACTA_REUNION_X_ID_LINEA_ACTA_REUNION(_idLineaActaReunion INT)
BEGIN
    -- Desactivar Responsables de Acuerdos relacionados
    UPDATE ResponsableAcuerdo ra
    JOIN Acuerdo a ON ra.idAcuerdo = a.idAcuerdo
    JOIN TemaReunion tr ON a.idTemaReunion = tr.idTemaReunion
    SET ra.activo = 0
    WHERE tr.idLineaActaReunion = _idLineaActaReunion;

    -- Desactivar Acuerdos relacionados
    UPDATE Acuerdo a
    JOIN TemaReunion tr ON a.idTemaReunion = tr.idTemaReunion
    SET a.activo = 0
    WHERE tr.idLineaActaReunion = _idLineaActaReunion;

    -- Desactivar Temas de Reunión relacionados
    UPDATE TemaReunion SET activo = 0
    WHERE idLineaActaReunion = _idLineaActaReunion;

    -- Desactivar Comentarios de Reunión relacionados
    UPDATE ComentarioReunion SET activo = 0
    WHERE idLineaActaReunion = _idLineaActaReunion;

    -- Desactivar Participantes por Reunión relacionados
    UPDATE ParticipanteXReunion SET activo = 0
    WHERE idLineaActaReunion = _idLineaActaReunion;

    -- Desactivar la Línea de Acta
    UPDATE LineaActaReunion SET activo = 0 WHERE idLineaActaReunion = _idLineaActaReunion;
END $


DROP PROCEDURE IF EXISTS MODIFICAR_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE MODIFICAR_LINEA_ACTA_REUNION(
    IN _idLineaActaReunion INT,
    IN _nombreReunion VARCHAR(255),
    IN _fechaReunion DATE,
    IN _horaReunion TIME,
    IN _nombreConvocante VARCHAR(255),
    IN _motivo 	VARCHAR(255)
)
BEGIN 
	UPDATE LineaActaReunion 
    SET 
    nombreReunion = _nombreReunion, 
    fechaReunion = _fechaReunion,
    horaReunion = _horaReunion,
    nombreConvocante = _nombreConvocante,
    motivo = _motivo
    WHERE idLineaActaReunion = _idLineaActaReunion AND activo = 1;
END$
--------------------------
--  TEMA REUNION
--------------------------

DROP PROCEDURE IF EXISTS INSERTAR_TEMA_REUNION;
DELIMITER $
CREATE PROCEDURE INSERTAR_TEMA_REUNION(
    IN _idLineaActaReunion INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	DECLARE _idTemaReunion INT;
    
	INSERT INTO TemaReunion(idLineaActaReunion,descripcion,activo)
    VALUES(_idLineaActaReunion,_descripcion,1);
    
    SET _idTemaReunion = @@last_insert_id;
    SELECT _idTemaReunion AS idTemaReunion;
END$

DROP PROCEDURE IF EXISTS LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(
    IN _idLineaActaReunion INT
)
BEGIN
    SELECT *
    FROM TemaReunion 
    WHERE idLineaActaReunion = _idLineaActaReunion 
    AND activo=1;
END$

CALL INSERTAR_TEMA_REUNION(1, 'Discusión sobre el plan de proyecto');
CALL LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(1)

DROP PROCEDURE IF EXISTS MODIFICAR_TEMA_REUNION;
DELIMITER $
CREATE PROCEDURE MODIFICAR_TEMA_REUNION(
    IN _idTemaReunion INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	UPDATE TemaReunion 
    SET descripcion = _descripcion
    WHERE idTemaReunion = _idTemaReunion AND activo =1;
    SELECT _idTemaReunion AS idTemaReunion;
END$
----------------------
-- Acuerdo
----------------------

#####################
## RESTANTE: COMPLETAR LOS INSERT Y LISTAR DE TODA LA LOGICA DE ACTA REUNION Y CREAR LOS CONTROLLERS POR CADA TABLA
#####################

DROP PROCEDURE IF EXISTS INSERTAR_ACUERDO;
DELIMITER $
CREATE PROCEDURE INSERTAR_ACUERDO(
    IN _idTemaReunion INT,
    IN _descripcion VARCHAR(500),
    IN _fechaObjetivo  DATE
)
BEGIN
	DECLARE _idAcuerdo INT;
    
	INSERT INTO Acuerdo(idTemaReunion,descripcion,fechaObjetivo,activo)
    VALUES(_idTemaReunion,_descripcion,_fechaObjetivo,1);
    
    SET _idAcuerdo = @@last_insert_id;
    SELECT _idAcuerdo AS idAcuerdo;
END$

CALL INSERTAR_ACUERDO(1, 'Ejemplo de descripción', '2023-10-23');


DROP PROCEDURE IF EXISTS LISTAR_ACUERDO_X_ID_TEMA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_ACUERDO_X_ID_TEMA_REUNION(
    IN _idTemaReunion INT
)
BEGIN
    SELECT *
    FROM Acuerdo 
    WHERE idTemaReunion = _idTemaReunion 
    AND activo=1;
END$

CALL LISTAR_ACUERDO_X_ID_TEMA_REUNION(1);

DROP PROCEDURE IF EXISTS MODIFICAR_ACUERDO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_ACUERDO(
    IN _idAcuerdo INT,
    IN _descripcion VARCHAR(500),
    IN _fechaObjetivo  DATE
)
BEGIN
	UPDATE Acuerdo 
    SET descripcion = _descripcion, fechaObjetivo = _fechaObjetivo
    WHERE idAcuerdo = _idAcuerdo AND activo =1;
    SELECT _idAcuerdo AS idAcuerdo;
END$
--------------------------
-- Responsables de acuerdo
--------------------------


DROP PROCEDURE IF EXISTS INSERTAR_RESPONSABLE_ACUERDO;
DELIMITER $
CREATE PROCEDURE INSERTAR_RESPONSABLE_ACUERDO(
    IN _idAcuerdo INT,
    IN _idUsuarioXRolXProyecto INT
)
BEGIN
	DECLARE _idResponsableAcuerdo INT;
    
	INSERT INTO ResponsableAcuerdo(idAcuerdo,idUsuarioXRolXProyecto,activo)
    VALUES(_idAcuerdo,_idUsuarioXRolXProyecto,1);
    
    SET _idResponsableAcuerdo = @@last_insert_id;
    SELECT _idResponsableAcuerdo AS idResponsableAcuerdo;
END$
SELECT * FROM UsuarioXRolXProyecto;
CALL INSERTAR_RESPONSABLE_ACUERDO(1, 60);

SELECT * FROM UsuarioXRolXProyecto;

DROP PROCEDURE IF EXISTS LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO;
DELIMITER $
CREATE PROCEDURE LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(
    IN _idAcuerdo INT
)
BEGIN
    SELECT ra.idResponsableAcuerdo,urp.idUsuarioRolProyecto,u.idUsuario, u.nombres, u.apellidos, u.correoElectronico,u.imgLink
    FROM ResponsableAcuerdo ra INNER JOIN UsuarioXRolXProyecto urp ON ra.idUsuarioXRolXProyecto  = urp.idUsuarioRolProyecto 
    INNER JOIN Usuario u ON u.idUsuario = urp.idUsuario
    WHERE ra.idAcuerdo = _idAcuerdo 
    AND ra.activo=1;
END$

CALL LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(1)


##############################################################
## FALTA EL LISTAR USUARIOS X ROL X PROYECTO PREGUNTAR LOGICA
##############################################################
DROP PROCEDURE IF EXISTS MODIFICAR_RESPONSABLE_ACUERDO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_RESPONSABLE_ACUERDO(
    IN _idResponsableAcuerdo INT,
    IN _idUsuarioXRolXProyecto INT
)
BEGIN
	UPDATE ResponsableAcuerdo 
    SET idUsuarioXRolXProyecto = _idUsuarioXRolXProyecto
    WHERE idResponsableAcuerdo = _idResponsableAcuerdo AND activo =1;
    SELECT _idResponsableAcuerdo AS idResponsableAcuerdo;
END$
-------------------------
-- Comentario Reunion
-------------------------
DROP PROCEDURE IF EXISTS INSERTAR_COMENTARIO_REUNION;
DELIMITER $
CREATE PROCEDURE INSERTAR_COMENTARIO_REUNION(
    IN _idLineaActaReunion INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	DECLARE _idComentarioReunion INT;
    
	INSERT INTO ComentarioReunion(idLineaActaReunion,descripcion,activo)
    VALUES(_idLineaActaReunion,_descripcion,1);
    
    SET _idComentarioReunion = @@last_insert_id;
    SELECT _idComentarioReunion AS idComentarioReunion;
END$

CALL INSERTAR_COMENTARIO_REUNION(1,'Primer comentario')

DROP PROCEDURE IF EXISTS LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(
    IN _idLineaActaReunion INT
)
BEGIN
    SELECT *
    FROM ComentarioReunion 
    WHERE idLineaActaReunion = _idLineaActaReunion 
    AND activo=1;
END$

CALL LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(1);

DROP PROCEDURE IF EXISTS MODIFICAR_COMENTARIO_REUNION;
DELIMITER $
CREATE PROCEDURE MODIFICAR_COMENTARIO_REUNION(
    IN _idComentarioReunion INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	UPDATE ComentarioReunion 
    SET descripcion = _descripcion
    WHERE idComentarioReunion = _idComentarioReunion AND activo =1;
    SELECT _idComentarioReunion AS idComentarioReunion;
END$
--------------------------------------
-- PARTICIPANTE X REUNION
--------------------------------------

DROP PROCEDURE IF EXISTS INSERTAR_PARTICIPANTE_X_REUNION;
DELIMITER $
CREATE PROCEDURE INSERTAR_PARTICIPANTE_X_REUNION(
    IN _idLineaActaReunion INT,
    IN _idUsuarioXRolXProyecto INT,
    IN _asistio TINYINT
)
BEGIN
	DECLARE _idParticipanteXReunion INT;
    
	INSERT INTO ParticipanteXReunion(idLineaActaReunion,idUsuarioXRolXProyecto,asistio,activo)
    VALUES(_idLineaActaReunion,_idUsuarioXRolXProyecto,_asistio,1);
    
    SET _idParticipanteXReunion = @@last_insert_id;
    SELECT _idParticipanteXReunion AS idParticipanteXReunion;
END$

CALL INSERTAR_PARTICIPANTE_X_REUNION(1, 2, 1);
CALL INSERTAR_PARTICIPANTE_X_REUNION(1, 20, 1);

DROP PROCEDURE IF EXISTS LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION;
DELIMITER $
CREATE PROCEDURE LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(
    IN _idLineaActaReunion INT
)
BEGIN
    SELECT pr.idParticipanteXReunion,urp.idUsuarioRolProyecto, u.idUsuario, u.nombres, u.apellidos, u.correoElectronico, u.usuario, u.imgLink,pr.asistio
    FROM ParticipanteXReunion pr INNER JOIN UsuarioXRolXProyecto urp ON pr.idUsuarioXRolXProyecto  = urp.idUsuarioRolProyecto
    INNER JOIN Usuario u ON u.idUsuario = urp.idUsuario 
    WHERE pr.idLineaActaReunion = _idLineaActaReunion AND pr.activo=1;
END$


SELECT * FROM LineaActaReunion;
DROP PROCEDURE IF EXISTS MODIFICAR_PARTICIPANTE_X_REUNION;
DELIMITER $
CREATE PROCEDURE MODIFICAR_PARTICIPANTE_X_REUNION(
    IN _idParticipanteXReunion INT,
    IN _asistio TINYINT
)
BEGIN
	UPDATE ParticipanteXReunion 
    SET asistio = _asistio
    WHERE idParticipanteXReunion = _idParticipanteXReunion AND activo =1;
    SELECT _idParticipanteXReunion AS idParticipanteXReunion;
END$


######################
## RETROSPECTIVA
######################
-----------------
-- RETROSPECTIVA
-----------------
DROP PROCEDURE IF EXISTS INSERTAR_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE INSERTAR_RETROSPECTIVA(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idRetrospectiva INT;
	INSERT INTO Retrospectiva(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(10,_idProyecto,curdate(),1);
    SET _idRetrospectiva = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,10,_idRetrospectiva,1);
    SELECT _idRetrospectiva AS idRetrospectiva;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_RETROSPECTIVA_X_ID_RETROSPECTIVA;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_RETROSPECTIVA_X_ID_RETROSPECTIVA`(
	IN _idRetrospectiva INT
)
BEGIN
	UPDATE Retrospectiva SET activo = 0 WHERE idRetrospectiva = _idRetrospectiva;
	UPDATE LineaRetrospectiva SET activo = 0 WHERE idRetrospectiva = _idRetrospectiva;
    UPDATE ItemLineaRetrospectiva SET activo = 0
		WHERE idLineaRetrospectiva IN (
			SELECT idLineaRetrospectiva FROM LineaRetrospectiva WHERE idRetrospectiva = _idRetrospectiva
        );
END; //
DELIMITER ;

----------------------
-- Linea Retrospectiva
----------------------

DROP PROCEDURE IF EXISTS INSERTAR_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE INSERTAR_LINEA_RETROSPECTIVA(
    IN _idRetrospectiva INT,
    IN _idSprint INT,
    IN _titulo VARCHAR(255),
    IN _cantBien INT,
    IN _cantMal INT,
    IN _cantQueHacer INT
)
BEGIN
	DECLARE _idLineaRetrospectiva INT;
	INSERT INTO LineaRetrospectiva(idRetrospectiva,idSprint,titulo,cantBien,cantMal,cantQueHacer,fechaCreacion,activo) 
    VALUES(_idRetrospectiva,_idSprint,_titulo,_cantBien,_cantMal,_cantQueHacer,curdate(),1);
    SET _idLineaRetrospectiva = @@last_insert_id;
    SELECT _idLineaRetrospectiva AS idLineaRetrospectiva;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE MODIFICAR_LINEA_RETROSPECTIVA(
    IN _idLineaRetrospectiva INT,
	IN _idSprint INT,
    IN _titulo VARCHAR(255),
    IN _cantBien INT,
    IN _cantMal INT,
    IN _cantQueHacer INT
)
BEGIN
	UPDATE LineaRetrospectiva
    SET cantBien = _cantBien, cantMal = _cantMal, cantQueHacer = _cantQueHacer, idSprint = _idSprint, titulo = _titulo
    WHERE idLineaRetrospectiva = _idLineaRetrospectiva AND activo =1;
END$

CALL INSERTAR_LINEA_RETROSPECTIVA(34,93,3,1,2);

select * from LineaRetrospectiva;

DROP PROCEDURE IF EXISTS LISTAR_LINEA_RETROSPECTIVA_X_ID_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_RETROSPECTIVA_X_ID_RETROSPECTIVA(
    IN _idRetrospectiva INT
)
BEGIN
    SELECT lr.idLineaRetrospectiva,lr.idSprint,lr.titulo,lr.cantBien, lr.cantMal,lr.cantQueHacer
    FROM LineaRetrospectiva lr 
    WHERE lr.idRetrospectiva = _idRetrospectiva 
    AND lr.activo=1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA(
    IN _idLineaRetrospectiva INT
)
BEGIN
	UPDATE LineaRetrospectiva
    SET activo = 0 WHERE idLineaRetrospectiva = _idLineaRetrospectiva;
END$
------------------------------------
-- Criterios Retrospectiva
------------------------------------
DROP PROCEDURE IF EXISTS LISTAR_CRITERIOS_RETROSPECTIVA_TODOS;
DELIMITER $
CREATE PROCEDURE LISTAR_CRITERIOS_RETROSPECTIVA_TODOS()
BEGIN
    SELECT idCriterioRetrospectiva, descripcion FROM CriterioRetrospectiva
    WHERE activo = 1;
END$

SELECT * FROM ItemLineaRetrospectiva;
SELECT * FROM Sprint;
------------------------------------
-- ItemLineaRetrospectiva
------------------------------------

DROP PROCEDURE IF EXISTS INSERTAR_ITEM_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE INSERTAR_ITEM_LINEA_RETROSPECTIVA(
    IN _idLineaRetrospectiva INT,
    IN _idCriterioRetrospectiva INT,
    IN _descripcion VARCHAR(255)
)
BEGIN
	DECLARE _idItemLineaRetrospectiva INT;
	INSERT INTO ItemLineaRetrospectiva(idLineaRetrospectiva,idCriterioRetrospectiva,descripcion,fechaCreacion,activo) 
    VALUES(_idLineaRetrospectiva,_idCriterioRetrospectiva,_descripcion,curdate(),1);
    SET _idItemLineaRetrospectiva = @@last_insert_id;
    SELECT _idItemLineaRetrospectiva AS idItemLineaRetrospectiva;
END$



DROP PROCEDURE IF EXISTS LISTAR_ITEM_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA_CRITERIO;
DELIMITER $
CREATE PROCEDURE LISTAR_ITEM_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA_CRITERIO(
    IN _idLineaRetrospectiva INT,
    IN _idCriterioRetrospectiva INT
)
BEGIN
    SELECT ilr.idItemLineaRetrospectiva,ilr.descripcion
    FROM ItemLineaRetrospectiva ilr
    WHERE ilr.idLineaRetrospectiva = _idLineaRetrospectiva AND ilr.idCriterioRetrospectiva = _idCriterioRetrospectiva 
    AND ilr.activo=1;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_ITEM_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE MODIFICAR_ITEM_LINEA_RETROSPECTIVA(
    IN _idItemLineaRetrospectiva INT,
    IN _descripcion VARCHAR(255)
)
BEGIN
	UPDATE ItemLineaRetrospectiva
    SET descripcion = _descripcion WHERE idItemLineaRetrospectiva = _idItemLineaRetrospectiva AND activo = 1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_ITEM_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_ITEM_LINEA_RETROSPECTIVA(
    IN _idItemLineaRetrospectiva INT
)
BEGIN
	UPDATE ItemLineaRetrospectiva
    SET activo = 0 WHERE idItemLineaRetrospectiva = _idItemLineaRetrospectiva;
END$

SELECT * FROM ItemLineaRetrospectiva;

DROP PROCEDURE IF EXISTS ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_ITEM_LINEA_RETROSPECTIVA_X_ID_LINEA_RETROSPECTIVA(
    IN _idLineaRetrospectiva INT
)
BEGIN
	UPDATE ItemLineaRetrospectiva
    SET activo = 0 WHERE idLineaRetrospectiva = _idLineaRetrospectiva;
END$

#############################
## AUTOEVALUACION
#############################

DROP PROCEDURE IF EXISTS INSERTAR_AUTOEVALUACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_AUTOEVALUACION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idAutoevaluacion INT;
	INSERT INTO Autoevaluacion(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(9,_idProyecto,curdate(),1);
    SET _idAutoevaluacion = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,9,_idAutoevaluacion,1);
    SELECT _idAutoevaluacion AS idAutoevaluacion;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_AUTOEVALUACION_X_ID_AUTOEVALUACION;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_AUTOEVALUACION_X_ID_AUTOEVALUACION`(
	IN _idAutoevaluacion INT
)
BEGIN
	UPDATE Autoevaluacion SET activo = 0 WHERE idAutoevaluacion = _idAutoevaluacion;
	UPDATE AutoEvaluacionXProyecto SET estado = 2 WHERE idAutoevaluacion = _idAutoevaluacion;
END; //
DELIMITER ;

DROP PROCEDURE IF EXISTS INSERTAR_HERRAMIENTA_X_PROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_HERRAMIENTA_X_PROYECTO(
    IN _idProyecto INT,
    IN _idHerramienta INT,
    IN _idHerramientaCreada INT
)
BEGIN
	DECLARE _idHerramientaXProyecto INT;
	INSERT INTO HerramientaXProyecto(idProyecto, idHerramienta,idHerramientaCreada, activo) 
    VALUES(_idProyecto,_idHerramienta,_idHerramientaCreada,1);
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
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,4,_idCronograma,1);
    SELECT _idCronograma AS idCronograma;
END$

DROP PROCEDURE IF EXISTS LISTAR_CRONOGRAMA_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_CRONOGRAMA_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
    SELECT idCronograma, fechaInicio, fechaFin 
    FROM Cronograma 
    WHERE idProyecto = _idProyecto 
    AND activo=1;
END$

DROP PROCEDURE IF EXISTS ACTUALIZAR_CRONOGRAMA;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_CRONOGRAMA(
    IN _idProyecto INT,
    IN _fechaInicio DATE,
    IN _fechaFin DATE
)
BEGIN
    UPDATE Cronograma
    SET 
        fechaInicio = _fechaInicio,
        fechaFin = _fechaFin
    WHERE idProyecto = (SELECT p.idProyecto  FROM Proyecto p WHERE p.idProyecto = _idProyecto);
END $

DROP PROCEDURE IF EXISTS ELIMINAR_CRONOGRAMA_X_ID_CRONOGRAMA;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_CRONOGRAMA_X_ID_CRONOGRAMA`(
	IN _idCronograma INT
)
BEGIN
	UPDATE Cronograma SET activo = 0 WHERE idCronograma = _idCronograma;
    UPDATE Tarea SET activo = 0 WHERE idCronograma = _idCronograma;
	UPDATE UsuarioXTarea SET activo = 0
		WHERE idTarea IN (
			SELECT idTarea FROM Tarea WHERE idCronograma = _idCronograma
        );
END; //
DELIMITER ;

DROP PROCEDURE IF EXISTS INSERTAR_AUTOEVALUACION_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_AUTOEVALUACION_X_IDPROYECTO(
    IN _idProyecto INT,
    IN _nombre VARCHAR(500),
    IN _fechaInicio DATE,
    IN _fechaFin DATE
)
BEGIN
	DECLARE _idAutoEvaluacionXProyecto INT;
    SET @_idAutoevaluacion = (SELECT idAutoevaluacion FROM Autoevaluacion WHERE idProyecto = _idProyecto AND activo = 1);
    INSERT INTO AutoEvaluacionXProyecto(idAutoevaluacion,nombre,fechaInicio,fechaFin,estado) 
    VALUES(@_idAutoevaluacion,_nombre,_fechaInicio,_fechaFin,0);
    SET _idAutoEvaluacionXProyecto = @@last_insert_id;
    SELECT _idAutoEvaluacionXProyecto AS idAutoEvaluacionXProyecto;
END$

---------------------------------------
-- Tarea
---------------------------------------
DROP PROCEDURE IF EXISTS INSERTAR_TAREA;
DELIMITER $
CREATE DEFINER=`admin`@`%` PROCEDURE `INSERTAR_TAREA`(
	IN _idCronograma INT,
    IN _idTareaEstado INT,
    IN _idEquipo INT,
    IN _idPadre INT,
    IN _idTareaAnterior INT,
    IN _idSprint INT,
    IN _sumillaTarea VARCHAR(255),
    IN _descripcion VARCHAR(500),
    IN _fechaInicio DATE,
    IN _fechaFin DATE,
    IN _cantSubtareas INT,
    IN _cantPosteriores INT,
    IN _horasPlaneadas TIME,
    IN _esPosterior TINYINT,
    IN _idEntregable INT
)
BEGIN
	DECLARE _idTarea INT;
	DECLARE _posicionKanban INT;
    SELECT COALESCE(MAX(posicionKanban), -1) + 1  INTO _posicionKanban
	FROM Tarea T
    LEFT JOIN Cronograma CR ON CR.idCronograma = T.idCronograma
	WHERE CR.idCronograma = _idCronograma
	AND T.activo = 1 AND T.esPosterior = 0 AND CR.activo = 1;
    
	SET _posicionKanban = CASE WHEN _esPosterior = 1 THEN NULL ELSE _posicionKanban END;
    
	INSERT INTO Tarea(idCronograma,idTareaEstado,idEquipo,idPadre,idTareaAnterior,idSprint,sumillaTarea,descripcion,fechaInicio,fechaFin,cantSubTareas,cantPosteriores,horasPlaneadas,fechaUltimaModificacionEstado,esPosterior,idEntregable, posicionKanban, idColumnaKanban, activo) 
    VALUES(_idCronograma,_idTareaEstado,_idEquipo,_idPadre,_idTareaAnterior,_idSprint,_sumillaTarea,_descripcion,_fechaInicio,_fechaFin,_cantSubtareas,_cantPosteriores,_horasPlaneadas,curdate(),_esPosterior,_idEntregable, _posicionKanban, 0, 1);		
    SET _idTarea = @@last_insert_id;
    SELECT _idTarea AS idTarea;
END$

DROP PROCEDURE IF EXISTS LISTAR_TAREAS_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_TAREAS_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
	SELECT t.idTarea, t.idEquipo,t.idPadre,t.idTareaAnterior,t.sumillaTarea,t.descripcion,t.fechaInicio,t.fechaFin,t.cantSubTareas,t.cantPosteriores,t.horasPlaneadas ,t.fechaUltimaModificacionEstado,te.idTareaEstado,te.nombre as nombreTareaEstado, te.color as colorTareaEstado, t.esPosterior
    FROM Tarea t, TareaEstado te
    WHERE  t.idCronograma=  (SELECT c.idCronograma FROM Cronograma c WHERE c.idProyecto = _idProyecto) AND t.idTareaEstado = te.idTareaEstado
    AND t.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_TAREAS_X_ID_SPRINT;
DELIMITER $
CREATE PROCEDURE LISTAR_TAREAS_X_ID_SPRINT(
    IN _idSprint INT
)
BEGIN
	SELECT t.idTarea, t.idEquipo,t.idPadre,t.idTareaAnterior,t.idSprint,t.sumillaTarea,t.descripcion,t.fechaInicio,t.fechaFin,t.cantSubTareas,t.cantPosteriores,t.horasPlaneadas ,t.fechaUltimaModificacionEstado,te.idTareaEstado,te.nombre as nombreTareaEstado, te.color as colorTareaEstado, t.esPosterior
    FROM Tarea t, TareaEstado te
    WHERE  t.idSprint = _idSprint AND te.idTareaEstado = t.idTareaEstado
    AND t.activo=1;
END$


DROP PROCEDURE IF EXISTS LISTAR_TAREAS_SIN_SPRINT_X_ID_CRONOGRAMA;
DELIMITER $
CREATE PROCEDURE LISTAR_TAREAS_SIN_SPRINT_X_ID_CRONOGRAMA(
    IN _idCronograma INT
)
BEGIN
	SELECT t.idTarea, t.idEquipo,t.idPadre,t.idTareaAnterior,t.idSprint,t.sumillaTarea,t.descripcion,t.fechaInicio,t.fechaFin,t.cantSubTareas,t.cantPosteriores,t.horasPlaneadas ,t.fechaUltimaModificacionEstado,te.idTareaEstado,te.nombre as nombreTareaEstado, te.color as colorTareaEstado, t.esPosterior
    FROM Tarea t, TareaEstado te
    WHERE  t.idCronograma = _idCronograma AND t.idTareaEstado = te.idTareaEstado AND idSprint = 0
    AND t.activo=1;
END$
SELECT * FROM Tarea;
CALL LISTAR_TAREAS_SIN_SPRINT_X_ID_CRONOGRAMA(58);
CALL LISTAR_TAREAS_SIN_SPRINT_X_ID_CRONOGRAMA(56);
CALL LISTAR_TAREAS_X_ID_PROYECTO(44)

DROP PROCEDURE IF EXISTS MODIFICAR_TAREA;

DELIMITER $
CREATE PROCEDURE MODIFICAR_TAREA(
    IN _idTarea INT,
	IN _sumillaTarea VARCHAR(255),
    IN _descripcion VARCHAR(500),
    IN _idTareaEstado INT,
    IN _fechaInicio DATE,
    IN _fechaFin DATE,
    IN _idEquipo INT
)
BEGIN
	UPDATE Tarea SET sumillaTarea = _sumillaTarea, descripcion = _descripcion, idTareaEstado = _idTareaEstado,
    fechaInicio = _fechaInicio, fechaFin = _fechaFin, idEquipo = _idEquipo
    WHERE idTarea = _idTarea AND activo = 1;
END$

SELECT * FROM Tarea;

DROP PROCEDURE IF EXISTS MODIFICAR_TAREA_ID_SPRINT;
DELIMITER $
CREATE PROCEDURE MODIFICAR_TAREA_ID_SPRINT(
    IN _idTarea INT,
	IN _idSprint INT
)
BEGIN
	UPDATE Tarea SET idSprint = _idSprint
    WHERE idTarea = _idTarea AND activo = 1;
END$
--------------------------
-- Tarea Estado
--------------------------
DELIMITER $
CREATE PROCEDURE INSERTAR_TAREA_ESTADO(
	IN _nombre VARCHAR(255),
    IN _color VARCHAR(8)
)
BEGIN
	DECLARE _idTareaEstado INT;
	INSERT INTO TareaEstado(nombre,color,activo) 
    VALUES(_nombre,_color,1);		
    SET _idTareaEstado = @@last_insert_id;
    SELECT _idTareaEstado AS idTareaEstado;
END $


---------------------------------------
-- UsuarioXTarea
---------------------------------------

DELIMITER $
CREATE PROCEDURE INSERTAR_USUARIO_X_TAREA(
	IN _idUsuario INT,
    IN _idTarea INT
)
BEGIN
	DECLARE _idUsuarioXTarea INT;
	INSERT INTO UsuarioXTarea(idUsuario,idTarea,activo) 
    VALUES(_idUsuario,_idTarea,1);		
    SET _idUsuarioXTarea = @@last_insert_id;
    SELECT _idUsuarioXTarea AS idUsuarioXTarea;
END $


DROP PROCEDURE IF EXISTS LISTAR_USUARIOS_X_ID_TAREA;
DELIMITER $
CREATE PROCEDURE  LISTAR_USUARIOS_X_ID_TAREA(
    IN _idTarea INT
)
BEGIN
	SELECT u.idUsuario, u.nombres,u.apellidos, u.correoElectronico
    FROM Usuario u, UsuarioXTarea ut
    WHERE  u.idUsuario = ut.idUsuario AND _idTarea=ut.idTarea
    AND u.activo=1 AND ut.activo=1;
END$

CALL LISTAR_USUARIOS_X_ID_TAREA(3);
CALL LISTAR_TAREAS_X_ID_PROYECTO(45);
SELECT *FROM Usuario;
SELECT *FROM Cronograma;

UPDATE UsuarioXTarea SET activo = 0 WHERE idUsuarioXTarea = 1;
SELECT * FROM UsuarioXTarea;

-- ELimina todos los usuarios de una tarea
DROP PROCEDURE IF EXISTS ELIMINAR_USUARIOS_X_ID_TAREA;
DELIMITER $
CREATE PROCEDURE  ELIMINAR_USUARIOS_X_ID_TAREA(
    IN _idTarea INT
)
BEGIN
	DELETE FROM UsuarioXTarea WHERE idTarea = _idTarea AND activo =1;
END$

-- Elimina un usuario especifico de una tarea
DROP PROCEDURE IF EXISTS ELIMINAR_USUARIO_X_ID_TAREA;
DELIMITER $
CREATE PROCEDURE  ELIMINAR_USUARIO_X_ID_TAREA(
    IN _idTarea INT,
    IN _idUsuario INT
)
BEGIN
	UPDATE UsuarioXTarea SET activo = 0 
    WHERE idTarea = _idTarea AND idUsuario = _idUsuario AND activo =1;
END$


########################################33
## Equipo
########################################

DROP PROCEDURE LISTAR_EQUIPO_X_ID_EQUIPO;
DELIMITER $
CREATE PROCEDURE  LISTAR_EQUIPO_X_ID_EQUIPO(
    IN _idEquipo INT
)
BEGIN
	SELECT idEquipo,nombre,descripcion,fechaCreacion
    FROM Equipo
    WHERE  idEquipo = _idEquipo
    AND activo=1;
END$



CALL LISTAR_EQUIPO_X_ID_EQUIPO(2);

SELECT * FROM Tarea;
UPDATE Tarea SET idEQuipo = 1 WHERE idTarea = 2;

DROP PROCEDURE IF EXISTS INSERTAR_CATALOGO_RIESGO;
DELIMITER $
CREATE PROCEDURE INSERTAR_CATALOGO_RIESGO(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idCatalogo INT;
	INSERT INTO CatalogoRiesgo(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(5,_idProyecto,curdate(),1);		
    SET _idCatalogo = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,5,_idCatalogo,1);
    SELECT _idCatalogo AS idCatalogo;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_CATALOGO_RIESGOS_X_ID_CATALOGO_RIESGOS;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_CATALOGO_RIESGOS_X_ID_CATALOGO_RIESGOS`(
	IN _idCatalogo INT
)
BEGIN
	UPDATE CatalogoRiesgo SET activo = 0 WHERE idCatalogo = _idCatalogo;
    UPDATE Riesgo SET activo = 0 WHERE idCatalogo = _idCatalogo;
	UPDATE PlanContingencia SET activo = 0
		WHERE idRiesgo IN (
			SELECT idRiesgo FROM Riesgo WHERE idCatalogo = _idCatalogo
        );
	UPDATE PlanRespuesta SET activo = 0
		WHERE idRiesgo IN (
			SELECT idRiesgo FROM Riesgo WHERE idCatalogo = _idCatalogo
		);
	UPDATE RiesgoXResponsable SET activo = 0
		WHERE idRiesgo IN (
			SELECT idRiesgo FROM Riesgo WHERE idCatalogo = _idCatalogo
		);
END; //
DELIMITER ;


DROP PROCEDURE IF EXISTS INSERTAR_CATALOGO_INTERESADO;
DELIMITER $
CREATE PROCEDURE INSERTAR_CATALOGO_INTERESADO(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idCatalogoInteresado INT;
	INSERT INTO CatalogoInteresado(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(6,_idProyecto,curdate(),1);		
    SET _idCatalogoInteresado = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,6,_idCatalogoInteresado,1);
    SELECT _idCatalogoInteresado AS idCatalogoInteresado;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_CATALOGO_INTERESADOS_X_ID_CATALOGO_INTERESADOS;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_CATALOGO_INTERESADOS_X_ID_CATALOGO_INTERESADOS`(
	IN _idCatalogoInteresado INT
)
BEGIN
	UPDATE CatalogoInteresado SET activo = 0 WHERE idCatalogoInteresado = _idCatalogoInteresado;
    UPDATE Interesado SET activo = 0 WHERE idCatalogoInteresado = _idCatalogoInteresado;
	UPDATE InteresadoEstrategia SET activo = 0
		WHERE idInteresado IN (
			SELECT idInteresado FROM Interesado WHERE idCatalogoInteresado = _idCatalogoInteresado
        );
	UPDATE InteresadoRequerimiento SET activo = 0
		WHERE idInteresado IN (
			SELECT idInteresado FROM Interesado WHERE idCatalogoInteresado = _idCatalogoInteresado
		);
END; //
DELIMITER ;


DROP PROCEDURE IF EXISTS INSERTAR_MATRIZ_RESPONSABILIDAD;
DELIMITER $
CREATE PROCEDURE INSERTAR_MATRIZ_RESPONSABILIDAD(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idMatrizResponsabilidad INT;
	INSERT INTO MatrizResponsabilidad(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(7,_idProyecto,curdate(),1);	
    SET _idMatrizResponsabilidad = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,7,_idMatrizResponsabilidad,1);
    SELECT _idMatrizResponsabilidad AS idMatrizResponsabilidad;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_MATRIZ_RESPONSABILIDADES_X_ID_MATRIZ_R;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_MATRIZ_RESPONSABILIDADES_X_ID_MATRIZ_R`(
	IN _idMatrizResponsabilidad INT
)
BEGIN
	UPDATE MatrizResponsabilidad SET activo = 0 WHERE idMatrizResponsabilidad = _idMatrizResponsabilidad;
	UPDATE ResponsabilidadRol SET activo = 0 WHERE idMatrizResponsabilidad = _idMatrizResponsabilidad;
	UPDATE EntregableXResponsabilidadRol SET activo = 0
		WHERE idResponsabilidadRol IN (
			SELECT idResponsabilidadRol FROM ResponsabilidadRol WHERE idMatrizResponsabilidad = _idMatrizResponsabilidad
        );
END; //
DELIMITER ;


DROP PROCEDURE IF EXISTS INSERTAR_MATRIZ_COMUNICACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_MATRIZ_COMUNICACION(
    IN _idProyecto INT
)
BEGIN
	DECLARE _idMatrizComunicacion INT;
	INSERT INTO MatrizComunicacion(idHerramienta,idProyecto,fechaCreacion,activo) VALUES(8,_idProyecto,curdate(),1);		
    SET _idMatrizComunicacion = @@last_insert_id;
	INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo)VALUES(_idProyecto,8,_idMatrizComunicacion,1);
    SELECT _idMatrizComunicacion AS idMatrizComunicacion;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_MATRIZ_COMUNICACIONES_X_ID_MATRIZ_C;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_MATRIZ_COMUNICACIONES_X_ID_MATRIZ_C`(
	IN _idMatrizComunicacion INT
)
BEGIN
	UPDATE MatrizComunicacion SET activo = 0 WHERE idMatrizComunicacion = _idMatrizComunicacion;
	UPDATE Comunicacion SET activo = 0 WHERE idMatrizComunicacion = _idMatrizComunicacion;
END; //
DELIMITER ;

DROP PROCEDURE MODIFICAR_COMPONENTE_EDT;
--Modificar ComponenteEDT
DELIMITER $
CREATE PROCEDURE MODIFICAR_COMPONENTE_EDT(
    IN _idComponenteEDT int,
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
    UPDATE ComponenteEDT 
    SET idElementoPadre = _idElementoPadre,
        descripcion = _descripcion,
        codigo = _codigo,
        observaciones = _observaciones,
        nombre = _nombre,
        responsables = _responsables,
        fechaInicio = _fechaInicio,
        fechaFin = _fechaFin,
        recursos = _recursos,
        hito = _hito 
    WHERE idComponenteEDT = _idComponenteEDT;
    SELECT _idComponenteEDT AS idComponenteEDT;
END$

DELIMITER $
CREATE PROCEDURE INSERTAR_HISTORIA_REQUISITO
(   IN _idHistoriaDeUsuario INT,
	IN _descripcion VARCHAR(255)
)
BEGIN
	DECLARE _idHistoriaRequisito INT;
	INSERT INTO HistoriaRequisito(idHistoriaDeUsuario,descripcion,activo) VALUES(_idHistoriaDeUsuario,_descripcion,1);		
    SET _idHistoriaRequisito = @@last_insert_id;
    SELECT _idHistoriaRequisito AS idHistoriaRequisito;
END$

DELIMITER $
CREATE PROCEDURE ELIMINAR_COMPONENTEEDT(
    IN _idEDT INT,
    IN _codigo VARCHAR(255)
)
BEGIN
    UPDATE ComponenteEDT
    SET activo = 0
    WHERE idEDT = _idEDT
    AND codigo LIKE CONCAT(_codigo, '%');
END$
DELIMITER ;

DELIMITER $
CREATE PROCEDURE INSERTAR_HISTORIA_CRITERIO
(   IN _idHistoriaDeUsuario INT,
	IN _dadoQue VARCHAR(255),
    IN _cuando VARCHAR(255),
    IN _entonces VARCHAR(255),
    IN _escenario VARCHAR(255)
)
BEGIN
	DECLARE _idHistoriaCriterioDeAceptacion INT;
	INSERT INTO HistoriaCriterioDeAceptacion(idHistoriaDeUsuario,activo,dadoQue,cuando,entonces,escenario) VALUES(_idHistoriaDeUsuario,1,_dadoQue,_cuando,_entonces,_escenario);		
    SET _idHistoriaCriterioDeAceptacion = @@last_insert_id;
    SELECT _idHistoriaCriterioDeAceptacion AS idHistoriaCriterioDeAceptacion;
END$

DROP PROCEDURE IF EXISTS LISTAR_HERRAMIENTAS_X_PROYECTO_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_HERRAMIENTAS_X_PROYECTO_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
	SELECT idHerramienta ,idHerramientaCreada
    FROM HerramientaXProyecto 
    WHERE idProyecto = _idProyecto 
    AND activo=1
    ORDER BY idHerramienta;
END$

CALL LISTAR_HERRAMIENTAS_X_PROYECTO_X_ID_PROYECTO(50);

DROP PROCEDURE IF EXISTS LISTAR_USUARIOS_X_ID_ROL_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_ID_ROL_X_ID_PROYECTO(
    IN _idProyecto INT,
    IN _idRol INT
)
BEGIN
	SELECT u.idUsuario, u.nombres, u.apellidos FROM Usuario u, UsuarioXRolXProyecto urp WHERE u.idUsuario = urp.idUsuario AND urp.idProyecto = _idProyecto AND urp.idRol = _idRol AND urp.activo = 1;
END$


--------------------
-- Equipo
--------------------

DELIMITER $
CREATE PROCEDURE INSERTAR_EQUIPO(   
	IN _idProyecto INT,
    IN _nombre VARCHAR(200),
    IN _descripcion VARCHAR(500)
)
BEGIN
	DECLARE _idEquipo INT;
	INSERT INTO Equipo(idProyecto,nombre,descripcion,fechaCreacion,activo) VALUES(_idProyecto,_nombre,_descripcion,CURDATE(),1);		
    SET _idEquipo = @@last_insert_id;
    SELECT _idEquipo AS idEquipo;
END$
DROP PROCEDURE INSERTAR_USUARIO_X_EQUIPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_USUARIO_X_EQUIPO(   
	IN _idUsuario INT,
    IN _idEquipo INT
)
BEGIN
	DECLARE _idUsuarioXEquipo INT;
	INSERT INTO UsuarioXEquipo(idUsuario,idEquipo,activo) VALUES(_idUsuario,_idEquipo,1);		
    SET _idUsuarioXEquipo = @@last_insert_id;
    SELECT _idUsuarioXEquipo AS idUsuarioXEquipo;
END$

DROP PROCEDURE IF EXISTS LISTAR_EQUIPO_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE  LISTAR_EQUIPO_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
	SELECT e.idEquipo,e.nombre,e.descripcion,e.fechaCreacion
    FROM Equipo e
    WHERE e.idProyecto = _idProyecto
    AND e.activo=1;
END$

CALL LISTAR_EQUIPO_X_ID_PROYECTO(6)


DROP PROCEDURE IF EXISTS LISTAR_COMPONENTE_EDT;
DELIMITER $
CREATE PROCEDURE LISTAR_COMPONENTE_EDT(
    IN _idComponente INT
)
BEGIN
	SELECT * 
    FROM ComponenteEDT 
    WHERE idComponente = _idComponente
    AND activo=1;
END$
DROP PROCEDURE IF EXISTS LISTAR_CRITERIO_X_IDCOMPONENTE;
DELIMITER $
CREATE PROCEDURE LISTAR_CRITERIO_X_IDCOMPONENTE(
    IN _idComponente INT
)
BEGIN
	SELECT * 
    FROM ComponenteCriterioDeAceptacion 
    WHERE idComponenteEDT = _idComponente
    AND activo=1;
END$
DROP PROCEDURE IF EXISTS LISTAR_ENTREGABLE_X_IDCOMPONENTE;
DELIMITER $
CREATE PROCEDURE LISTAR_ENTREGABLE_X_IDCOMPONENTE(
    IN _idComponente INT
)
BEGIN
	SELECT * 
    FROM Entregable 
    WHERE idComponente = _idComponente
    AND activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_HU_X_ID;
DELIMITER $
CREATE PROCEDURE LISTAR_HU_X_ID(
    IN _idHistoriaDeUsuario INT
)
BEGIN
    SELECT HU.idHistoriaDeUsuario, HU.idEpica, E.nombre as "NombreEpica", HU.idHistoriaPrioridad, HP.nombre as "NombrePrioridad", HU.idHistoriaEstado, HE.descripcion as "DescripcionEstado",
    HU.descripcion, HU.como, HU.quiero, HU.para, HU.para, HU.activo, HU.fechaCreacion, HU.idUsuarioCreador, CONCAT(U.nombres, ' ', U.apellidos) AS "NombreUsuario", U.imgLink as "Imagen"
    FROM HistoriaDeUsuario HU
    JOIN Epica E
    ON HU.idEpica = E.idEpica
    JOIN HistoriaEstado HE
    ON HU.idHistoriaEstado = HE.idHistoriaEstado
    JOIN HistoriaPrioridad HP
    ON HU.idHistoriaPrioridad = HP.idHistoriaPrioridad
    JOIN Usuario U
    ON HU.idUsuarioCreador = U.idUsuario
    WHERE HU.idHistoriaDeUsuario = _idHistoriaDeUsuario
    AND HU.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_CRITERIO_X_IDHU;
DELIMITER $
CREATE PROCEDURE LISTAR_CRITERIO_X_IDHU(
    IN _idHistoriaDeUsuario INT
)
BEGIN
	SELECT * 
    FROM HistoriaCriterioDeAceptacion 
    WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario
    AND activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_REQUERIMIENTO_X_IDHU;
DELIMITER $
CREATE PROCEDURE LISTAR_REQUERIMIENTO_X_IDHU(
    IN _idHistoriaDeUsuario INT
)
BEGIN
	SELECT * 
    FROM HistoriaRequisito 
    WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario
    AND activo=1;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_ID_ROL_X_ID_PROYECTO(
    IN _idRol INT,
    IN _idProyecto INT
)
BEGIN
	SELECT u.idUsuario, u.nombres, u.apellidos, u.correOElectronico FROM UsuarioXRolXProyecto urp, Usuario u
    WHERE u.idUsuario = urp.idUsuario AND urp.idProyecto = _idProyecto AND urp.idRol = _idRol AND u.activo = 1;
END$

--EDITAR Historia de Usuario
DELIMITER $
CREATE PROCEDURE MODIFICAR_HISTORIA_CRITERIO
(   
    IN _idHistoriaDeUsuario INT,
    IN _idHistoriaCriterioDeAceptacion INT,
	IN _dadoQue VARCHAR(255),
    IN _cuando VARCHAR(255),
    IN _entonces VARCHAR(255),
    IN _escenario VARCHAR(255)
)
BEGIN
	UPDATE HistoriaCriterioDeAceptacion
    SET
        idHistoriaDeUsuario = _idHistoriaDeUsuario,
        dadoQue = _dadoQue,
        cuando = _cuando,
        entonces = _entonces,
        escenario = _escenario
    WHERE idHistoriaCriterioDeAceptacion = _idHistoriaCriterioDeAceptacion;
    SELECT _idHistoriaCriterioDeAceptacion AS idHistoriaCriterioDeAceptacion;
END$

DELIMITER $
CREATE PROCEDURE MODIFICAR_HISTORIA_REQUISITO
(   
    IN _idHistoriaDeUsuario INT,
    IN _idHistoriaRequisito INT,
	IN _descripcion VARCHAR(255)
)
BEGIN
	UPDATE HistoriaRequisito
    SET
        idHistoriaDeUsuario = _idHistoriaDeUsuario,
        descripcion = _descripcion
    WHERE idHistoriaRequisito = _idHistoriaRequisito;
    SELECT _idHistoriaRequisito AS idHistoriaRequisito;
END$

CREATE PROCEDURE MODIFICAR_HISTORIA_DE_USUARIO(
    IN _idHistoriaDeUsuario INT,
	IN  _idEpica INT,
    IN _idHistoriaPrioridad INT,
    IN _idHistoriaEstado INT,
	IN _descripcion VARCHAR(255),
    IN _como VARCHAR(255),
    IN _quiero VARCHAR(255),
    IN _para VARCHAR(255)
)
BEGIN
	UPDATE HistoriaDeUsuario
    SET
        idEpica = _idEpica,
        idHistoriaPrioridad = _idHistoriaPrioridad,
        idHistoriaEstado = _idHistoriaEstado,
        descripcion = _descripcion,
        como = _como,
        quiero = _quiero,
        para = _para
    WHERE idHistoriaDeUsuario = _idHistoriaDeUsuario;
    SELECT _idHistoriaDeUsuario AS idHistoriaDeUsuario;
END$

CREATE PROCEDURE LISTAR_USUARIOS_X_ROL_X_PROYECTO(
    IN _idRol INT,
    IN _idProyecto INT
)
BEGIN
	SELECT u.idUsuario, u.nombres, u.apellidos, u.correoElectronico FROM UsuarioXRolXProyecto urp, Usuario u
    WHERE u.idUsuario = urp.idUsuario AND urp.idProyecto = _idProyecto AND urp.idRol = _idRol AND u.activo = 1;
END


DROP PROCEDURE MODIFICAR_FECHA_CRONOGRAMA;
--Modificar fecha del cronograma
DELIMITER $
CREATE PROCEDURE MODIFICAR_FECHA_CRONOGRAMA(
    IN _idCronograma INT,
	IN  _fechaInicio DATE,
    IN _fechaFin DATE
)
BEGIN
    UPDATE Cronograma 
    SET fechaInicio = _fechaInicio,
        fechaFin = _fechaFin
    WHERE idCronograma = _idCronograma;
    SELECT _idCronograma AS idCronograma;
END$

DROP PROCEDURE INSERTAR_DETALLEAC_CREADO;
--Modificar fecha del cronograma
DELIMITER $
CREATE PROCEDURE INSERTAR_DETALLEAC_CREADO(
    IN _idActaConstitucion INT
)
BEGIN
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Propósito y Justificación del Proyecto", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Descripción del Proyecto y Entregables", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Presupuesto Estimado", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Premisas y Restricciones", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Riesgos Iniciales de Alto Nivel", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Requisitos de Aprobación del Proyecto", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Requerimientos de Alto Nivel", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Requerimientos del Producto", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Requerimientos del Proyecto", 1);
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES (_idActaConstitucion, "Elaborado por", 1);
END$

DROP PROCEDURE INSERTAR_DETALLEAC_INFO;
DELIMITER $
CREATE PROCEDURE INSERTAR_DETALLEAC_INFO(   
	IN _idUsuario INT,
    IN _idEquipo INT
)
BEGIN
	DECLARE _idUsuarioXEquipo INT;
	INSERT INTO UsuarioXEquipo(idUsuario,idEquipo,activo) VALUES(_idUsuario,_idEquipo,1);		
    SET _idUsuarioXEquipo = @@last_insert_id;
    SELECT _idUsuarioXEquipo AS idUsuarioXEquipo;
END$

DROP PROCEDURE ELIMINAR_EPICA_NOMBRE;
--Modificar fecha del cronograma
DELIMITER $
CREATE PROCEDURE ELIMINAR_EPICA_NOMBRE(
    IN _nombre VARCHAR(255)
)
BEGIN
    UPDATE Epica 
    SET activo = 0
    WHERE nombre = _nombre;
    SELECT _nombre AS nombre;
END$

DROP PROCEDURE INSERTAR_HU_CRITERIO_ACEPTACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_HU_CRITERIO_ACEPTACION(
	IN  _idHistoriaDeUsuario INT,
    IN _dadoQue VARCHAR(255),
    IN _cuando VARCHAR(255),
    IN _entonces VARCHAR(255),
    IN _escenario VARCHAR(255)
)
BEGIN
	DECLARE _idHistoriaCriterioDeAceptacion INT;
	INSERT INTO HistoriaCriterioDeAceptacion(idHistoriaDeUsuario,activo,dadoQue,cuando,entonces,escenario) 
    VALUES(_idHistoriaDeUsuario,1,_dadoQue,_cuando,_entonces,_escenario);
    SET _idHistoriaCriterioDeAceptacion = @@last_insert_id;
    SELECT _idHistoriaCriterioDeAceptacion AS idHistoriaCriterioDeAceptacion;
END$

DROP PROCEDURE ELIMINAR_HU_CRITERIO_ACEPTACION;
--Modificar fecha del cronograma
DELIMITER $
CREATE PROCEDURE ELIMINAR_HU_CRITERIO_ACEPTACION(
    IN _idHistoriaCriterioDeAceptacion INT
)
BEGIN
    UPDATE HistoriaCriterioDeAceptacion 
    SET activo = 0
    WHERE idHistoriaCriterioDeAceptacion = _idHistoriaCriterioDeAceptacion;
    SELECT _idHistoriaCriterioDeAceptacion AS idHistoriaCriterioDeAceptacion;
END$

DROP PROCEDURE INSERTAR_HU_REQUISITO;
DELIMITER $
CREATE PROCEDURE INSERTAR_HU_REQUISITO(
	IN  _idHistoriaDeUsuario INT,
    IN _descripcion VARCHAR(255)
)
BEGIN
	DECLARE _idHistoriaRequisito INT;
	INSERT INTO HistoriaRequisito(idHistoriaDeUsuario,descripcion,activo) 
    VALUES(_idHistoriaDeUsuario,_descripcion,1);
    SET _idHistoriaRequisito = @@last_insert_id;
    SELECT _idHistoriaRequisito AS idHistoriaRequisito;
END$

DROP PROCEDURE ELIMINAR_HU_REQUISITO;
--Modificar fecha del cronograma
DELIMITER $
CREATE PROCEDURE ELIMINAR_HU_REQUISITO(
    IN _idHistoriaRequisito INT
)
BEGIN
    UPDATE HistoriaRequisito 
    SET activo = 0
    WHERE idHistoriaRequisito = _idHistoriaRequisito;
    SELECT _idHistoriaRequisito AS idHistoriaRequisito;
END$

--Acta de Constitucion
DROP PROCEDURE LISTAR_ACTA_X_IDPROYECTO;
--Listar Datos principales
DELIMITER $
CREATE PROCEDURE LISTAR_ACTA_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
    SELECT * 
    FROM ActaConstitucion
    WHERE idProyecto = _idProyecto
    AND activo = 1;
END$

DROP PROCEDURE LISTAR_DETALLEAC_X_IDPROYECTO;
--Listar DETALLEAC
DELIMITER $
CREATE PROCEDURE LISTAR_DETALLEAC_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
    SELECT dac.idDetalle, dac.idActaConstitucion, dac.nombre, dac.detalle, dac.activo 
    FROM DetalleAC AS dac
    LEFT JOIN ActaConstitucion AS ac ON dac.idActaConstitucion = ac.idActaConstitucion
    WHERE ac.idProyecto = _idProyecto
    AND dac.activo = 1;
END$


DROP PROCEDURE LISTAR_ACTA_X_IDACTA;
--Listar Datos principales
DELIMITER $
CREATE PROCEDURE LISTAR_ACTA_X_IDACTA(
    IN _idActaConstitucion INT
)
BEGIN
    SELECT * 
    FROM ActaConstitucion
    WHERE idActaConstitucion = _idActaConstitucion
    AND activo = 1;
END$

DROP PROCEDURE LISTAR_DETALLEAC_X_IDACTA;
--Listar DETALLEAC
DELIMITER $
CREATE PROCEDURE LISTAR_DETALLEAC_X_IDACTA(
    IN _idActaConstitucion INT
)
BEGIN
    SELECT * 
    FROM DetalleAC
    WHERE idActaConstitucion = _idActaConstitucion
    AND activo = 1;
END$

DROP PROCEDURE MODIFICAR_ACTA_CONSTITUCION;
--Modificar DETALLEAC
DELIMITER $
CREATE PROCEDURE MODIFICAR_ACTA_CONSTITUCION(
    IN _idProyecto INT,
    IN _nombreProyecto VARCHAR(200),
	IN _empresa VARCHAR(200),
    IN _cliente VARCHAR(200),
	IN _patrocinador VARCHAR(200),
	IN _gerente VARCHAR(200)
)
BEGIN
    UPDATE ActaConstitucion 
    SET nombreProyecto = _nombreProyecto,
        empresa = _empresa,
        cliente = _cliente,
        patrocinador = _patrocinador,
        gerente = _gerente
    WHERE idProyecto = _idProyecto and activo = 1;
END$

DROP PROCEDURE MODIFICAR_CAMPO_DETALLEAC;
--Modificar DETALLEAC
DELIMITER $
CREATE PROCEDURE MODIFICAR_CAMPO_DETALLEAC(
    IN _idDetalle INT,
    IN _nombre VARCHAR(500),
	IN  _detalle VARCHAR(500)
)
BEGIN
    UPDATE DetalleAC 
    SET nombre = _nombre,
        detalle = _detalle
    WHERE idDetalle = _idDetalle;
    SELECT * FROM DetalleAC;
END$

DROP PROCEDURE LISTAR_INTERESADOAC_AC;
--Listar Interesados Acta Constitucion
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADOAC_AC(
    IN _idProyecto INT
)
BEGIN
    SELECT i.idInteresado, i.idActaConstitucion, i.nombre, i.cargo, i.organizacion, i.activo
    FROM InteresadoAC AS i
    LEFT JOIN ActaConstitucion AS ac ON i.idActaConstitucion = ac.idActaConstitucion
    WHERE ac.idProyecto = _idProyecto
    AND i.activo = 1;
END$

DROP PROCEDURE INSERTAR_INTERESADOAC;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADOAC(
	IN  _idProyecto INT,
    IN _nombre VARCHAR(255),
    IN _cargo VARCHAR(255),
    IN _organizacion VARCHAR(255)
)
BEGIN
	DECLARE _idInteresado INT;
    SET @_idActaConstitucion = (SELECT idActaConstitucion FROM ActaConstitucion WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO InteresadoAC(idActaConstitucion,nombre,cargo,organizacion,activo) 
    VALUES(@_idActaConstitucion,_nombre,_cargo,_organizacion,1);
    SET _idInteresado = @@last_insert_id;
    SELECT _idInteresado AS idInteresado;
END$

DROP PROCEDURE LISTAR_HITOAC_X_AC;
--Listar Hito Acta Constitucion
DELIMITER $
CREATE PROCEDURE LISTAR_HITOAC_X_AC(
    IN _idProyecto INT
)
BEGIN
    SELECT h.idHito, h.idActaConstitucion, h.descripcion, h.fechaLimite, h.activo 
    FROM HitoAC AS h
    LEFT JOIN ActaConstitucion AS ac ON h.idActaConstitucion = ac.idActaConstitucion
    WHERE ac.idProyecto = _idProyecto
    AND h.activo = 1;
END$

DROP PROCEDURE INSERTAR_HITOAC;
DELIMITER $
CREATE PROCEDURE INSERTAR_HITOAC(
	IN  _idProyecto INT,
    IN _descripcion VARCHAR(255),
    IN _fechaLimite DATE
)
BEGIN
	DECLARE _idHito INT;
    SET @_idActaConstitucion = (SELECT idActaConstitucion FROM ActaConstitucion WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO HitoAC(idActaConstitucion,descripcion,fechaLimite,activo) 
    VALUES(@_idActaConstitucion,_descripcion,_fechaLimite,1);
    SET _idHito = @@last_insert_id;
    SELECT _idHito AS idHito;
END$

DROP PROCEDURE CREAR_CAMPO_AC;
DELIMITER $
CREATE PROCEDURE CREAR_CAMPO_AC(
	IN  _idProyecto INT,
    IN _nombre VARCHAR(500),
    IN _detalle VARCHAR(500)
)
BEGIN
	DECLARE _idDetalle INT;
    SET @_idActaConstitucion = (SELECT idActaConstitucion FROM ActaConstitucion WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO DetalleAC(idActaConstitucion,nombre,detalle,activo) 
    VALUES(@_idActaConstitucion,_nombre,_detalle,1);
    SET _idDetalle = @@last_insert_id;
    SELECT * FROM DetalleAC WHERE idDetalle = _idDetalle;
END$

DROP PROCEDURE ELIMINAR_CAMPO_AC;
DELIMITER $
CREATE PROCEDURE ELIMINAR_CAMPO_AC(
    IN _idDetalle INT
)
BEGIN
    UPDATE DetalleAC 
    SET activo = 0
    WHERE idDetalle = _idDetalle;
    SELECT _idDetalle AS idDetalle;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_HITOAC;
DELIMITER $
CREATE PROCEDURE ELIMINAR_HITOAC(
    IN _idHito INT
)
BEGIN
	UPDATE HitoAC 
    SET activo = 0
    WHERE idHito = _idHito;
    SELECT _idHito AS idHito;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_INTERESADOAC;
DELIMITER $
CREATE PROCEDURE ELIMINAR_INTERESADOAC(
    IN _idInteresado INT
)
BEGIN
	UPDATE InteresadoAC 
    SET activo = 0
    WHERE idInteresado = _idInteresado;
    SELECT _idInteresado AS idInteresado;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_INTERESADOAC;
DELIMITER $
CREATE PROCEDURE MODIFICAR_INTERESADOAC(
    IN _idInteresado INT,
    IN _nombre VARCHAR(255),
    IN _cargo VARCHAR(255),
    IN _organizacion VARCHAR(255)
)
BEGIN
	UPDATE InteresadoAC 
    SET nombre = _nombre,
        cargo = _cargo,
        organizacion = _organizacion
    WHERE idInteresado = _idInteresado;
    SELECT _idInteresado AS idInteresado;
END$
---------------
-- Presupuesto
---------------

DROP PROCEDURE IF EXISTS LISTAR_MONEDA_TODAS;
DELIMITER $
CREATE PROCEDURE LISTAR_MONEDA_TODAS()
BEGIN
    SELECT idMoneda, nombre,tipoCambio
    FROM Moneda
    WHERE activo = 1;
END$

CALL LISTAR_MONEDA_TODAS;

DROP PROCEDURE IF EXISTS LISTAR_TIPO_INGRESO_TODOS;
DELIMITER $
CREATE PROCEDURE LISTAR_TIPO_INGRESO_TODOS()
BEGIN
    SELECT idIngresoTipo, descripcion
    FROM IngresoTipo
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_TIPO_TRANSACCION_TODOS;
DELIMITER $
CREATE PROCEDURE LISTAR_TIPO_TRANSACCION_TODOS()
BEGIN
    SELECT idTransaccionTipo, descripcion
    FROM TransaccionTipo
    WHERE activo = 1;
END$
#############################################
## PRESUPUESTO
#############################################

SELECT * FROM Herramienta;
DROP PROCEDURE IF EXISTS INSERTAR_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_PRESUPUESTO(
	IN  _idProyecto INT,
	IN _idMoneda INT,
    IN _presupuestoInicial DECIMAL(10,2),
    IN _cantidadMeses INT
)
BEGIN
	DECLARE _idPresupuesto INT;
	INSERT INTO Presupuesto(idHerramienta,idProyecto,idMoneda,presupuestoInicial,cantidadMeses,fechaCreacion,activo) 
    VALUES(13,_idProyecto,2,NULL,NULL,curdate(),1);
    SET _idPresupuesto = @@last_insert_id;
    INSERT INTO HerramientaXProyecto(idProyecto,idHerramienta,idHerramientaCreada,activo) VALUES(_idProyecto,13,_idPresupuesto,1);
    SELECT _idPresupuesto AS idPresupuesto;
END$

SELECT * FROM Proyecto;
CALL LISTAR_HERRAMIENTAS_X_PROYECTO_X_ID_PROYECTO(1);

DROP PROCEDURE IF EXISTS MODIFICAR_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_PRESUPUESTO(
    IN _idMoneda INT,
    IN _presupuestoInicial DECIMAL(10,2),
    IN _cantidadMeses INT,
    IN _idPresupuesto INT
)
BEGIN
    UPDATE Presupuesto 
    SET idMoneda = _idMoneda, presupuestoInicial = _presupuestoInicial, cantidadMeses = _cantidadMeses,activo = 1
    WHERE idPresupuesto = _idPresupuesto;
    SELECT _idPresupuesto AS idPresupuesto;
END$


DROP PROCEDURE IF EXISTS LISTAR_PRESUPUESTO_X_ID_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE LISTAR_PRESUPUESTO_X_ID_PRESUPUESTO(IN _idPresupuesto INT)
BEGIN
	SELECT * FROM Presupuesto WHERE idPresupuesto = _idPresupuesto AND activo = 1;
END$

DELIMITER $
CREATE PROCEDURE OBTENER_PRESUPUESTO_X_ID_PRESUPUESTO(IN _idPresupuesto INT)
BEGIN
    -- Obtener el presupuesto inicial
    DECLARE presupuestoInicial DOUBLE DEFAULT 0;
    DECLARE totalIngresos DOUBLE DEFAULT 0;
    DECLARE totalEstimaciones DOUBLE DEFAULT 0;
    DECLARE totalEgresos DOUBLE DEFAULT 0;
    
    SELECT presupuestoInicial INTO presupuestoInicial
    FROM Presupuesto
    WHERE idPresupuesto = _idPresupuesto;

    -- Calcular el monto total de ingresos
    
    SELECT SUM(monto * cantidad) INTO totalIngresos
    FROM LineaIngreso
    WHERE idPresupuesto = _idPresupuesto AND activo = 1;

    -- Calcular el subtotal de estimaciones de costos
    
    SELECT SUM(subtotal) INTO totalEstimaciones
    FROM LineaEstimacionCosto
    WHERE idPresupuesto = _idPresupuesto AND activo = 1;

    -- Calcular el costo real total de los egresos
    
    SELECT SUM(costoReal * cantidad) INTO totalEgresos
    FROM LineaEgreso
    WHERE idPresupuesto = _idPresupuesto AND activo = 1;

    -- Devolver los resultados
    SELECT presupuestoInicial, totalIngresos, totalEstimaciones, totalEgresos;
END $

CALL OBTENER_PRESUPUESTO_X_ID_PRESUPUESTO(37);

DROP PROCEDURE IF EXISTS ELIMINAR_PRESUPUESTO_X_ID_PRESUPUESTO;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_PRESUPUESTO_X_ID_PRESUPUESTO`(
	IN _idPresupuesto INT
)
BEGIN
	UPDATE Presupuesto SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
	UPDATE Ingreso SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
    UPDATE Egreso SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
    UPDATE LineaIngreso SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
    UPDATE LineaEgreso SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
    UPDATE LineaEstimacionCosto SET activo = 0 WHERE idPresupuesto = _idPresupuesto;
END; //
DELIMITER ;

------
DROP PROCEDURE INSERTAR_INGRESO
DELIMITER $
CREATE PROCEDURE INSERTAR_INGRESO(
	IN  _idPresupuesto INT,
    IN _subtotal DECIMAL(10,2)
)
BEGIN
	DECLARE _idIngreso INT;
	INSERT INTO Ingreso(idPresupuesto,subtotal,activo) 
    VALUES(_idPresupuesto,_subtotal,1);
    
    SET _idIngreso = @@last_insert_id;
    SELECT _idIngreso AS idIngreso;
END$

DROP PROCEDURE IF EXISTS INSERTAR_LINEA_INGRESO;
DELIMITER $
CREATE PROCEDURE INSERTAR_LINEA_INGRESO(
	IN _idPresupuesto INT,
    IN _idMoneda INT,
	IN _idTransaccionTipo INT,
    IN _idIngresoTipo INT,
    IN _descripcion VARCHAR(255),
    IN _monto DECIMAL(10,2),
    IN _cantidad INT,
    in _fechaTransaccion DATE
)
BEGIN
	DECLARE _idLineaIngreso INT;
	INSERT INTO LineaIngreso(idPresupuesto,idMoneda,idTransaccionTipo,idIngresoTipo,descripcion,monto,cantidad,fechaTransaccion,activo) 
    VALUES(_idPresupuesto,_idMoneda,_idTransaccionTipo,_idIngresoTipo,_descripcion,_monto,_cantidad,_fechaTransaccion,1);
    SET _idLineaIngreso = @@last_insert_id;
    SELECT _idLineaIngreso AS idLineaIngreso;
END$

CALL INSERTAR_PRESUPUESTO(50,4500);
CALL INSERTAR_INGRESO(2,300);
CALL INSERTAR_LINEA_INGRESO(4,1,1,1,"Segundo ingreso realizado",200,1,CURDATE());

UPDATE LineaEstimacionCosto SET idProyecto = 50 WHERE idLineaEstimacion >0;
UPDATE LineaIngreso SET idProyecto = 50 WHERE idLineaIngreso >0;
UPDATE LineaEgreso SET idProyecto = 50 WHERE idLineaEgreso >0;

DROP PROCEDURE IF EXISTS MODIFICAR_LINEA_INGRESO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_LINEA_INGRESO(
    IN _idLineaIngreso INT,
    IN _idMoneda INT,
    IN _idTransaccionTipo INT,
    IN _idIngresoTipo INT,
    IN _descripcion VARCHAR(255),
    IN _monto DECIMAL(10,2),
    IN _cantidad INT,
    IN _fechaTransaccion DATE
)
BEGIN
    UPDATE LineaIngreso
    SET
        idMoneda = _idMoneda,
        idTransaccionTipo = _idTransaccionTipo,
        idIngresoTipo = _idIngresoTipo,
        descripcion = _descripcion,
        monto = _monto,
        cantidad = _cantidad,
        fechaTransaccion = _fechaTransaccion
    WHERE
        idLineaIngreso = _idLineaIngreso AND activo = 1;
    SELECT _idLineaIngreso AS idLineaIngreso;
END $



DROP PROCEDURE IF EXISTS LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(IN _idPresupuesto INT)
BEGIN
    SELECT l.idLineaIngreso, l.descripcion, l.monto, l.cantidad, l.fechaTransaccion, t.idTransaccionTipo, t.descripcion AS descripcionTransaccionTipo,
    i.idIngresoTipo, i.descripcion AS descripcionIngresoTipo, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaIngreso AS l LEFT JOIN TransaccionTipo AS t ON l.idTransaccionTipo = t.idTransaccionTipo
							LEFT JOIN IngresoTipo AS i ON l.idIngresoTipo = i.idIngresoTipo
							LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$


DROP PROCEDURE IF EXISTS LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(
	IN _idPresupuesto INT,
    IN _descripcion VARCHAR(255),
    IN _fechaIni DATE,
    IN _fechaFin DATE)
BEGIN
    SELECT l.idLineaIngreso, l.monto, l.descripcion, l.cantidad, l.fechaTransaccion, t.idTransaccionTipo, t.descripcion AS descripcionTransaccionTipo,
    i.idIngresoTipo, i.descripcion AS descripcionIngresoTipo, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaIngreso AS l LEFT JOIN TransaccionTipo AS t ON l.idTransaccionTipo = t.idTransaccionTipo
							LEFT JOIN IngresoTipo AS i ON l.idIngresoTipo = i.idIngresoTipo
							LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.descripcion LIKE CONCAT('%', IFNULL(_descripcion, l.descripcion), '%') 
    AND (l.fechaTransaccion BETWEEN IFNULL(_fechaIni, '1000-01-01') AND IFNULL(_fechaFin, '9999-12-31'))
    AND l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$


CALL LISTAR_LINEA_INGRESO_X_ID_PROYECTO_NOMBRE_FECHAS(50,NULL,NULL,NULL)


DROP PROCEDURE IF EXISTS ELIMINAR_LINEA_INGRESO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_LINEA_INGRESO(
	IN _idLineaIngreso INT
)
BEGIN
	UPDATE LineaIngreso SET activo = 0 WHERE idLineaIngreso =  _idLineaIngreso AND activo = 1;
END$

-----------
-- Egreso
-----------
DROP PROCEDURE IF EXISTS INSERTAR_EGRESO;
DELIMITER $
CREATE PROCEDURE INSERTAR_EGRESO(
	IN _idPresupuesto INT,
    IN _subtotal DECIMAL(10,2)
)
BEGIN
	DECLARE _idEgreso INT;
	INSERT INTO Egreso(idPresupuesto,subtotal,activo) 
    VALUES(_idPresupuesto,_subtotal,1);
    SET _idEgreso = @@last_insert_id;
    SELECT _idEgreso AS idEgreso;
END$

DROP PROCEDURE IF EXISTS INSERTAR_LINEA_EGRESO;
DELIMITER $
CREATE PROCEDURE INSERTAR_LINEA_EGRESO(
	IN _idPresupuesto INT,
    IN _idMoneda INT,
    IN _idLineaEstimacionCosto INT,
	IN _descripcion  VARCHAR(255),
    IN _costoReal DECIMAL(10,2),
	IN _fechaRegistro DATE,
    IN _cantidad INT
)
BEGIN
	DECLARE _idLineaEgreso INT;
	INSERT INTO LineaEgreso(idPresupuesto,idMoneda,idLineaEstimacionCosto,descripcion,costoReal,fechaRegistro,cantidad,activo) 
    VALUES(_idPresupuesto,_idMoneda,_idLineaEstimacionCosto,_descripcion,_costoReal,_fechaRegistro,_cantidad,1);
    SET _idLineaEgreso = @@last_insert_id;
    SELECT _idLineaEgreso AS idLineaEgreso;
END$
######
COMPLETAR CAMBIO DE COLUMNA

DROP PROCEDURE IF EXISTS MODIFICAR_LINEA_EGRESO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_LINEA_EGRESO(
	IN _idLineaEgreso INT,
    IN _idMoneda INT,
    IN _idLineaEstimacionCosto INT,
	IN _descripcion VARCHAR(255),
    IN _costoReal DECIMAL(10,2),
	IN _fechaRegistro DATE,
    IN _cantidad INT
)
BEGIN
    UPDATE LineaEgreso
    SET
        idMoneda = _idMoneda,
        idLineaEstimacionCosto = _idLineaEstimacionCosto,
        descripcion = _descripcion,
        costoReal = _costoReal,
        fechaRegistro = _fechaRegistro,
        cantidad = _cantidad
    WHERE
        idLineaEgreso = _idLineaEgreso AND activo=1;
    
    SELECT _idLineaEgreso AS idLineaEgreso;
END$



SELECT * FROM Presupuesto;

DROP PROCEDURE IF EXISTS LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(IN _idPresupuesto INT)
BEGIN
    SELECT l.idLineaEgreso,l.descripcion, l.costoReal,l.fechaRegistro, l.cantidad, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaEgreso AS l LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$


DROP PROCEDURE IF EXISTS LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(
	IN _idPresupuesto INT,
    IN _descripcion VARCHAR(255),
    IN _fechaIni DATE,
    IN _fechaFin DATE
    )
BEGIN
    SELECT l.idLineaEgreso,l.descripcion, l.costoReal,l.fechaRegistro, l.cantidad, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaEgreso AS l LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.descripcion LIKE CONCAT('%', IFNULL(_descripcion, l.descripcion), '%') 
    AND (l.fechaRegistro BETWEEN IFNULL(_fechaIni, '1000-01-01') AND IFNULL(_fechaFin, '9999-12-31'))
    AND l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$


CALL LISTAR_LINEA_EGRESO_X_ID_PROYECTO_NOMBRE_FECHAS(50,'Eg',NULL,NULL)

SELECT * FROM LineaEgreso;

DROP PROCEDURE IF EXISTS ELIMINAR_LINEA_EGRESO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_LINEA_EGRESO(
	IN _idLineaEgreso INT
)
BEGIN
	UPDATE LineaEgreso SET activo = 0 WHERE _idLineaEgreso =  _idLineaEgreso AND activo = 1;
END$

-----------------
-- Estimacion Costo
------------------

DELETE
###############################
DROP PROCEDURE IF EXISTS INSERTAR_ESTIMACION_COSTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_ESTIMACION_COSTO(
	IN _idPresupuesto INT,
    IN _subtotal DECIMAL(10,2),
    IN _reservacionContingencia DECIMAL(10,2),
    IN _lineaBase DECIMAL(10,2),
    IN _ganancia DECIMAL(10,2),
    IN _IGV DECIMAL(10,2)
)
BEGIN
	DECLARE _idEstimacionCosto INT;
	INSERT INTO EstimacionCosto(idPresupuesto,subtotal,reservaContigencia,lineaBase,ganancia,IGV,activo) 
    VALUES(_idPresupuesto,_subtotal,_reservacionContingencia,_lineaBase,_ganancia,_IGV,1);
    SET _idEstimacionCosto = @@last_insert_id;
    SELECT _idEstimacionCosto AS idEstimacionCosto;
END$
#############################333





DROP PROCEDURE IF EXISTS INSERTAR_LINEA_ESTIMACION_COSTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_LINEA_ESTIMACION_COSTO(
    IN _idMoneda INT,
    IN _idPresupuesto INT,
    IN _descripcion VARCHAR(255),
    IN _tarifaUnitaria DECIMAL(10,2),
    IN _cantidadRecurso INT,
    IN _subtotal DECIMAL(10,2),
    IN _fechaInicio DATE,
    IN _tiempoRequerido INT
)
BEGIN
	DECLARE _idLineaEstimacionCosto INT;
	INSERT INTO LineaEstimacionCosto(idMoneda,idPresupuesto,descripcion,tarifaUnitaria,cantidadRecurso,subtotal,fechaInicio,tiempoRequerido,activo) 
    VALUES(_idMoneda,_idPresupuesto,_descripcion,_tarifaUnitaria,_cantidadRecurso,_subtotal,_fechaInicio,_tiempoRequerido,1);
    SET _idLineaEstimacionCosto = @@last_insert_id;
    SELECT _idLineaEstimacionCosto AS idLineaEstimacionCosto;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_LINEA_ESTIMACION_COSTO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_LINEA_ESTIMACION_COSTO(
    IN _idLineaEstimacionCosto INT,
    IN _idMoneda INT,
    IN _descripcion VARCHAR(255),
    IN _tarifaUnitaria DECIMAL(10,2),
    IN _cantidadRecurso INT,
    IN _subtotal DECIMAL(10,2),
    IN _fechaInicio DATE,
    IN _tiempoRequerido INT
)
BEGIN
    UPDATE LineaEstimacionCosto
    SET
        idMoneda = _idMoneda,
        descripcion = _descripcion,
        tarifaUnitaria = _tarifaUnitaria,
        cantidadRecurso = _cantidadRecurso,
        subtotal = _subtotal,
        fechaInicio = _fechaInicio,
        tiempoRequerido =_tiempoRequerido
    WHERE
        idLineaEstimacion = _idLineaEstimacionCosto;

    SELECT _idLineaEstimacionCosto AS idLineaEstimacionCosto;
END$



CALL INSERTAR_LINEA_ESTIMACION_COSTO(1,1,1,"Primera linea de estimacion costo",20,2,40,CURDATE());

DROP PROCEDURE IF EXISTS LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO(IN _idPresupuesto INT)
BEGIN
    SELECT l.idLineaEstimacion, l.descripcion, l.tarifaUnitaria,l.cantidadRecurso,l.subtotal,l.fechaInicio, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaEstimacionCosto AS l LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO_NOMBRE_FECHAS;
DELIMITER $
CREATE PROCEDURE LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(
	IN _idPresupuesto INT,
    IN _descripcion VARCHAR(255),
    IN _fechaIni DATE,
    IN _fechaFin DATE)
BEGIN
    SELECT l.idLineaEstimacion, l.descripcion, l.tarifaUnitaria,l.cantidadRecurso,l.subtotal,l.fechaInicio, m.idMoneda, m.nombre AS nombreMoneda
	FROM LineaEstimacionCosto AS l LEFT JOIN Moneda AS m ON l.idMoneda = m.idMoneda
	WHERE l.descripcion LIKE CONCAT('%', IFNULL(_descripcion, l.descripcion), '%') 
    AND (l.fechaInicio BETWEEN IFNULL(_fechaIni, '1000-01-01') AND IFNULL(_fechaFin, '9999-12-31'))
    AND l.idPresupuesto = _idPresupuesto AND l.activo=1;
END$

SELECT * FROM LineaEstimacionCosto;
CALL LISTAR_LINEA_ESTIMACION_COSTO_X_ID_PRESUPUESTO_NOMBRE_FECHAS(40,NULL,NULL,NULL)


DROP PROCEDURE IF EXISTS ELIMINAR_LINEA_ESTIMACION_COSTO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_LINEA_ESTIMACION_COSTO(
	IN _idLineaEstimacionCosto INT
)
BEGIN
	UPDATE LineaEstimacionCosto SET activo = 0 WHERE idLineaEstimacionCosto =  _idLineaEstimacionCosto AND activo = 1;
END$


SELECT * FROM Ingreso;
SELECT * FROM LineaIngreso;

------------
-- Matriz de Comunicaciones
------------
DROP PROCEDURE INSERTAR_COMUNICACION_CANAL;
DELIMITER $
CREATE PROCEDURE INSERTAR_COMUNICACION_CANAL(
	IN _nombreCanal VARCHAR(200)
)
BEGIN
	DECLARE _idCanal INT;
	INSERT INTO ComCanal(nombreCanal,activo) VALUES(_nombreCanal,1);
    SET _idCanal = @@last_insert_id;
    SELECT _idCanal AS idCanal;
END$

DROP PROCEDURE INSERTAR_COMUNICACION_FRECUENCIA;
DELIMITER $
CREATE PROCEDURE INSERTAR_COMUNICACION_FRECUENCIA(
	IN _nombreFrecuencia VARCHAR(200)
)
BEGIN
	DECLARE _idFrecuencia INT;
	INSERT INTO ComFrecuencia(nombreFrecuencia,activo) VALUES(_nombreFrecuencia,1);
    SET _idFrecuencia = @@last_insert_id;
    SELECT _idFrecuencia AS idFrecuencia;
END$

DROP PROCEDURE INSERTAR_COMUNICACION_FORMATO;
DELIMITER $
CREATE PROCEDURE INSERTAR_COMUNICACION_FORMATO(
	IN _nombreFormato VARCHAR(200)
)
BEGIN
	DECLARE _idFormato INT;
	INSERT INTO ComFormato(nombreFormato,activo) VALUES(_nombreFormato,1);
    SET _idFormato = @@last_insert_id;
    SELECT _idFormato AS idFormato;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_COMUNICACION_CANAL()
BEGIN
	SELECT *
    FROM ComCanal
    WHERE activo = 1;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_COMUNICACION_FRECUENCIA()
BEGIN
	SELECT *
    FROM ComFrecuencia
    WHERE activo = 1;
END$

DELIMITER $
CREATE PROCEDURE LISTAR_COMUNICACION_FORMATO()
BEGIN
	SELECT *
    FROM ComFormato
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_MATRIZCOMUNICACIONES_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_MATRIZCOMUNICACIONES_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT c.idComunicacion, c.idCanal, cc.nombreCanal, c.idFrecuencia, cf.nombreFrecuencia, c.idFormato, cfo.nombreFormato, c.idMatrizComunicacion, mc.idProyecto, 
    c.sumillaInformacion, c.detalleInformacion, c.responsableDeComunicar, u.nombres, u.apellidos, u.correo, c.grupoReceptor, c.activo
	FROM Comunicacion AS c
    JOIN MatrizComunicacion AS mc ON c.idMatrizComunicacion = mc.idMatrizComunicacion
    JOIN ComCanal AS cc ON c.idCanal = cc.idCanal
    JOIN ComFrecuencia AS cf ON c.idFrecuencia = cf.idFrecuencia
    JOIN ComFormato AS cfo ON c.idFormato = cfo.idFormato
    JOIN Usuario AS u ON c.responsableDeComunicar = u.idUsuario
	WHERE mc.idProyecto = _idProyecto AND c.activo=1;
END$

DROP PROCEDURE INSERTAR_COMUNICACION_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_COMUNICACION_X_IDPROYECTO(
    IN _idProyecto INT,
	IN _idCanal INT,
    IN _idFrecuencia INT,
    IN _idFormato INT,
    IN _sumillaInformacion VARCHAR(500),
    IN _detalleInformacion VARCHAR(500),
    IN _responsableDeComunicar VARCHAR(500),
    IN _grupoReceptor VARCHAR(500)
)
BEGIN
	DECLARE _idComunicacion INT;
    SET @_idMatrizComunicacion = (SELECT idMatrizComunicacion FROM MatrizComunicacion WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO Comunicacion(idCanal,idFrecuencia,idFormato,idMatrizComunicacion,sumillaInformacion,detalleInformacion,responsableDeComunicar,grupoReceptor,activo) 
    VALUES(_idCanal,_idFrecuencia,_idFormato,@_idMatrizComunicacion,_sumillaInformacion,_detalleInformacion,_responsableDeComunicar,_grupoReceptor,1);
    SET _idComunicacion = @@last_insert_id;
    SELECT _idComunicacion AS idComunicacion;
END$

DROP PROCEDURE IF EXISTS OBTENER_IDMATRIZCOMUNICACION_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE OBTENER_IDMATRIZCOMUNICACION_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT idMatrizComunicacion
	FROM MatrizComunicacion
	WHERE idProyecto = _idProyecto AND activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_MATRIZCOMUNICACIONES_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_MATRIZCOMUNICACIONES_X_IDMATRIZ(IN _idMatrizComunicacion INT)
BEGIN
    SELECT c.idComunicacion, c.idCanal, cc.nombreCanal, c.idFrecuencia, cf.nombreFrecuencia, c.idFormato, cfo.nombreFormato, 
    c.sumillaInformacion, c.detalleInformacion, c.responsableDeComunicar, c.grupoReceptor, c.activo
	FROM Comunicacion AS c
    JOIN ComCanal AS cc ON c.idCanal = cc.idCanal
    JOIN ComFrecuencia AS cf ON c.idFrecuencia = cf.idFrecuencia
    JOIN ComFormato AS cfo ON c.idFormato = cfo.idFormato
	WHERE c.idMatrizComunicacion = _idMatrizComunicacion AND c.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_COMUNICACION_X_IDCOMUNICACION;
DELIMITER $
CREATE PROCEDURE LISTAR_COMUNICACION_X_IDCOMUNICACION(IN _idComunicacion INT)
BEGIN
    SELECT c.idComunicacion, c.idCanal, cc.nombreCanal, c.idFrecuencia, cf.nombreFrecuencia, c.idFormato, cfo.nombreFormato, 
    c.sumillaInformacion, c.detalleInformacion, c.responsableDeComunicar, u.nombres, u.apellidos, u.correoElectronico, u.imgLink, c.grupoReceptor, c.activo
	FROM Comunicacion AS c
    JOIN ComCanal AS cc ON c.idCanal = cc.idCanal
    JOIN ComFrecuencia AS cf ON c.idFrecuencia = cf.idFrecuencia
    JOIN ComFormato AS cfo ON c.idFormato = cfo.idFormato
    JOIN Usuario AS u ON c.responsableDeComunicar = u.idUsuario
	WHERE c.idComunicacion = _idComunicacion AND c.activo=1;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_COMUNICACION;
DELIMITER $
CREATE PROCEDURE MODIFICAR_COMUNICACION(
    IN _idComunicacion INT,
	IN _idCanal INT,
    IN _idFrecuencia INT,
    IN _idFormato INT,
    IN _sumillaInformacion VARCHAR(500),
    IN _detalleInformacion VARCHAR(500),
    IN _responsableDeComunicar INT,
    IN _grupoReceptor VARCHAR(500)
)
BEGIN
	UPDATE Comunicacion 
    SET idCanal = _idCanal,
        idFrecuencia = _idFrecuencia,
        idFormato = _idFormato,
        sumillaInformacion = _sumillaInformacion,
        detalleInformacion = _detalleInformacion,
        responsableDeComunicar = _responsableDeComunicar,
        grupoReceptor = _grupoReceptor
    WHERE idComunicacion = _idComunicacion;
    SELECT _idComunicacion AS idComunicacion;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_COMUNICACION;
DELIMITER $
CREATE PROCEDURE ELIMINAR_COMUNICACION(
    IN _idComunicacion INT
)
BEGIN
	UPDATE Comunicacion 
    SET activo = 0
    WHERE idComunicacion = _idComunicacion;
    SELECT _idComunicacion AS idComunicacion;
END$


------------
-- Equipos
------------
--Listar Equipos x id de proyecto
DROP PROCEDURE IF EXISTS LISTAR_EQUIPOS_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_EQUIPOS_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT *
	FROM Equipo
	WHERE idProyecto = _idProyecto AND activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_PARTICIPANTES_X_IDEQUIPO;
DELIMITER $
CREATE PROCEDURE LISTAR_PARTICIPANTES_X_IDEQUIPO(IN _idEquipo INT)
BEGIN
    SELECT ue.idUsuario, u.nombres, u.apellidos, u.correoElectronico, u.activo, ue.idRol, re.nombreRol
    FROM UsuarioXEquipo AS ue
    LEFT JOIN Usuario AS u ON ue.idUsuario = u.idUsuario
    LEFT JOIN RolesEquipo AS re ON ue.idRol = re.idRolEquipo
	WHERE ue.idEquipo = _idEquipo AND ue.activo=1;
END$

------------
-- AUTOEVALUACION
------------
DROP PROCEDURE CREAR_AUTOEVALUACION;
DELIMITER $
CREATE PROCEDURE CREAR_AUTOEVALUACION(
    _idProyecto INT,
    _fechaCreacion DATE,
    _fechaLimite DATE,
    _activo TINYINT
)
BEGIN
	DECLARE _idAutoEvaluacion INT;
	INSERT INTO autoEvaluacion(idProyecto,fechaCreacion,fechaLimite,activo) 
    VALUES(_idProyecto,_fechaCreacion,_fechaLimite,1);
    SET _idAutoEvaluacion = @@last_insert_id;
    SELECT _idAutoEvaluacion AS idAutoEvaluacion;
END$

------------
-- Catalogo de Riesgos
------------
DROP PROCEDURE IF EXISTS INSERTAR_RIESGO_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_RIESGO_X_IDPROYECTO(
    IN _idProyecto INT,
    IN _idProbabilidad INT,
    IN _idImpacto INT,
	IN _nombreRiesgo VARCHAR(500),
    IN _fechaIdentificacion DATE,
    IN _duenoRiesgo INT,
    IN _detalleRiesgo VARCHAR(500),
    IN _causaRiesgo VARCHAR(500),
    IN _impactoRiesgo VARCHAR(500),
    IN _estado VARCHAR(100)
)
BEGIN
	DECLARE _idRiesgo INT;
    SET @_idCatalogo = (SELECT idCatalogo FROM CatalogoRiesgo WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO Riesgo(idProbabilidad,idImpacto, nombreRiesgo,idCatalogo,fechaIdentificacion,duenoRiesgo,detalleRiesgo,causaRiesgo,impactoRiesgo,estado,activo) 
    VALUES(_idProbabilidad,_idImpacto, _nombreRiesgo,@_idCatalogo,_fechaIdentificacion,_duenoRiesgo,_detalleRiesgo,_causaRiesgo,_impactoRiesgo,_estado,1);
    SET _idRiesgo = @@last_insert_id;
    SELECT _idRiesgo AS idRiesgo;
END$

DROP PROCEDURE IF EXISTS INSERTAR_RESPONSABLE_RIESGO;
DELIMITER $
CREATE PROCEDURE INSERTAR_RESPONSABLE_RIESGO(
    IN _idRiesgo INT,
	IN _idResponsable INT
)
BEGIN
	DECLARE _idRiesgoXResponsable INT;
	INSERT INTO RiesgoXResponsable(idRiesgo,idResponsable,activo) 
    VALUES(_idRiesgo,_idResponsable,1);
    SET _idRiesgoXResponsable = @@last_insert_id;
    SELECT _idRiesgoXResponsable AS idRiesgoXResponsable;
END$

DROP PROCEDURE IF EXISTS INSERTAR_PROBABILIDAD;
DELIMITER $
CREATE PROCEDURE INSERTAR_PROBABILIDAD(
    IN _nombreProbabilidad VARCHAR(200),
	IN _valorProbabilidad DOUBLE
)
BEGIN
	DECLARE _idProbabilidad INT;
	INSERT INTO RiesgoProbabilidad(nombreProbabilidad, valorProbabilidad, activo) 
    VALUES(_nombreProbabilidad, _valorProbabilidad, 1);
    SET _idProbabilidad = @@last_insert_id;
    SELECT _idProbabilidad AS idProbabilidad;
END$

DROP PROCEDURE IF EXISTS INSERTAR_IMPACTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_IMPACTO(
    IN _nombreImpacto VARCHAR(200),
	IN _valorImpacto DOUBLE
)
BEGIN
	DECLARE _idImpacto INT;
	INSERT INTO RiesgoImpacto(nombreImpacto, valorImpacto, activo) 
    VALUES(_nombreImpacto, _valorImpacto, 1);
    SET _idImpacto = @@last_insert_id;
    SELECT _idImpacto AS idImpacto;
END$

DROP PROCEDURE IF EXISTS LISTAR_IMPACTO;
DELIMITER $
CREATE PROCEDURE LISTAR_IMPACTO()
BEGIN
	SELECT *
    FROM RiesgoImpacto
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_PROBABILIDAD;
DELIMITER $
CREATE PROCEDURE LISTAR_PROBABILIDAD()
BEGIN
	SELECT *
    FROM RiesgoProbabilidad
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_PLANRESPUESTA;
DELIMITER $
CREATE PROCEDURE INSERTAR_PLANRESPUESTA(
    IN _idRiesgo INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	DECLARE _idPlanRespuesta INT;
	INSERT INTO PlanRespuesta(idRiesgo,descripcion,activo) 
    VALUES(_idRiesgo,_descripcion,1);
    SET _idPlanRespuesta = @@last_insert_id;
    SELECT _idPlanRespuesta AS idPlanRespuesta;
END$

DROP PROCEDURE IF EXISTS INSERTAR_PLANCONTIGENCIA;
DELIMITER $
CREATE PROCEDURE INSERTAR_PLANCONTIGENCIA(
    IN _idRiesgo INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
	DECLARE _idPlanContingencia INT;
	INSERT INTO PlanContingencia(idRiesgo,descripcion,activo) 
    VALUES(_idRiesgo,_descripcion,1);
    SET _idPlanContingencia = @@last_insert_id;
    SELECT _idPlanContingencia AS idPlanContingencia;
END$

DROP PROCEDURE IF EXISTS LISTAR_CATALOGORIESGO_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_CATALOGORIESGO_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT r.idRiesgo, r.nombreRiesgo, r.idCatalogo, r.fechaIdentificacion, r.duenoRiesgo, u.nombres, u.apellidos, u.correoElectronico, r.detalleRiesgo,
    r.causaRiesgo, r.impactoRiesgo, r.estado, r.activo, r.idProbabilidad, rp.nombreProbabilidad, rp.valorProbabilidad, r.idImpacto, ri.nombreImpacto, ri.valorImpacto
	FROM Riesgo AS r
    LEFT JOIN CatalogoRiesgo AS cr ON r.idCatalogo = cr.idCatalogo
    LEFT JOIN Usuario AS u ON r.duenoRiesgo = u.idUsuario
    LEFT JOIN RiesgoProbabilidad AS rp ON r.idProbabilidad = rp.idProbabilidad
    LEFT JOIN RiesgoImpacto AS ri ON r.idImpacto = ri.idImpacto
	WHERE cr.idProyecto = _idProyecto AND r.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_RESPONSABLE_X_IDRIESGO;
DELIMITER $
CREATE PROCEDURE LISTAR_RESPONSABLE_X_IDRIESGO(IN _idRiesgo INT)
BEGIN
    SELECT u.correoElectronico, u.idUsuario, u.apellidos, u.nombres, u.imgLink
	FROM RiesgoXResponsable AS rr
    LEFT JOIN Usuario AS u ON rr.idResponsable = u.idUsuario
	WHERE rr.idRiesgo = _idRiesgo AND rr.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_PLANRESPUESTA_X_IDRIESGO;
DELIMITER $
CREATE PROCEDURE LISTAR_PLANRESPUESTA_X_IDRIESGO(IN _idRiesgo INT)
BEGIN
    SELECT pr.idPlanRespuesta, pr.descripcion, pr.activo
	FROM PlanRespuesta AS pr
	WHERE pr.idRiesgo = _idRiesgo AND pr.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_PLANCONTINGENCIA_X_IDRIESGO;
DELIMITER $
CREATE PROCEDURE LISTAR_PLANCONTINGENCIA_X_IDRIESGO(IN _idRiesgo INT)
BEGIN
    SELECT pc.idPlanContingencia, pc.descripcion, pc.activo
	FROM PlanContingencia AS pc
	WHERE pc.idRiesgo = _idRiesgo AND pc.activo=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_RIESGO_X_IDRIESGO;
DELIMITER $
CREATE PROCEDURE LISTAR_RIESGO_X_IDRIESGO(IN _idRiesgo INT)
BEGIN
    SELECT r.idRiesgo, r.nombreRiesgo, r.idCatalogo, r.fechaIdentificacion, r.duenoRiesgo, u.nombres, u.apellidos, u.correoElectronico, r.detalleRiesgo,
    r.causaRiesgo, r.impactoRiesgo, r.estado, r.activo, r.idProbabilidad, rp.nombreProbabilidad, rp.valorProbabilidad, r.idImpacto, ri.nombreImpacto, ri.valorImpacto
	FROM Riesgo AS r
    LEFT JOIN Usuario AS u ON r.duenoRiesgo = u.idUsuario
    LEFT JOIN RiesgoProbabilidad AS rp ON r.idProbabilidad = rp.idProbabilidad
    LEFT JOIN RiesgoImpacto AS ri ON r.idImpacto = ri.idImpacto
	WHERE r.idRiesgo = _idRiesgo AND r.activo=1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_RIESGO_X_IDRIESGO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_RIESGO_X_IDRIESGO(IN _idRiesgo INT)
BEGIN
	UPDATE Riesgo SET activo = 0 WHERE idRiesgo = _idRiesgo;
    UPDATE PlanRespuesta SET activo = 0 WHERE idRiesgo = _idRiesgo;
    UPDATE PlanContingencia SET activo = 0 WHERE idRiesgo = _idRiesgo;
END$


DROP PROCEDURE IF EXISTS ELIMINAR_PLANRESPUESTA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_PLANRESPUESTA(IN _idPlanRespuesta INT)
BEGIN
    UPDATE PlanRespuesta SET activo = 0 WHERE idPlanRespuesta = _idPlanRespuesta;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_PLANCONTINGENCIA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_PLANCONTINGENCIA(IN _idPlanContingencia INT)
BEGIN
    UPDATE PlanContingencia SET activo = 0 WHERE idPlanContingencia = _idPlanContingencia;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_RESPONSABLE;
DELIMITER $
CREATE PROCEDURE ELIMINAR_RESPONSABLE(
    IN _idRiesgo INT,
    IN _idResponsable INT
)
BEGIN
    UPDATE RiesgoXResponsable SET activo = 0 WHERE idRiesgo = _idRiesgo AND idResponsable = _idResponsable;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_RIESGO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_RIESGO(
    IN _idRiesgo INT,
    IN _idProbabilidad INT,
    IN _idImpacto INT,
    IN _nombreRiesgo VARCHAR(500),
    IN _fechaIdentificacion DATE,
    IN _duenoRiesgo INT,
    IN _detalleRiesgo VARCHAR(500),
    IN _causaRiesgo VARCHAR(500),
    IN _impactoRiesgo VARCHAR(500),
    IN _estado VARCHAR(100)
)
BEGIN
    UPDATE Riesgo 
    SET idProbabilidad = _idProbabilidad,
        idImpacto = _idImpacto,
        nombreRiesgo = _nombreRiesgo,
        idCatalogo = _idCatalogo,
        fechaIdentificacion = _fechaIdentificacion,
        duenoRiesgo = _duenoRiesgo,
        detalleRiesgo = _detalleRiesgo,
        causaRiesgo = _causaRiesgo,
        impactoRiesgo = _impactoRiesgo,
        estado = _estado
    WHERE idRiesgo = _idRiesgo;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_PLANESRESPUESTA;
DELIMITER $
CREATE PROCEDURE MODIFICAR_PLANESRESPUESTA(
    IN _idPlanRespuesta INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
    UPDATE PlanRespuesta 
    SET descripcion = _descripcion
    WHERE idPlanRespuesta = _idPlanRespuesta;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_PLANESCONTINGENCIA;
DELIMITER $
CREATE PROCEDURE MODIFICAR_PLANESCONTINGENCIA(
    IN _idPlanContingencia INT,
    IN _descripcion VARCHAR(500)
)
BEGIN
    UPDATE PlanContingencia 
    SET descripcion = _descripcion
    WHERE idPlanContingencia = _idPlanContingencia;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_TAREA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_TAREA(
    IN _idTarea INT
)
BEGIN
    UPDATE Tarea SET activo = 0 WHERE idTarea = _idTarea;
    UPDATE UsuarioXTarea SET activo = 0 WHERE idTarea = _idTarea;
END$

------------
-- Autoevaluacion
------------

DROP PROCEDURE IF EXISTS INSERTAR_USUARIO_EVALUACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_USUARIO_EVALUACION(
    IN _idAutoEvaluacionXProyecto INT,
    IN _idUsuario INT,
    IN _idUsuarioEvaluado INT
)
BEGIN
	DECLARE _idUsuarioEvaluacion INT;
	INSERT INTO UsuarioXEvaluacion(idUsuario,idAutoEvaluacionXProyecto,idUsuarioEvaluado,activo) 
    VALUES(_idUsuario,_idAutoEvaluacionXProyecto,_idUsuarioEvaluado,1);
    SET _idUsuarioEvaluacion = @@last_insert_id;
    SELECT _idUsuarioEvaluacion AS idUsuarioEvaluacion;
END$

DROP PROCEDURE IF EXISTS INSERTAR_CRITERIO_AUTOEVALUACION;
DELIMITER $
CREATE PROCEDURE INSERTAR_CRITERIO_AUTOEVALUACION(
    IN _idUsuarioEvaluacion INT,
    IN _criterio1 VARCHAR(500),
    IN _criterio2 VARCHAR(500),
    IN _criterio3 VARCHAR(500),
    IN _criterio4 VARCHAR(500)
)
BEGIN
	DECLARE _idCriterioEvaluacion INT;
	INSERT INTO CriterioEvaluacion(idUsuarioEvaluacion,criterio,nota,activo) 
    VALUES(_idUsuarioEvaluacion,_criterio1,0,1);
    INSERT INTO CriterioEvaluacion(idUsuarioEvaluacion,criterio,nota,activo) 
    VALUES(_idUsuarioEvaluacion,_criterio2,0,1);
    INSERT INTO CriterioEvaluacion(idUsuarioEvaluacion,criterio,nota,activo) 
    VALUES(_idUsuarioEvaluacion,_criterio3,0,1);
    INSERT INTO CriterioEvaluacion(idUsuarioEvaluacion,criterio,nota,activo) 
    VALUES(_idUsuarioEvaluacion,_criterio4,0,1);
    SET _idUsuarioEvaluacion = @@last_insert_id;
    SELECT _idUsuarioEvaluacion AS idUsuarioEvaluacion;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACION_X_USUARIO;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACION_X_USUARIO(
    IN _idProyecto INT,
    IN _idUsuario INT
)
BEGIN
    SELECT ue.idUsuarioEvaluacion, ue.idUsuario, u.nombres as "nombreEvaluador", u.apellidos as "apellidoEvaluador", 
    ue.idUsuarioEvaluado, ur.nombres as "nombreEvaluado", ur.apellidos as "apellidoEvaluado", ue.activo, ue.observaciones
	FROM UsuarioXEvaluacion AS ue
    LEFT JOIN Usuario AS u ON ue.idUsuario = u.idUsuario
    LEFT JOIN Usuario AS ur ON ue.idUsuarioEvaluado = ur.idUsuario
    LEFT JOIN AutoEvaluacionXProyecto AS ae ON ue.idAutoEvaluacionXProyecto = ae.idAutoEvaluacionXProyecto
    LEFT JOIN Autoevaluacion AS a ON a.idAutoevaluacion = ae.idAutoevaluacion
	WHERE a.idProyecto = _idProyecto AND ae.estado=1 AND ue.idUsuario = _idUsuario;
END$

DROP PROCEDURE IF EXISTS LISTAR_CRITERIO_AUTOEVALUACION;
DELIMITER $
CREATE PROCEDURE LISTAR_CRITERIO_AUTOEVALUACION(
    IN _idUsuarioEvaluacion INT
)
BEGIN
    SELECT *
	FROM CriterioEvaluacion
	WHERE idUsuarioEvaluacion = _idUsuarioEvaluacion AND activo=1;
END$

DROP PROCEDURE IF EXISTS ACTUALIZAR_OBSERVACION_X_ID;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_OBSERVACION_X_ID(
    IN _idUsuarioEvaluacion INT,
    IN _observaciones VARCHAR(500)
)
BEGIN
    UPDATE UsuarioXEvaluacion 
    SET observaciones = _observaciones
    WHERE idUsuarioEvaluacion = _idUsuarioEvaluacion;
END$

DROP PROCEDURE IF EXISTS ACTUALIZAR_NOTACRITERIO_X_ID;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_NOTACRITERIO_X_ID(
    IN _idCriterioEvaluacion INT,
    IN _criterio VARCHAR(500),
    IN _nota DOUBLE
)
BEGIN
    UPDATE CriterioEvaluacion 
    SET criterio = _criterio,
        nota = _nota
    WHERE idCriterioEvaluacion = _idCriterioEvaluacion;
END$

DROP PROCEDURE IF EXISTS LISTAR_MIEMBRO_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_MIEMBRO_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT up.idUsuario, u.nombres, u.apellidos, u.correoElectronico, u.activo
	FROM UsuarioXRolXProyecto AS up
    LEFT JOIN Usuario AS u ON up.idUsuario = u.idUsuario
	WHERE up.idProyecto = _idProyecto AND up.activo=1 AND up.idRol=3;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACIONES_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACIONES_X_IDPROYECTO(IN _idProyecto INT)
BEGIN
    SELECT *
	FROM AutoEvaluacionXProyecto
	WHERE idProyecto = _idProyecto AND up.activo=1 AND up.idRol=3;
END$
------------
-- Rol Equipo
------------
DROP PROCEDURE IF EXISTS INSERTAR_ROL_EQUIPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_ROL_EQUIPO(
    IN _idEquipo INT,
    IN _nombreRol VARCHAR(200)
)
BEGIN
	DECLARE _idRolEquipo INT;
	INSERT INTO RolesEquipo(nombreRol,idEquipo,estado) 
    VALUES(_nombreRol,_idEquipo,1);
    SET _idRolEquipo = @@last_insert_id;
    SELECT _idRolEquipo AS idRolEquipo;
END$

DROP PROCEDURE IF EXISTS INSERTAR_ROL_EQUIPO
DELIMITER $
CREATE PROCEDURE INSERTAR_ROL_EQUIPO(
    IN _idProyecto INT,
    IN _nombreRol VARCHAR(200)
)
BEGIN
	DECLARE _idRolEquipo INT;
	INSERT INTO RolEquipo(nombreRol,activo,idProyecto) 
    VALUES(_nombreRol,1,_idProyecto);
    SET _idRolEquipo = @@last_insert_id;
    SELECT _idRolEquipo AS idRolEquipo;
END$

DROP PROCEDURE IF EXISTS LISTAR_ROL_EQUIPO;
DELIMITER $
CREATE PROCEDURE LISTAR_ROL_EQUIPO(
    IN _idProyecto INT
)
BEGIN
	SELECT *
    FROM RolEquipo
    WHERE idProyecto = _idProyecto
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_ROL_EQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_ROL_EQUIPO(
    IN _idRolEquipo INT
)
BEGIN
	UPDATE RolesEquipo
    SET estado = 0
    WHERE idRolEquipo = _idRolEquipo;
END$

DROP PROCEDURE IF EXISTS INSERTAR_NUEVO_EQUIPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_NUEVO_EQUIPO(
    IN _idProyecto INT,
    IN _nombre VARCHAR(200),
    IN _idLider INT
)
BEGIN
	DECLARE _idEquipo INT;
    DECLARE _idRolEquipo INT;
	INSERT INTO Equipo(idProyecto,nombre,fechaCreacion,activo,idLider) 
    VALUES(_idProyecto,_nombre,NOW(),1,_idLider);
    SET _idEquipo = @@last_insert_id;
    INSERT INTO RolesEquipo(nombreRol, idEquipo, estado)
    VALUES("Lider",_idEquipo,1);
    SET _idRolEquipo = @@last_insert_id;
    INSERT INTO UsuarioXEquipo(idUsuario, idEquipo, activo, idRol)
    VALUES(_idLider,_idEquipo,1, _idRolEquipo);
    SELECT _idEquipo AS idEquipo;
END$

DROP PROCEDURE IF EXISTS INSERTAR_MIEMBROS_EQUIPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_MIEMBROS_EQUIPO(
    IN _idEquipo INT,
    IN _idUsuario INT,
    IN _idRol INT
)
BEGIN
	DECLARE _idUsuarioXEquipo INT;
    -- Verificar si ya existe un registro para este idEquipo e idUsuario
    SELECT idUsuarioXEquipo INTO _idUsuarioXEquipo
    FROM UsuarioXEquipo
    WHERE idEquipo = _idEquipo AND idUsuario = _idUsuario;
    IF _idUsuarioXEquipo IS NOT NULL THEN
        -- Si existe, actualiza el registro existente
        UPDATE UsuarioXEquipo
        SET activo = 1, idRol = _idRol
        WHERE idUsuarioXEquipo = _idUsuarioXEquipo;
    ELSE
        -- Si no existe, inserta un nuevo registro
        INSERT INTO UsuarioXEquipo(idUsuario, idEquipo, activo, idRol)
        VALUES(_idUsuario, _idEquipo, 1, _idRol);
        SET _idUsuarioXEquipo = @@last_insert_id;
    END IF;
    SELECT _idUsuarioXEquipo AS idUsuarioXEquipo;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_EQUIPOS_X_ID_EQUIPO;
DELIMITER //
CREATE DEFINER=`admin`@`%`PROCEDURE `ELIMINAR_EQUIPOS_X_ID_EQUIPO`(
	IN _idEquipo INT
)
BEGIN
	UPDATE Equipo SET activo = 0 WHERE idEquipo = _idEquipo;
	UPDATE UsuarioXEquipoXRolEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE RolEquipo SET activo = 0
		WHERE idRolEquipo IN (
			SELECT DISTINCT idRolEquipo FROM UsuarioXEquipoXRolEquipo WHERE idEquipo = _idEquipo
		);
END; //
DELIMITER ;

DROP PROCEDURE IF EXISTS ELIMINAR_EQUIPO_X_IDEQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_EQUIPO_X_IDEQUIPO(
    IN _idEquipo INT
)
BEGIN
	UPDATE Equipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE UsuarioXEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE RolesEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_PROYECTO_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_PROYECTO_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
	UPDATE Equipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE UsuarioXEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE RolesEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT,
    IN _idRolEquipo INT
)
BEGIN
    UPDATE UsuarioXEquipoXRolEquipo
    SET idRolEquipo = _idRolEquipo
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT
)
BEGIN
    UPDATE UsuarioXEquipoXRolEquipo
    SET activo = 0
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS OBTENER_idRol_X_idUsuario;
DELIMITER $
CREATE PROCEDURE OBTENER_idRol_X_idUsuario(
    IN _idProyecto INT,
    IN _idUsuario INT
)
BEGIN
	SELECT up.idRol
    FROM Usuario AS u
    LEFT JOIN UsuarioXRolXProyecto as up ON u.idUsuario = up.idUsuario
    WHERE u.idUsuario = _idUsuario 
    AND up.idProyecto = _idProyecto
    AND u.activo = 1
    AND u.idRol;
END$

DROP PROCEDURE IF EXISTS VERIFICAR_EXISTE_EVALUACION;
DELIMITER $
CREATE PROCEDURE VERIFICAR_EXISTE_EVALUACION(
    IN _idProyecto INT
)
BEGIN
	SELECT ue.idAutoEvaluacion
    FROM UsuarioXEvaluacion AS ue
    LEFT JOIN Autoevaluacion as ae ON ue.idAutoevaluacion = ae.idAutoevaluacion
    WHERE ae.idProyecto = _idProyecto 
    AND ae.activo = 1;
END$

-----------------------
-- Catalogo de Riesgos
-----------------------

DROP PROCEDURE IF EXISTS INSERTAR_INTERESADO_AUTORIDAD;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADO_AUTORIDAD(
    IN _nombreAutoridad VARCHAR(200)
)
BEGIN
	DECLARE _idInteresadoAutoridad INT;
	INSERT INTO InteresadoAutoridad(nombreAutoridad,activo) 
    VALUES(_nombreAutoridad,1);
    SET _idInteresadoAutoridad = @@last_insert_id;
    SELECT _idInteresadoAutoridad AS idInteresadoAutoridad;
END$

DROP PROCEDURE IF EXISTS INSERTAR_INTERESADO_ADHESION;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADO_ADHESION(
    IN _nombreAdhesion VARCHAR(200)
)
BEGIN
	DECLARE _idInteresadoAdhesionActual INT;
	INSERT INTO InteresadoAdhesion(nombreAdhesion,activo) 
    VALUES(_nombreAdhesion,1);
    SET _idInteresadoAdhesionActual = @@last_insert_id;
    SELECT _idInteresadoAdhesionActual AS idInteresadoAdhesionActual;
END$

DROP PROCEDURE IF EXISTS LISTAR_INTERESADO_AUTORIDAD;
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADO_AUTORIDAD()
BEGIN
	SELECT *
    FROM InteresadoAutoridad
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_INTERESADO_ADHESION;
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADO_ADHESION()
BEGIN
	SELECT *
    FROM InteresadoAdhesion
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_INTERESADO_ADHESION;
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADO_ADHESION()
BEGIN
	SELECT *
    FROM InteresadoAdhesion
    WHERE activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_INTERESADO;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADO(
    IN _idProyecto INT,
    IN _nombreCompleto VARCHAR(200),
    IN _rolEnProyecto VARCHAR(200),
    IN _organizacion VARCHAR(200),
    IN _cargo VARCHAR(200),
    IN _correo VARCHAR(200),
    IN _telefono VARCHAR(12),
    IN _datosContacto VARCHAR(200),
    IN _idNivelAutoridad INT,
    IN _idNivelAdhesionActual INT,
    IN _idNivelAdhesionDeseado INT
)
BEGIN
	DECLARE _idInteresado INT;
    SET @_idCatalogoInteresado = (SELECT idCatalogoInteresado FROM CatalogoInteresado WHERE idProyecto = _idProyecto AND activo = 1);
	INSERT INTO Interesado(idCatalogoInteresado,nombreCompleto,rolEnProyecto,organizacion,cargo,correo,telefono,datosContacto,
        idNivelAutoridad,idNivelAdhesionActual,idNivelAdhesionDeseado,activo) 
    VALUES(@_idCatalogoInteresado,_nombreCompleto,_rolEnProyecto,_organizacion,_cargo,_correo,_telefono,_datosContacto,
        _idNivelAutoridad,_idNivelAdhesionActual,_idNivelAdhesionDeseado,1);
    SET _idInteresado = @@last_insert_id;
    SELECT _idInteresado AS idInteresado;
END$

DROP PROCEDURE IF EXISTS INSERTAR_INTERESADO_REQUERIMIENTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADO_REQUERIMIENTO(
    IN _idInteresado INT,
    IN _descripcion VARCHAR(200)
)
BEGIN
	DECLARE _idRequerimiento INT;
	INSERT INTO InteresadoRequerimiento(idInteresado,descripcion,activo) 
    VALUES(_idInteresado,_descripcion,1);
    SET _idRequerimiento = @@last_insert_id;
    SELECT _idRequerimiento AS idRequerimiento;
END$

DROP PROCEDURE IF EXISTS INSERTAR_INTERESADO_ESTRATEGIA;
DELIMITER $
CREATE PROCEDURE INSERTAR_INTERESADO_ESTRATEGIA(
    IN _idInteresado INT,
    IN _descripcion VARCHAR(200)
)
BEGIN
	DECLARE _idEstrategia INT;
	INSERT INTO InteresadoEstrategia(idInteresado,descripcion,activo) 
    VALUES(_idInteresado,_descripcion,1);
    SET _idEstrategia = @@last_insert_id;
    SELECT _idEstrategia AS idEstrategia;
END$

DROP PROCEDURE IF EXISTS LISTAR_CATALOGO_INTERESADOS;
DELIMITER $
CREATE PROCEDURE LISTAR_CATALOGO_INTERESADOS(
    IN _idProyecto INT
)
BEGIN
    SELECT i.idInteresado, i.idCatalogoInteresado, i.nombreCompleto, i.rolEnProyecto , i.organizacion, i.cargo, i.correo, i.telefono, i.datosContacto,
        i.idNivelAutoridad, ia.nombreAutoridad, i.idNivelAdhesionActual, iaa.nombreAdhesion as "nombreAdhesionActual", i.idNivelAdhesionDeseado , iad.nombreAdhesion as "nombreAdhesionDeseado",i.activo
    FROM Interesado AS i
    LEFT JOIN CatalogoInteresado AS ci ON i.idCatalogoInteresado = ci.idCatalogoInteresado
    LEFT JOIN InteresadoAutoridad AS ia ON i.idNivelAutoridad = ia.idInteresadoAutoridad
    LEFT JOIN InteresadoAdhesion AS iaa ON i.idNivelAdhesionActual = iaa.idInteresadoAdhesionActual
    LEFT JOIN InteresadoAdhesion AS iad ON i.idNivelAdhesionDeseado = iad.idInteresadoAdhesionActual
    WHERE ci.idProyecto = _idProyecto
    AND i.activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_CATALOGO_INTERESADO_X_ID;
DELIMITER $
CREATE PROCEDURE LISTAR_CATALOGO_INTERESADO_X_ID(
    IN _idInteresado INT
)
BEGIN
    SELECT i.idInteresado, i.idCatalogoInteresado, i.nombreCompleto, i.rolEnProyecto , i.organizacion, i.cargo, i.correo, i.telefono, i.datosContacto,
        i.idNivelAutoridad, ia.nombreAutoridad, i.idNivelAdhesionActual, iaa.nombreAdhesion as "nombreAdhesionActual", i.idNivelAdhesionDeseado , iad.nombreAdhesion as "nombreAdhesionDeseado",i.activo
    FROM Interesado AS i
    LEFT JOIN InteresadoAutoridad AS ia ON i.idNivelAutoridad = ia.idInteresadoAutoridad
    LEFT JOIN InteresadoAdhesion AS iaa ON i.idNivelAdhesionActual = iaa.idInteresadoAdhesionActual
    LEFT JOIN InteresadoAdhesion AS iad ON i.idNivelAdhesionDeseado = iad.idInteresadoAdhesionActual
    WHERE i.idInteresado = _idInteresado
    AND i.activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_INTERESADO_REQUERIMIENTO;
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADO_REQUERIMIENTO(
    IN _idInteresado INT
)
BEGIN
    SELECT *
    FROM InteresadoRequerimiento
    WHERE idInteresado = _idInteresado
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS LISTAR_INTERESADO_ESTRATEGIA;
DELIMITER $
CREATE PROCEDURE LISTAR_INTERESADO_ESTRATEGIA(
    IN _idInteresado INT
)
BEGIN
    SELECT *
    FROM InteresadoEstrategia
    WHERE idInteresado = _idInteresado
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_CATALOGO_INTERESADO_X_ID;
DELIMITER $
CREATE PROCEDURE ELIMINAR_CATALOGO_INTERESADO_X_ID(
    IN _idInteresado INT
)
BEGIN
	UPDATE Interesado SET activo = 0 WHERE idInteresado = _idInteresado;
    UPDATE InteresadoRequerimiento SET activo = 0 WHERE idInteresado = _idInteresado;
    UPDATE InteresadoEstrategia SET activo = 0 WHERE idInteresado = _idInteresado;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_CATALOGO_INTERESADO_REQUERIMIENTO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_CATALOGO_INTERESADO_REQUERIMIENTO(
    IN _idRequerimiento INT
)
BEGIN
    UPDATE InteresadoRequerimiento SET activo = 0 WHERE idRequerimiento = _idRequerimiento;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_CATALOGO_INTERESADO_ESTRATEGIA;
DELIMITER $
CREATE PROCEDURE ELIMINAR_CATALOGO_INTERESADO_ESTRATEGIA(
    IN _idEstrategia INT
)
BEGIN
    UPDATE InteresadoEstrategia SET activo = 0 WHERE idEstrategia = _idEstrategia;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_CATALOGO_INTERESADO_X_ID;
DELIMITER $
CREATE PROCEDURE MODIFICAR_CATALOGO_INTERESADO_X_ID(
    IN _idInteresado INT,
    IN _nombreCompleto VARCHAR(200),
    IN _rolEnProyecto VARCHAR(200),
    IN _organizacion VARCHAR(200),
    IN _cargo VARCHAR(200),
    IN _correo VARCHAR(200),
    IN _telefono VARCHAR(12),
    IN _datosContacto VARCHAR(200),
    IN _idNivelAutoridad INT,
    IN _idNivelAdhesionActual INT,
    IN _idNivelAdhesionDeseado INT
)
BEGIN
    UPDATE Interesado 
    SET nombreCompleto = _nombreCompleto,
        rolEnProyecto = _rolEnProyecto,
        organizacion = _organizacion,
        cargo = _cargo,
        correo = _correo,
        telefono = _telefono,
        datosContacto = _datosContacto,
        idNivelAutoridad = _idNivelAutoridad,
        idNivelAdhesionActual = _idNivelAdhesionActual,
        idNivelAdhesionDeseado = _idNivelAdhesionDeseado
    WHERE idInteresado = _idInteresado;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_CATALOGO_INTERESADO_REQUERIMIENTO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_CATALOGO_INTERESADO_REQUERIMIENTO(
    IN _idRequerimiento INT,
    IN _descripcion VARCHAR(200)
)
BEGIN
    UPDATE InteresadoRequerimiento 
    SET descripcion = _descripcion
    WHERE idRequerimiento = _idRequerimiento;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_CATALOGO_INTERESADO_REQUERIMIENTO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_CATALOGO_INTERESADO_REQUERIMIENTO(
    IN _idRequerimiento INT,
    IN _descripcion VARCHAR(200)
)
BEGIN
    UPDATE InteresadoRequerimiento 
    SET descripcion = _descripcion
    WHERE idRequerimiento = _idRequerimiento;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_CATALOGO_INTERESADO_ESTRATEGIA;
DELIMITER $
CREATE PROCEDURE MODIFICAR_CATALOGO_INTERESADO_ESTRATEGIA(
    IN _idEstrategia INT,
    IN _descripcion VARCHAR(200)
)
BEGIN
    UPDATE InteresadoEstrategia 
    SET descripcion = _descripcion
    WHERE idEstrategia = _idEstrategia;
END$

DROP PROCEDURE IF EXISTS LISTAR_TODAS_AUTOEVALUACIONES_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_TODAS_AUTOEVALUACIONES_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
    SET @_idAutoevaluacion = (SELECT idAutoevaluacion FROM Autoevaluacion WHERE idProyecto = _idProyecto AND activo = 1);
    SELECT *
    FROM AutoEvaluacionXProyecto
    WHERE idAutoevaluacion = @_idAutoevaluacion;
END$

DROP PROCEDURE IF EXISTS LISTAR_CRITERIOS_X_IDAUTOEVALUACION;
DELIMITER $
CREATE PROCEDURE LISTAR_CRITERIOS_X_IDAUTOEVALUACION(
    IN _idAutoEvaluacionXProyecto INT
)
BEGIN
    SELECT ce.criterio
    FROM CriterioEvaluacion AS ce
    LEFT JOIN UsuarioXEvaluacion AS ue ON ce.idUsuarioEvaluacion = ue.idUsuarioEvaluacion
    WHERE ue.idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto
    GROUP BY ce.criterio;
END$

DROP PROCEDURE IF EXISTS ACTIVAR_AUTOEVALUACION_X_ID;
DELIMITER $
CREATE PROCEDURE ACTIVAR_AUTOEVALUACION_X_ID(
    IN _idProyecto INT,
    IN _idAutoEvaluacionXProyecto INT
)
BEGIN
    SET @_idAutoevaluacion = (SELECT idAutoevaluacion FROM Autoevaluacion WHERE idProyecto = _idProyecto AND activo = 1);
    UPDATE AutoEvaluacionXProyecto 
    SET estado = 0
    WHERE idAutoevaluacion = @_idAutoevaluacion AND estado != 2;
    UPDATE AutoEvaluacionXProyecto 
    SET estado = 1
    WHERE idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto;
END$

DROP PROCEDURE IF EXISTS FINALIZAR_AUTOEVALUACION_X_ID;
DELIMITER $
CREATE PROCEDURE FINALIZAR_AUTOEVALUACION_X_ID(
    IN _idAutoEvaluacionXProyecto INT
)
BEGIN
    UPDATE AutoEvaluacionXProyecto 
    SET estado = 2
    WHERE idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACION_DATOS;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACION_DATOS(
    IN _idProyecto INT
)
BEGIN
    SET @_idAutoevaluacion = (SELECT idAutoevaluacion FROM Autoevaluacion WHERE idProyecto = _idProyecto AND activo = 1);
    SELECT nombre, fechaInicio, fechaFin
    FROM AutoEvaluacionXProyecto
    WHERE idAutoevaluacion = @_idAutoevaluacion AND estado=1;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACION_NOTAS;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACION_NOTAS(
    IN _idAutoEvaluacionXProyecto INT,
    IN _idUsuario INT
)
BEGIN
    SELECT ue.idUsuarioEvaluado, ce.criterio, AVG(ce.nota) AS "Promedio"
    FROM UsuarioXEvaluacion  AS ue
    LEFT JOIN CriterioEvaluacion AS ce ON ue.idUsuarioEvaluacion = ce.idUsuarioEvaluacion
    WHERE ue.idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto
    AND ue.idUsuarioEvaluado = _idUsuario
    GROUP BY ce.criterio;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACION_MIEMBROS;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACION_MIEMBROS(
    IN _idAutoEvaluacionXProyecto INT
)
BEGIN
    SELECT ue.idUsuarioEvaluado, u.nombres, u.apellidos
    FROM UsuarioXEvaluacion AS ue
    LEFT JOIN Usuario AS u ON ue.idUsuarioEvaluado = u.idUsuario
    WHERE ue.idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto
    GROUP BY ue.idUsuarioEvaluado;
END$

DROP PROCEDURE IF EXISTS LISTAR_AUTOEVALUACION_OBSERVACIONES;
DELIMITER $
CREATE PROCEDURE LISTAR_AUTOEVALUACION_OBSERVACIONES(
    IN _idAutoEvaluacionXProyecto INT,
    IN _idUsuario INT
)
BEGIN
    SELECT observaciones
    FROM UsuarioXEvaluacion
    WHERE idAutoEvaluacionXProyecto = _idAutoEvaluacionXProyecto
    AND idUsuarioEvaluado = _idUsuario;
END$


DROP PROCEDURE IF EXISTS ELIMINAR_ROLES_EQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_ROLES_EQUIPO(
    IN _idRol INT
)
BEGIN
    UPDATE RolEquipo
    SET activo = 0
    WHERE idRolEquipo = _idRol;
END$

DROP PROCEDURE IF EXISTS INSERTAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT,
    IN _idRolEquipo INT
)
BEGIN
	DECLARE _idUsuarioXEquipoXRolEquipo INT;
    -- Verificamos si el registro ya existe
    SELECT idUsuarioXEquipoXRolEquipo INTO _idUsuarioXEquipoXRolEquipo
    FROM UsuarioXEquipoXRolEquipo
    WHERE idUsuario = _idUsuario AND idEquipo = _idEquipo;
    IF _idUsuarioXEquipoXRolEquipo IS NOT NULL THEN
        -- El registro ya existe, actualizamos el estado a 1
        UPDATE UsuarioXEquipoXRolEquipo
        SET activo = 1, idRolEquipo = _idRolEquipo
        WHERE idUsuario = _idUsuario AND idEquipo = _idEquipo;
    ELSE
        INSERT INTO UsuarioXEquipoXRolEquipo(idUsuario,idEquipo,idRolEquipo,activo) 
        VALUES(_idUsuario,_idEquipo,_idRolEquipo,1);
        SET _idUsuarioXEquipoXRolEquipo = @@last_insert_id;
    END IF;
    SELECT _idUsuarioXEquipoXRolEquipo AS idUsuarioXEquipoXRolEquipo;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE MODIFICAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT,
    IN _idRolEquipo INT
)
BEGIN
    UPDATE UsuarioXEquipoXRolEquipo
    SET idRolEquipo = _idRolEquipo
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT
)
BEGIN
    UPDATE UsuarioXEquipoXRolEquipo
    SET activo = 0
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_MIEMBRO_EQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_MIEMBRO_EQUIPO(
    IN _idUsuario INT,
    IN _idEquipo INT
)
BEGIN
    UPDATE UsuarioXEquipoXRolEquipo
    SET activo = 0
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS AGREGAR_ROLES_EQUIPO;
DELIMITER $
CREATE PROCEDURE AGREGAR_ROLES_EQUIPO(
    IN _idEquipo INT,
    IN _nombre VARCHAR(200)
)
BEGIN
    DECLARE _idRolEquipo INT;
	DECLARE _idEquipoXRolEquipo INT;
    SET @_idProyecto = (SELECT idProyecto FROM Equipo WHERE idEquipo = _idEquipo);
    -- Insertamos el rol primero en la tabla RolEquipo
	INSERT INTO RolEquipo(nombreRol,activo,idProyecto) 
    VALUES(_nombre,1,@_idProyecto);
    SET _idRolEquipo = @@last_insert_id;
END$

DROP PROCEDURE IF EXISTS INSERTAR_MIEMBRO_EQUIPO_NOMBRE_ROL;
DELIMITER $
CREATE PROCEDURE INSERTAR_MIEMBRO_EQUIPO_NOMBRE_ROL(
    IN _idUsuario INT,
    IN _idEquipo INT,
    IN _nombreRol VARCHAR(200)
)
BEGIN
	DECLARE _idUsuarioXEquipoXRolEquipo INT;
    SET @_idProyecto = (SELECT idProyecto FROM Equipo WHERE idEquipo = _idEquipo);
    SET @_idRolEquipo = (
        SELECT re.idRolEquipo 
        FROM RolEquipo AS re 
        WHERE re.idProyecto = @_idProyecto
        AND re.nombreRol = _nombreRol AND re.activo = 1);
    -- Verificamos si el registro ya existe
    SELECT idUsuarioXEquipoXRolEquipo INTO _idUsuarioXEquipoXRolEquipo
    FROM UsuarioXEquipoXRolEquipo
    WHERE idUsuario = _idUsuario AND idEquipo = _idEquipo;
    IF _idUsuarioXEquipoXRolEquipo IS NOT NULL THEN
        -- El registro ya existe, actualizamos el estado a 1
        UPDATE UsuarioXEquipoXRolEquipo
        SET activo = 1, idRolEquipo = @_idRolEquipo
        WHERE idUsuario = _idUsuario AND idEquipo = _idEquipo;
    ELSE
        INSERT INTO UsuarioXEquipoXRolEquipo(idUsuario,idEquipo,idRolEquipo,activo) 
        VALUES(_idUsuario,_idEquipo,@_idRolEquipo,1);
        SET _idUsuarioXEquipoXRolEquipo = @@last_insert_id;
    END IF;
    SELECT _idUsuarioXEquipoXRolEquipo AS idUsuarioXEquipoXRolEquipo;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_MIEMBRO_EQUIPO_NOMBRE_ROL;
DELIMITER $
CREATE PROCEDURE MODIFICAR_MIEMBRO_EQUIPO_NOMBRE_ROL(
    IN _idUsuario INT,
    IN _idEquipo INT,
    IN _nombreRol VARCHAR(200)
)
BEGIN
    SET @_idProyecto = (SELECT idProyecto FROM Equipo WHERE idEquipo = _idEquipo);
    SET @_idRolEquipo = (
        SELECT re.idRolEquipo 
        FROM RolEquipo AS re 
        WHERE re.idProyecto = @_idProyecto
        AND re.nombreRol = _nombreRol AND re.activo = 1);
    UPDATE UsuarioXEquipoXRolEquipo
    SET idRolEquipo = @_idRolEquipo
    WHERE idEquipo = _idEquipo 
    AND idUsuario = _idUsuario;
    SELECT _idUsuario AS idUsuario;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_EQUIPO_X_IDEQUIPO;
DELIMITER $
CREATE PROCEDURE ELIMINAR_EQUIPO_X_IDEQUIPO(
    IN _idEquipo INT
)
BEGIN
    UPDATE Equipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE UsuarioXEquipoXRolEquipo SET activo = 0 WHERE idEquipo = _idEquipo;
    UPDATE Tarea SET activo = 0 WHERE idEquipo = _idEquipo;
    SELECT _idEquipo AS idEquipo;
END$




DROP PROCEDURE IF EXISTS INSERTAR_ROL_MIEMBRO_LIDER;
DELIMITER $
CREATE PROCEDURE INSERTAR_ROL_MIEMBRO_LIDER(
    IN _idProyecto INT
)
BEGIN
    INSERT INTO RolEquipo(nombreRol, activo, idProyecto) VALUES("Líder", 1, _idProyecto);
    INSERT INTO RolEquipo(nombreRol, activo, idProyecto) VALUES("Miembro", 1, _idProyecto);
END$


-----------------------
-- Matriz de responsabilidades
-----------------------

DROP PROCEDURE IF EXISTS INSERTAR_RESPONSABILIDADROL_X_IDMATRIZ;
DELIMITER $
CREATE PROCEDURE INSERTAR_RESPONSABILIDADROL_X_IDMATRIZ(
    IN _idMatrizResponsabilidad INT
)
BEGIN
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) VALUES(_idMatrizResponsabilidad, "A", "Aprueba", "rgb(0,111,238)", 1, "Se encarga de aprobar y revisar tareas");
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) VALUES(_idMatrizResponsabilidad, "I", "Se le informa", "rgb(243,18,96)", 1, "Debe ser informado luego de una decisión o acción");
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) VALUES(_idMatrizResponsabilidad, "P", "Participa", "rgb(147,83,211)", 1, "Toma parte de las acciones y tareas hechas");
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) VALUES(_idMatrizResponsabilidad, "R", "Responsable", "rgb(23,201,100)", 1, "Responsable de completar tareas o entregables");
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) VALUES(_idMatrizResponsabilidad, "C", "Se le consulta", "rgb(245,165,36)", 1, "Asesor o experto a quien se le consulta antes de una acción");
END$

DELIMITER $
CREATE PROCEDURE LISTAR_RESPONSABILIDADROL_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
    SET @_idMatrizResponsabilidad = (SELECT idMatrizResponsabilidad FROM MatrizResponsabilidad WHERE idProyecto = _idProyecto AND activo = 1);
    SELECT idResponsabilidadRol as id, nombreRol as nombre, letraRol as letra, colorRol as color, descripcionRol as descripcion
    FROM ResponsabilidadRol
<<<<<<< HEAD
<<<<<<< HEAD
    WHERE idMatrizResponsabilidad = @_idMatrizResponsabilidad AND activo=1;
END$

--------------------------------------------------
-- Moneda
--------------------------------------------------
DROP PROCEDURE IF EXISTS ACTUALIZAR_TIPO_CAMBIO;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_TIPO_CAMBIO(
    IN _cambioUSD2PEN DECIMAL(10,2)
)
BEGIN
    UPDATE Moneda SET TipoCambio = _cambioUSD2PEN WHERE idMoneda = 1 AND activo =1;
=======
    WHERE idMatrizResponsabilidad = @_idMatrizResponsabilidad AND activo=1;
=======
    WHERE idMatrizResponsabilidad = @_idMatrizResponsabilidad AND activo=1;
>>>>>>> c992637d0c787667ce014b735cb886bf6c5de2ed
END
$

DELIMITER $
CREATE PROCEDURE LISTAR_ENTREGABLE_X_IDPROYECTO(
    IN _idProyecto INT
)
BEGIN
    SELECT e.idEntregable as id, e.nombre as nombre
    FROM Entregable AS e
    LEFT JOIN ComponenteEDT AS ce ON e.idComponente = ce.idComponente
    LEFT JOIN EDT AS ed ON ce.idEDT = ed.idEDT
    WHERE ed.idProyecto = _idProyecto AND e.activo=1;
END
$

DROP PROCEDURE IF EXISTS INSERTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL;
DELIMITER $
CREATE PROCEDURE INSERTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(
    IN _idEntregable INT,
    IN _idResponsabilidadRol INT,
    IN _idRol INT
)
BEGIN
    DECLARE _idEntregableXResponsabilidadXRol INT;
    INSERT INTO EntregableXResponsabilidadRol(idEntregable, idResponsabilidadRol, idRol, activo) 
    VALUES(_idEntregable, _idResponsabilidadRol, _idRol, 1);
    SET _idEntregableXResponsabilidadXRol = @@last_insert_id;
    SELECT _idEntregableXResponsabilidadXRol AS idEntregableXResponsabilidadXRol;
END$

DROP PROCEDURE IF EXISTS LISTAR_ROL_EQUIPO_MATRIZRESPONSABILIDAD;
DELIMITER $
CREATE PROCEDURE LISTAR_ROL_EQUIPO_MATRIZRESPONSABILIDAD(
    IN _idProyecto INT
)
BEGIN
	SELECT idRolEquipo as id, nombreRol as nombre
    FROM RolEquipo
    WHERE idProyecto = _idProyecto
    AND activo = 1;
END
$

DROP PROCEDURE IF EXISTS LISTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL;
DELIMITER $
CREATE PROCEDURE LISTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(
    IN _idProyecto INT
)
BEGIN
	SELECT err.idEntregableXResponsabilidadXRol, err.idRol, re.nombreRol, err.idEntregable, e.nombre as "nombreEntregable", err.idResponsabilidadRol as "idResponsabilidad",
        rr.nombreRol as "nombreResponsabilidad", rr.letraRol as "letraResponsabilidad", rr.colorRol as "colorResponsabilidad"
    FROM EntregableXResponsabilidadRol AS err
    LEFT JOIN Entregable AS e ON err.idEntregable = e.idEntregable
    LEFT JOIN ComponenteEDT AS ce ON e.idComponente = ce.idComponente
    LEFT JOIN EDT AS edt ON ce.idEDT = edt.idEDT
    LEFT JOIN ResponsabilidadRol AS rr ON err.idResponsabilidadRol = rr.idResponsabilidadRol
    LEFT JOIN RolEquipo AS re ON err.idRol = re.idRolEquipo
    WHERE edt.idProyecto = _idProyecto
    AND err.activo=1;
END

DROP PROCEDURE IF EXISTS ACTUALIZAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(
    IN _idEntregableXResponsabilidadXRol INT,
    IN _idEntregable INT,
    IN _idResponsabilidadRol INT,
    IN _idRol INT
)
BEGIN
    UPDATE EntregableXResponsabilidadRol 
    SET idEntregable = _idEntregable,
        idResponsabilidadRol = _idResponsabilidadRol,
        idRol = _idRol
    WHERE idEntregableXResponsabilidadXRol = _idEntregableXResponsabilidadXRol;
<<<<<<< HEAD
>>>>>>> f7a07c44e49712a1304fb61170a98d9e38ef9614
=======
END$

DROP PROCEDURE IF EXISTS INSERTAR_RESPONSABILIDADROL_X_IDPROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_RESPONSABILIDADROL_X_IDPROYECTO(
    IN _idProyecto INT,
    IN _letraRol VARCHAR(10),
    IN _nombreRol VARCHAR(100),
    IN _colorRol VARCHAR(100),
    IN _descrpcionRol VARCHAR(255)
)
BEGIN
    DECLARE _idResponsabilidadRol INT;
    SET @_idMatrizResponsabilidad = (SELECT idMatrizResponsabilidad FROM MatrizResponsabilidad WHERE idProyecto = _idProyecto AND activo = 1);
    INSERT INTO ResponsabilidadRol(idMatrizResponsabilidad, letraRol, nombreRol, colorRol, activo, descripcionRol) 
    VALUES(@_idMatrizResponsabilidad, _letraRol, _nombreRol, _colorRol, 1, _descrpcionRol);
    SET _idResponsabilidadRol = @@last_insert_id;
    SELECT _idResponsabilidadRol AS idResponsabilidadRol;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_RESPONSABILIDADROL_X_ID;
DELIMITER $
CREATE PROCEDURE ELIMINAR_RESPONSABILIDADROL_X_ID(
    IN _idResponsabilidadRol INT
)
BEGIN
    UPDATE ResponsabilidadRol
    SET activo = 0
    WHERE idResponsabilidadRol = _idResponsabilidadRol;
END$

DROP PROCEDURE IF EXISTS MODIFICAR_RESPONSABILIDADROL_X_ID;
DELIMITER $
CREATE PROCEDURE MODIFICAR_RESPONSABILIDADROL_X_ID(
    IN _idResponsabilidadRol INT,
    IN _letraRol VARCHAR(10),
    IN _nombreRol VARCHAR(100),
    IN _colorRol VARCHAR(100),
    IN _descrpcionRol VARCHAR(255)
)
BEGIN
    UPDATE ResponsabilidadRol
    SET letraRol = _letraRol,
        nombreRol = _nombreRol,
        colorRol = _colorRol,
        descripcionRol = _descrpcionRol
    WHERE idResponsabilidadRol = _idResponsabilidadRol;
    SELECT _idResponsabilidadRol AS idResponsabilidadRol;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_ENTREGABLE_X_RESPONSABILIDADROL_X_ID;
DELIMITER $
CREATE PROCEDURE ELIMINAR_ENTREGABLE_X_RESPONSABILIDADROL_X_ID(
    IN _idProyecto INT
)
BEGIN
    UPDATE EntregableXResponsabilidadRol AS err
    LEFT JOIN RolEquipo AS re ON err.idRol = re.idRolEquipo
    SET err.activo = 0
    WHERE re.idProyecto = _idProyecto;
END$

DELIMITER ;

-----------------------
-- Plantillas
-----------------------

DROP PROCEDURE IF EXISTS GUARDAR_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE GUARDAR_PLANTILLA_ACTACONSTITUCION(
    IN _idUsuario INT,
    IN _nombrePlantilla VARCHAR(200)
)
BEGIN
    DECLARE _idPlantillaAC INT;
    -- Primero creamos los datos iniciales de la plantilla
	INSERT INTO PlantillaActaConstitucion(idUsuario,activo,nombrePlantilla) 
    VALUES(_idUsuario,1,_nombrePlantilla);
    SET _idPlantillaAC = @@last_insert_id;
    -- Ahora con el idPlantillaAC copiamos los registros de la bd
    SELECT _idPlantillaAC AS idPlantillaAC;
END$

DROP PROCEDURE IF EXISTS LISTAR_NOMBRES_CAMPOS_AC;
DELIMITER $
CREATE PROCEDURE LISTAR_NOMBRES_CAMPOS_AC(
    IN _idActaConstitucion INT
)
BEGIN
    SELECT nombre
    FROM DetalleAC
    WHERE idActaConstitucion = _idActaConstitucion
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_PLANTILLA_AC_TIPODATO;
DELIMITER $
CREATE PROCEDURE INSERTAR_PLANTILLA_AC_TIPODATO(
    IN _idPlantillaAC INT,
    IN _nombre VARCHAR(255)
)
BEGIN
    INSERT INTO PlantillaACTipoDato(idPlantillaAC, nombre, activo)
    VALUES(_idPlantillaAC,_nombre, 1);
END$

DROP PROCEDURE IF EXISTS LISTAR_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE LISTAR_PLANTILLA_ACTACONSTITUCION(
    IN _idUsuario INT
)
BEGIN
    SELECT *
    FROM PlantillaActaConstitucion
    WHERE idUsuario = _idUsuario
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE ELIMINAR_PLANTILLA_ACTACONSTITUCION(
    IN _idPlantillaAC INT
)
BEGIN
    UPDATE PlantillaActaConstitucion SET activo = 0 WHERE idPlantillaAC = _idPlantillaAC;
    UPDATE PlantillaACTipoDato SET activo = 0 WHERE idPlantillaAC = _idPlantillaAC;
END$

DROP PROCEDURE IF EXISTS LISTAR_CAMPOS_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE LISTAR_CAMPOS_PLANTILLA_ACTACONSTITUCION(
    IN _idPlantillaAC INT
)
BEGIN
    SELECT nombre
    FROM PlantillaACTipoDato
    WHERE idPlantillaAC = _idPlantillaAC
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_CAMPOS_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE INSERTAR_CAMPOS_PLANTILLA_ACTACONSTITUCION(
    IN _idActaConstitucion INT,
    IN _nombre VARCHAR(500)
)
BEGIN
    DECLARE _idDetalle INT;
    -- Verificamos si el registro ya existe
    SELECT idDetalle INTO _idDetalle
    FROM DetalleAC
    WHERE idActaConstitucion = _idActaConstitucion AND nombre = _nombre;
    IF _idDetalle IS NOT NULL THEN
        -- El registro ya existe, actualizamos el estado a 1
        UPDATE DetalleAC
        SET activo = 1
        WHERE idDetalle = _idDetalle;
    ELSE
        INSERT INTO DetalleAC(idActaConstitucion,nombre,activo) 
        VALUES(_idActaConstitucion,_nombre,1);
    END IF;
END$

DROP PROCEDURE IF EXISTS LIMPIAR_DETALLEAC_PLANTILLA_ACTACONSTITUCION;
DELIMITER $
CREATE PROCEDURE LIMPIAR_DETALLEAC_PLANTILLA_ACTACONSTITUCION(
    IN _idActaConstitucion INT
)
BEGIN
    UPDATE DetalleAC SET activo = 0 WHERE idActaConstitucion = _idActaConstitucion;
    UPDATE DetalleAC SET detalle = null WHERE idActaConstitucion = _idActaConstitucion;
END$

DROP PROCEDURE IF EXISTS GUARDAR_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE GUARDAR_PLANTILLA_KANBAN(
    IN _idUsuario INT,
    IN _nombrePlantilla VARCHAR(200)
)
BEGIN
    DECLARE _idPlantillaKanban INT;
    -- Primero creamos los datos iniciales de la plantilla
	INSERT INTO PlantillaKanban(idUsuario,nombrePlantilla,activo) 
    VALUES(_idUsuario,_nombrePlantilla,1);
    SET _idPlantillaKanban = @@last_insert_id;
    -- Ahora con el idPlantillaAC copiamos los registros de la bd
    SELECT _idPlantillaKanban AS idPlantillaKanban;
END$

DROP PROCEDURE IF EXISTS LISTAR_CAMPOS_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE LISTAR_CAMPOS_PLANTILLA_KANBAN(
    IN _idProyecto INT
)
BEGIN
    SELECT nombre, posicion
    FROM ColumnaKanban
    WHERE idProyecto = _idProyecto
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_PLANTILLA_KANBAN_CAMPO;
DELIMITER $
CREATE PROCEDURE INSERTAR_PLANTILLA_KANBAN_CAMPO(
    IN _idPlantillaKanban INT,
    IN _nombre VARCHAR(255),
    IN _posicion INT
)
BEGIN
    INSERT INTO PlantillaKanbanColumnas(idPlantillaKanban, nombre, posicion, activo)
    VALUES(_idPlantillaKanban,_nombre,_posicion, 1);
END$

DROP PROCEDURE IF EXISTS LISTAR_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE LISTAR_PLANTILLA_KANBAN(
    IN _idUsuario INT
)
BEGIN
    SELECT *
    FROM PlantillaKanban
    WHERE idUsuario = _idUsuario
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS ELIMINAR_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE ELIMINAR_PLANTILLA_KANBAN(
    IN _idPlantillaKanban INT
)
BEGIN
    UPDATE PlantillaKanban SET activo = 0 WHERE idPlantillaKanban = _idPlantillaKanban;
    UPDATE PlantillaKanbanColumnas SET activo = 0 WHERE idPlantillaKanban = _idPlantillaKanban;
END$

DROP PROCEDURE IF EXISTS LIMPIAR_KANBAN_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE LIMPIAR_KANBAN_PLANTILLA_KANBAN(
    IN _idProyecto INT
)
BEGIN
    SET @contador = 0;
    UPDATE ColumnaKanban SET activo = 0 WHERE idProyecto = _idProyecto;
    UPDATE Tarea AS tr
    LEFT JOIN Cronograma AS cr ON tr.idCronograma = cr.idCronograma
    SET tr.posicionKanban = (@contador := @contador + 1),
        tr.idColumnaKanban = 0
    WHERE cr.idProyecto = _idProyecto;
END$

DROP PROCEDURE IF EXISTS LISTAR_CAMPOS_PLANTILLA_KANBAN_X_IDPLANTILLA;
DELIMITER $
CREATE PROCEDURE LISTAR_CAMPOS_PLANTILLA_KANBAN_X_IDPLANTILLA(
    IN _idPlantillaKanban INT
)
BEGIN
    SELECT nombre, posicion
    FROM PlantillaKanbanColumnas
    WHERE idPlantillaKanban = _idPlantillaKanban
    AND activo = 1;
END$

DROP PROCEDURE IF EXISTS INSERTAR_CAMPOS_PLANTILLA_KANBAN;
DELIMITER $
CREATE PROCEDURE INSERTAR_CAMPOS_PLANTILLA_KANBAN(
    IN _idProyecto INT,
    IN _nombre VARCHAR(500),
    IN _posicion INT
)
BEGIN
    DECLARE _idColumnaKanban INT;
    -- Verificamos si el registro ya existe
    SELECT idColumnaKanban INTO _idColumnaKanban
    FROM ColumnaKanban
    WHERE idProyecto = _idProyecto AND nombre = _nombre AND posicion = _posicion;
    IF _idColumnaKanban IS NOT NULL THEN
        -- El registro ya existe, actualizamos el estado a 1
        UPDATE ColumnaKanban
        SET activo = 1
        WHERE idColumnaKanban = _idColumnaKanban;
    ELSE
        INSERT INTO ColumnaKanban(idProyecto,nombre,posicion,activo) 
        VALUES(_idProyecto,_nombre,_posicion,1);
    END IF;
END$

########################################
## REPORTES
########################################
SELECT * FROM Herramienta;

DROP PROCEDURE IF EXISTS INSERTAR_REPORTE_X_PROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_REPORTE_X_PROYECTO(
    IN _idProyecto INT,
    IN _idHerramienta INT,
    IN _nombre VARCHAR(255)
)
BEGIN
    DECLARE _idReporte INT;
	INSERT INTO ReporteXProyecto(idProyecto,idHerramienta,nombre,fechaCreacion,activo)
    VALUES (_idProyecto,_idHerramienta,_nombre,CURDATE(),1);
    SET _idReporte = @@last_insert_id;
    SELECT _idReporte as idReporte;
END$
DROP PROCEDURE IF EXISTS LISTAR_REPORTES_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_REPORTES_X_ID_PROYECTO(
    IN _idProyecto INT
)
BEGIN
	SELECT rp.idReporteXProyecto,rp.fileId,rp.nombre ,rp.fechaCreacion, rp.fechaCreacion,h.idHerramienta, h.nombre as nombreHerramienta
    FROM ReporteXProyecto rp LEFT JOIN Herramienta h ON h.idHerramienta = rp.idHerramienta WHERE rp.idProyecto = _idProyecto and rp.activo=1;
END$

CALL LISTAR_REPORTES_X_ID_PROYECTO(178);

DROP PROCEDURE IF EXISTS ACTUALIZAR_FILE_ID;
DELIMITER $
CREATE PROCEDURE ACTUALIZAR_FILE_ID(
    IN _idReporteXProyecto INT,
    IN _fileId VARCHAR(50)
)
BEGIN
	UPDATE ReporteXProyecto
    SET fileId = _fileId
    WHERE idReporteXProyecto = _idReporteXProyecto AND activo=1;
END$

SELECT * FROM ReporteXProyecto;

DROP PROCEDURE IF EXISTS INSERTAR_GRUPO_PROYECTO;
DELIMITER $
CREATE PROCEDURE INSERTAR_GRUPO_PROYECTO(
    IN _nombre VARCHAR(200)
)
BEGIN
    DECLARE activo_val TINYINT;
    DECLARE _idGrupoDeProyecto INT;
    /* Generating the 'activo' value, for instance, setting it to 1 */
    SET activo_val = 1;
    /* Inserting a new record into the table using the provided parameters and the generated 'activo' value */
    INSERT INTO GrupoDeProyecto (nombre, codigo, activo) 
    VALUES (_nombre, 1, 1);
    SET _idGrupoDeProyecto = @@last_insert_id;
    SELECT _idGrupoDeProyecto AS idGrupoDeProyecto;
END$
DELIMITER ;
