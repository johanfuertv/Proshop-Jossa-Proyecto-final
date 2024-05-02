// Importar la biblioteca mongoose para interactuar con MongoDB
import mongoose from 'mongoose';

// Definir una función asíncrona llamada connectDB para conectar con la base de datos
const connectDB = async () => {
  try {
    // Intentar establecer una conexión a la base de datos MongoDB utilizando la URI proporcionada en la variable de entorno MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Si la conexión es exitosa, imprimir un mensaje indicando que MongoDB está conectado y mostrar el host al que se ha conectado
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    // En caso de que ocurra algún error durante el proceso de conexión, imprimir un mensaje de error
    console.error(`Error: ${error.message}`);
    
    // Salir del proceso con un código de salida 1 (indicando un error)
    process.exit(1);
  }
};

// Exportar la función connectDB para poder utilizarla en otros archivos
export default connectDB;