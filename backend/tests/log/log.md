## 09/24/2023
Gabo
{
### HECHO:
Se creo el router de auth
Se cambio la BD a mysql2 para soportar mas solicitudes secuenciales
Preguntar al profe Flores si se puede pedir ayuda de externos.(Si se puede)
Se crearon las tablas de Proyecto, GrupoProyecto y la tabla intermedia, ademas se creo el procedure de insertar_proyecto tomando en cuenta que solo basta el nombre para crear un proyecto.
Tambien se creo el router de post para subir un proyecto, pero aun no se ha probado dado que no hay front end aun.
Se cambiaron las funciones de sincronas a asincronas

### POR HACER:
Completar las tablas de proyecto y probarlas con el front
Se debe crear arbol de directorios front y backend  en Lucid Chart

### OBSERVACIONES
Se usa las rutas normales para el front
Ver posibilidad de moduleAlias para el redireccionamiento de rutas. (hay mucho ".." en server,js).

**Figma**
El campo codigo de grupo curso no se usa.

**BD**
El campo fecha de nacimiento y telefono no se usan, ademas hay un campo extra llamado usuario.(ambos son para que sea escalable)
}

## 09/26/2023

### POR HACER:
Revisar la relacion de entregables y agregarla a la base de datos

### OBSERVACIONES
Preguntar sobre el uso de token para solicitudes a la base de datos.
Preguntar sobre el sequelize    