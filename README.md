# Servidor BackEnd para levantamiento de servicios API Rest

## Instalacion de dependencias
```
$ npm install
otra opcion:
$ npm i
```

## Levantar servicios en Localhost
```
$ npm run dev
```

## Instalacion de dependencias especificas
```
$ npm install [nombre de libreria]
```
> Recomendacion: utilizar la ultima version estable disponible y adaptar el codigo (si es necesario). 
Librerias utilizadas en el proyecto:
- bcryptjs (v2.4.3): libreria que permite realizar hashing de constraseñas.
- cors (v2.8.5): libreria que proporciona un middleware Connect / Express que se puede usar para habilitar CORS con varias opciones.
- dotenv (v16.0.1): permite cargar variables de entorno desde un .env archivo a process.env .
- express (v4.18.1): es una infraestructura de aplicaciones web Node.js mínima y flexible que proporciona un conjunto solido de caracteristicas para las aplicaciones web y moviles.
- express-validator (v6.14.2): es un conjunto de middleware express.js que envuelve las funciones de validación y desinfección de validator.js .
- jsonwebtoken (v8.5.1): proporciona metodos para la generacion tokens y devolucion de llamadas de verificacion de tokens.
- moment (v2.29.4): es una biblioteca de fechas de JavaScript para analizar, validar, manipular y formatear fechas.
- mongoose (v6.5.2): es una herramienta de modelado de objetos MongoDB diseñada para trabajar en un entorno asíncrono. Mongoose admite tanto promesas como devoluciones de llamada.
- morgan: (v1.10.0): proporciona un middleware de registro de solicitudes HTTP para node.js
- nodemon (v2.0.19): es una herramienta que permite reiniciar automáticamente la aplicación del nodo cuando se detectan cambios en los archivos del directorio.

## Contenido de archivo .env
```
PORT = 4000
MONGODB_URI = mongodb+srv://you_user:1234567abcde@clusterX.test12345.mongodb.net/nombre_servicio
MONGODB_URI_TEST = mongodb://localhost:27017/demo-db

SECRET_JWT_SEED = mi_palabra_secreta
```
Donde la variables de entornos son:
- PORT: puerto de salida para la URL 
- MONGODB_URI = direccion URL para la conexion con la base de datos MongoDB
- MONGODB_URI_TEST = direccion URL para la conexion con la base de datos MongoDB en localhost
- SECRET_JWT_SEED = palabra o frase secreta para la creacion de JsonWebToken# bookish-succotash
