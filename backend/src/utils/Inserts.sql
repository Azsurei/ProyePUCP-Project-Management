INSERT INTO GrupoDeProyecto(nombre,codigo,activo) VALUES("Ingesoft","INF245",1);
-- INSERTS ROLES
INSERT INTO Rol(nombre,descripcion,activo) VALUES ('Jefe de Proyecto','Es el jefe de proyecto',1);
INSERT INTO Rol(nombre,descripcion,activo) VALUES ('Supervisor','Es el supervisor',1);
INSERT INTO Rol(nombre,descripcion,activo) VALUES ('Miembro','Es el miembro del proyecto',1);

-- INSERTS Historia Estado
INSERT INTO HistoriaEstado (descripcion, activo) VALUES ('Aprobacion pendiente', 1);
INSERT INTO HistoriaEstado (descripcion, activo) VALUES ('No iniciado', 1);
INSERT INTO HistoriaEstado (descripcion, activo) VALUES ('En progreso', 1);
INSERT INTO HistoriaEstado (descripcion, activo) VALUES ('Verificacion de pruebas', 1);
INSERT INTO HistoriaEstado (descripcion, activo) VALUES ('Hecho', 1);

-- INSERTS Historia Prioridad

INSERT INTO HistoriaPrioridad (nombre, descripcion, RGB, activo)VALUES('Must', 'Alta', '#FF7878', 1);
INSERT INTO HistoriaPrioridad (nombre, descripcion, RGB, activo)VALUES('Should', 'Media', '#FF8C00', 1);
INSERT INTO HistoriaPrioridad (nombre, descripcion, RGB, activo)VALUES('Could', 'Baja', '#FFFF00', 1);
    
-- INSERTS Herramienta

INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Product Backlog','Es un product backlog',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('EDT','Es un EDT',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Acta de constitucion','Es un acta de constitucion',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Cronograma','Es un cronograma',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Catalogo de riesgo','Es un catalogo de riesgos',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Catalogo de interesados','Es un catalogo de interesados',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Matriz de responsabilidad','Es una matriz de responsabilidad',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Matriz de comunicacion','Es una matriz de comunicacion',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Autoevaluacion','Es una autoevaluacion',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Retrospectiva','Es una retrospectiva',NULL, 1);
INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Acta de reunion','Es una acta de reunion',NULL, 1);

-- INSERTS EDT

-- PRIMER EDT
CALL INSERTAR_EDT(6,'EDT 1','Es el primer EDT de la BD',77,1);
CALL INSERTAR_EDT(6,'EDT 2','Es el segundo EDT de la BD',77,1);

-- COMPONENTE EDT RAIZ
CALL INSERTAR_COMPONENTE_EDT(1,1,'Componente EDT raiz de la BD','0','Raiz','Este componente es de uso interno para creacion correcta de componentes');

CALL INSERTAR_COMPONENTE_EDT(1,2,'Componente1','1','Raiz1 ','Sample');
CALL INSERTAR_COMPONENTE_EDT(2,2,'Componente1.1','1.1','Prueba ','Sample');
CALL INSERTAR_COMPONENTE_EDT(2,2,'Componente1.2','1.2','Prueba ','Sample');
CALL INSERTAR_COMPONENTE_EDT(3,2,'Componente1.1.1','1.1.1','Prueba ','Sample');
