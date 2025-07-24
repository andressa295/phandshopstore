// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define uma interface para o objeto de cache global, incluindo as propriedades do Mongoose
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Estende o objeto global do Node.js para incluir nosso cache do Mongoose
// Isso permite que o TypeScript saiba que `global._mongooseCache` pode existir
declare global {
    var _mongooseCache: MongooseCache;
}

// Armazena a conexão em cache para evitar novas conexões em cada requisição
let cached = global._mongooseCache;

if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Desabilita o buffering de comandos
        };
        // Inicia a conexão com o MongoDB
        cached.promise = mongoose.connect(MONGODB_URI!, opts);
    }

    // Espera pela conexão ser resolvida e armazena a conexão resultante
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;