DELIMITER $
CREATE TRIGGER TRIGGER_INSERTAR_DETALLEAC_CREADO 
AFTER INSERT ON ActaConstitucion
FOR EACH ROW
BEGIN
    INSERT INTO DetalleAC (idActaConstitucion, nombre, activo)
    VALUES 
        (NEW.idActaConstitucion, 'Propósito y Justificación del Proyecto', 1),
        (NEW.idActaConstitucion, 'Descripción del Proyecto y Entregables', 1),
        (NEW.idActaConstitucion, 'Presupuesto Estimado', 1),
        (NEW.idActaConstitucion, 'Premisas y Restricciones', 1),
        (NEW.idActaConstitucion, 'Riesgos Iniciales de Alto Nivel', 1),
        (NEW.idActaConstitucion, 'Requisitos de Aprobación del Proyecto', 1),
        (NEW.idActaConstitucion, 'Requerimientos de Alto Nivel', 1),
        (NEW.idActaConstitucion, 'Requerimientos del Producto', 1),
        (NEW.idActaConstitucion, 'Requerimientos del Proyecto', 1),
        (NEW.idActaConstitucion, 'Elaborado por', 1);
END$

DELIMITER $$
CREATE TRIGGER TRIGGER_ACTUALIZAR_TAREAS_POSTERIORES_X_TAREA_COMPLETADA_ANTES_DE_TIEMPO
AFTER UPDATE ON Tarea
FOR EACH ROW
BEGIN
  IF OLD.idEstado != 2 AND NEW.idEstado = 2 THEN
    UPDATE Tarea
    SET fechaInicio = CURDATE(), esPosterior = 0
    WHERE idTareaAnterior = OLD.idTarea;
  END IF;
END;
$$

DELIMITER $$
CREATE EVENT actualizarTareasInicioDia
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '23:59:00')
DO
BEGIN
  UPDATE Tarea
  SET esPosterior = 0, idEstado = 2
  WHERE fechaInicio = CURRENT_DATE + INTERVAL 1 DAY AND idEstado != 2;
END$$
