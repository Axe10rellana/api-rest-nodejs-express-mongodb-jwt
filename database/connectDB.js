import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.URI_MONGO);
  console.info("Se ha conectado a la base de datos de MongoDB");
} catch (error) {
  console.error(`Error de conexion a MongoDB: ${error}`);
}
