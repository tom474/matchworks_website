import { MongoClient, Db, GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import { validateEnv } from "../validations/envValidation";

validateEnv(["MONGO_URI"]);
const MONGO_URI = process.env.MONGO_URI || "";
let db: Db;
let avatarBucket: GridFSBucket;
let resumeBucket: GridFSBucket;

// Connect to MongoDB
export const connectToMongoDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI, {
			dbName: "main",
		});
		initializeGridFSBuckets();
		console.log(`Connected to MongoDB: ${conn.connection.host}`);
	} catch (error: any) {
		console.error("Failed to connect to MongoDB:", error.message);
		throw error;
	}
};

// Initialize GridFS buckets
export const initializeGridFSBuckets = async () => {
	try {
		const client = new MongoClient(MONGO_URI);
		await client.connect();
		db = client.db("gridfs");
		avatarBucket = new GridFSBucket(db, { bucketName: "avatars" });
		resumeBucket = new GridFSBucket(db, { bucketName: "resumes" });
		console.log("Initialized GridFS buckets successfully");
	} catch (error: any) {
		console.error("Failed to initilize GrifFS buckets:", error.message);
		throw error;
	}
};

// Getter for GridFS bucket
export const getGridFSBucket = (bucketName: string): GridFSBucket => {
	if (bucketName === "avatars") {
		if (!avatarBucket) throw new Error("Avatar GridFSBucket not initialized.");
		return avatarBucket;
	}
	if (bucketName === "resumes") {
		if (!resumeBucket) throw new Error("Resume GridFSBucket not initialized.");
		return resumeBucket;
	}
	throw new Error("Invalid bucket name.");
};

export default connectToMongoDB;
