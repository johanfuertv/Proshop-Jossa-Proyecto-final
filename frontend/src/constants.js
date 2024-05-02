// Definir la URL base para las solicitudes HTTP
// Se establecerá según el entorno de ejecución, localhost en desarrollo o vacío si se está utilizando un proxy
export const BASE_URL = ''; // Si se está utilizando un proxy
// Exportar las URL de los endpoints para productos, usuarios, órdenes y configuración de PayPal
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';