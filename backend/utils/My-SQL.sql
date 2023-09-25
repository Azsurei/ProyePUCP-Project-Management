# Eliminacion de Tablas
DROP TABLE IF EXISTS ProyectoXGrupoProyecto;
DROP TABLE IF EXISTS GrupoProyecto;
DROP TABLE IF EXISTS Proyecto;

# Creacion Tablas
#==================Proyecto====================
-- Grupo Proyecto
CREATE TABLE GrupoProyecto (
    idGrupoProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    activo tinyint NOT NULL
);
-- Proyecto
CREATE TABLE Proyecto(
	idProyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    maxCantParticipantes INT DEFAULT 8,
    fechaInicio DATE,
    fechaFin DATE,
    fechaUltimaModificacion DATE ,
    activo tinyint NOT NULL
);
-- Tabla intermedia
CREATE TABLE ProyectoXGrupoProyecto(
    idGrupoProyecto INT,
    idProyecto INT,
    PRIMARY KEY (idGrupoProyecto, idProyecto),
    FOREIGN KEY (idGrupoProyecto) REFERENCES GrupoProyecto(idGrupoProyecto),
    FOREIGN KEY (idProyecto) REFERENCES Proyecto(idProyecto)
);

## Creacion de Procedimientos Almacenados
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
