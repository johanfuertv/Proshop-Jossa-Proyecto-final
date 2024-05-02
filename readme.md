E-commerce App - Johan Ossa Serna
Este proyecto es una aplicación de comercio electrónico desarrollada utilizando Node.js y React. A continuación, se detallan los pasos que se han seguido para cumplir con los requisitos del proyecto:

Implementación del Modelo Cliente/Servidor
La aplicación sigue el modelo Cliente/Servidor, donde un servidor de bases de datos proporciona los datos necesarios y un cliente web interactúa con la aplicación a través de una interfaz de usuario.

Buenas Prácticas de Programación
El código fuente cumple con buenas prácticas de programación, incluyendo una correcta identación, nombres adecuados de identificadores, clases, métodos, objetos y atributos.

Roles de Usuario
La aplicación tiene implementados al menos 3 tipos de usuarios, incluyendo el rol de Administrador con acceso total a todas las funcionalidades, así como roles adicionales definidos por el equipo de trabajo.

Autenticación de Usuarios
Todos los usuarios deben iniciar sesión para utilizar la aplicación. Se implementa un sistema de autenticación seguro para garantizar el acceso autorizado a las funcionalidades.

Menú Dinámico
La aplicación muestra un menú con opciones dinámicas dependiendo del tipo de usuario que ha iniciado sesión. Esto garantiza una experiencia personalizada para cada usuario.

Patrón MVC
La aplicación sigue el patrón Modelo-Vista-Controlador (MVC), lo que permite una separación clara de la lógica de negocio, la presentación de datos y el control de la interfaz de usuario.

Entidades del Sistema
El sistema está compuesto por al menos 7 entidades (tablas) que representan diferentes aspectos del negocio de comercio electrónico, como Usuarios, Clientes, Productos, Pedidos, Proveedores, Categorías, etc.

Atributos de las Entidades
Cada entidad está descrita por al menos cinco atributos, donde uno de ellos actúa como llave primaria (PK) para garantizar la unicidad de los registros. Además, se incluye un atributo de tipo lógico que representa el estado activo o inactivo de la entidad en el sistema.

CRUD para Usuarios y Entidades
Se implementa el modelo CRUD (Crear, Leer/Consultar, Actualizar y Borrar) para todas las funcionalidades relacionadas con los usuarios y las entidades del sistema. En la acción de borrar, en lugar de eliminar los datos permanentemente, se cambia el valor del campo activo por false.

Consulta por Clave Primaria
Todas las entidades se pueden consultar por su clave primaria (PK) y mostrar un listado general de registros, lo que facilita la gestión y visualización de los datos.