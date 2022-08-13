# Inicializacion del proyecto
Crea el fichero package.json, con las configuraciones para la aplicacion Node.JS
> npm init -y

# Instalacion de nodemon
Herramienta que reinicia la aplicacion Node.Js cuando se detecten cambios.
> npm i nodemon

# Instalacion de Express
Modulo para el enrutamiento robusto  y consultas http de Node.JS
> npm i express

# Clave secreta de Token
Si la clave secreta para generar el token es modificada,
todas los tokens generados con es clave seran invalidos.
Por lo tanto los usuarios deberan generar un nuevo token.
> npm i bcryptjs

# Restricciones de CORS
Restringe las peticiones, de quienes pueden acceder a los servicios
> npm i cors