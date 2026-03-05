import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/consistencie_dummy";
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

// --- NextAuth MongoDB Client Promise ---
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export { clientPromise };

// --- Mongoose Connection ---
let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};
