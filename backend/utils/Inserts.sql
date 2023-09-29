
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

-- INSERTS Herramienta

INSERT INTO Herramienta (nombre,descripcion,imageURL, activo) VALUES ('Product Backlog','Es un product backlog',NULL, 1);