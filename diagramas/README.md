
---
# Cambios 21/09/2023

## Proyecto:

Se elimina curso y se reemplaza por grupo proyecto.

**Falta actualizar esto en las pantallas**.

## EDT:
Se hace la creacion del componente EDT con caracteristica de recursividad para el manejo de un arbol de componentes.
El componente raiz sera un componente no usado, el cual solo señalara que este sera el componente padre del arbol.

### Componente EDT:

Se asocia el componente EDT con los roles debido a que se tiene un campo llamado "Responsable" del componente.

## Tareas y estadoTareas:
Se agrega una relacion del estadoDeTareas a proyecto para facilitar los querys de la BD.
Se necesita consulta de asociacion de estado para el backlog, dado que sus elementos tambien manejan este campo.

**Preguntar si la tabla entregables es global para el proyecto o solo para el EDT**

## SubGrupos

Se asocia con usuarioXproyectos para asignar tareas a sugbrupos en vez de a usuarios especificos.


## Catalogo de riesgos y Riesgos:

El riesgo esta conectado doblemente con usuarioXproyecto porque una conexion representa al dueño del riesgo y la otra representa al responsable de ejecucion.

## Matriz de responsabilidades:

Tomando como caso analogo la imagen del figma, un entregable es como un backlog, un participante, es como un JP, profesor y una responsabilidad es como A, I, P.

Se busca tener una tabla intermedia con las keys(id), del entregable, participante y responsabilidad, para poder facilitar los querys. Esto falta implemementarse en la BD.

En la relacion ParticipanteXEntregable se conecta la tabla Rol, la cual tiene una relacion 1 a muchos. Una linea de ParticipanteXEntregable puede tener multiples Roles

**Cada entregable esta asociado al proyecto y este podra manipularse desde las distintas herramientas**

## Matriz de comunicaciones:

Para representar a "Responsable a comunicar" creamos una relacion con rolXproyector

## Tablero Kanban
Done

## Product Backlog

Preguntar si el estado del product backlog es un estado global, dado que para las tareas manejamos un estado configurable por el usuario, mientras que tambien usamos estados en el product backlog.

**En el sprint backlog van tareas, por lo que falta esta correccion**

## Sprint Backlog

Se agrega relacion sprint con tareas. Se justifica Tareas-Sprint debido a que dentro de cada sprint backlog hay tareas, no product backlog items

## Auto Evaluacion

Preguntar si el estado del product backlog es un estado global, dado que para las tareas manejamos un estado configurable por el usuario, mientras que tambien usamos estados en el product backlog.

---
# Consultas pendientes:

Se esta realizando la copia de clases para el manejo de plantillas, esto con la finalidad de que el usuario solo guarde las plantillas que va a utilizar. Esto facilita los querys, solo estan conectadas netamente con usuarios.

Por otro lado, existe la posibilidad de crear una tabla intermedia con los campos de idPlantilla, idProyecto y idUsuario, estos pueden ser NULL segun la plantilla se asocie para proyecto o usuario. Sin embargo los estados y roles afectan a la edicion de estas plantillas, por ende es algo a tomar en cuenta.

Gracias profesor, tambien tenemos otra duda. Para el  product backlog tenemos un estado global para cada historia de usuario. Ademas los estados que tenemos en el tablero kanban son editables por parte del usuario segun lo que converso con mi grupo ayer. Aqui va mi duda, este estado reflejado en el tablero es el mismo que va con la historia de usuario? o la historia de usuario tiene estados estáticos fijados por el propio sistema?