class Proyecto {
    constructor(id, nombre, descripcion,curso, fechaInicio, fechaFin,fechaUltimaModificacion,maxCantParticipantes,activo) {
        this.id = id;
        this.nombre = nombre;
        this.curso = curso;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaUltimaModificacion = fechaUltimaModificacion;
        this.maxCantParticipantes = maxCantParticipantes;
        this.activo=activo;
    }
    // Método para obtener la duración del proyecto
}

module.exports = Proyecto;