# Changelog

## 1.0.0 - 2023-02-04

* 8c49fd5 actualización de post y update user, creación de delete user by id/email (Lidia Alicia) 2024-02-04

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- 

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->

### Changed

<!-- En esta sección detalla los cambios que hiciste a funcionalides ya existentes. -->

### Fixed

<!-- En esta sección describe los _bugs_ solucionados. -->

### Removed

<!-- En esta sección incluye las funcionalidades eliminadas. -->


## 1.0.0 - 2023-01-31

* e4e85fa creación de endpoint get and update (put) user by id/email (Lidia Alicia) 2024-01-31
* 405f257 actualización en post users: valdación de roles, actualización en getUsers{uid}: creación de la función que encuentra el usuario (Lidia Alicia) 2024-01-30
* b8e81a0 actualización 2 de post users: se agregó validación de datos ingresados y corrección al obtener id del usuario creado (Lidia Alicia) 2024-01-29
* 73eb833 primer actualizacion del endpoint post users (Lidia Alicia) 2024-01-25

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- 

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->

### Changed

<!-- En esta sección detalla los cambios que hiciste a funcionalides ya existentes. -->

### Fixed

<!-- En esta sección describe los _bugs_ solucionados. -->

### Removed

<!-- En esta sección incluye las funcionalidades eliminadas. -->

## 1.1.0 - 2023-01-24

* c0bcb1d agrega funcion getUsers  en controller.js (Lidia Alicia) 2024-01-24
* agrega funciones de autenticar token y usuario admadmin en el middleware auth.js (Lidia Alicia) 2024-01-22

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- 

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->
- Endpoint de login: verifica si el correo y contraseña son válidos y existen, responde con un token creado.
- Autenticación de token y verificación del usuario con rol de admin

### Changed

<!-- En esta sección detalla los cambios que hiciste a funcionalides ya existentes. -->
- Conexión a la base de datos creada en MongoDB.
- La función `initAdminUser` se completó para crear un usuario admin y verificar si éste existe.

## 1.0.0 - 2023-01-17

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- Se comprendió el boilerplate inicial de una API Rest.
- Se aprendió el uso de Postman y MongoDB con MongoConnect.
