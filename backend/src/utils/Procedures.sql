
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

DROP PROCEDURE LISTAR_EPICAS_X_ID_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_EPICAS_X_ID_PROYECTO(
	IN _idProyecto INT
)
BEGIN
	SELECT *FROM Epica p WHERE p.idProductBacklog = (SELECT idProductBacklog FROM ProductBacklog b WHERE b.idProyecto = _idProyecto AND b.activo=1) 
    AND p.activo =1;
END$
CALL LISTAR_EPICAS_X_ID_PROYECTO(6);

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
	SELECT idHerramienta 
    FROM HerramientaXProyecto 
    WHERE idProyecto = _idProyecto 
    AND activo=1
    ORDER BY idHerramienta;
END$

DROP PROCEDURE IF EXISTS LISTAR_USUARIOS_X_ROL_X_PROYECTO;
DELIMITER $
CREATE PROCEDURE LISTAR_USUARIOS_X_ID_ROL_X_ID_PROYECTO(
    IN _idProyecto INT,
    IN _idRol INT
)
BEGIN
	SELECT u.idUsuario, u.nombres, u.apellidos FROM Usuario u, UsuarioXRolXProyecto urp WHERE u.idUsuario = urp.idUsuario AND urp.idProyecto = _idProyecto AND urp.idRol = _idRol AND urp.activo = 1;
END$

CALL LISTAR_USUARIOS_X_ROL_X_PROYECTO(6,2);

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