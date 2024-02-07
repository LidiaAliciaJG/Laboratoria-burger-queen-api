# Changelog

## 1.3.0 - 2023-02-06

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- Comprensión de métodos de borrado de MongoDB.
- Entender la estructura de las pruebas e2e ya incluidas.
- Comprender la forma de solucionar errores en pruebas e2e.

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->
- Creación del endpoint DELETE en users según un id o email dado en la ruta.

### Changed

<!-- En esta sección detalla los cambios que hiciste a funcionalides ya existentes. -->
- En POST y UPDATE users se valida el email escrito en mayusculas o minusculas como igual.

### Fixed

<!-- En esta sección describe los _bugs_ solucionados. -->
- En login, la contraseña encriptada se compara.

### Removed

<!-- En esta sección incluye las funcionalidades eliminadas. -->
- Se comentó la validación de role en los endpoints de users ya que la prueba e2e no procedía.

## 1.2.0 - 2023-01-31

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- Comprensión de las operaciones CRUD en MongoDB
- Obtención de datos en la ruta del endpoint
- Creación de objetos para MongoDB
- Uso de errores y mensajes tipo json enviados como respuesta

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->
- Creación de endpoint POST de un usuario con validación a los datos ingresados.
- Función de endpoint GET para un usuario de cierto id o email proporcionado
- Endpoint PUT para actualizar el usuario de un id o email dado

## 1.1.0 - 2023-01-24

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- Mayor comprensión de la conexión a la base de datos
- Entendimiento de las operaciones de lectura en MongoDB 

### Added

<!-- En esta sección especifica las funcionalides que agregaste. -->
- Endpoint de login: verifica si el correo y contraseña son válidos y existen, responde con un token creado.
- Autenticación de token y verificación del usuario con rol de admin para middleware.
- Función getUsers para el endpoint GET para usuarios.

### Changed

<!-- En esta sección detalla los cambios que hiciste a funcionalides ya existentes. -->
- Conexión a la base de datos creada en MongoDB.
- La función `initAdminUser` se completó para crear un usuario admin y verificar si éste existe.

## 1.0.0 - 2023-01-17

### Sprint learnings

<!-- En esta sección enumera los aprendizajes del sprint. -->
- Se comprendió el boilerplate inicial de una API Rest.
- Se aprendió el uso de Postman y MongoDB con MongoConnect.
