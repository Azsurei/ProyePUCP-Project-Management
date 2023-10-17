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