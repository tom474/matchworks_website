import { GridFSBucket, ObjectId } from "mongodb";
import { getGridFSBucket } from "../config/database";

/**
 * Upload a file to GridFS
 * @param file - The file to upload
 * @param bucketName - The GridFS bucket name
 * @returns The ID of the uploaded file
 */
export const uploadFileToGridFS = async (file: Express.Multer.File, bucketName: string): Promise<ObjectId> => {
	// Validate input
	if (!file) {
		throw new Error("File is required for upload.");
	}
	if (!bucketName) {
		throw new Error("Bucket name is required.");
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	return new Promise<ObjectId>((resolve, reject) => {
		try {
			// Create a write stream to GridFS
			const uploadStream = bucket.openUploadStream(file.originalname, {
				metadata: {
					mimeType: file.mimetype,
				},
			});

			// Handle stream events
			uploadStream.on("finish", () => {
				console.log(`File uploaded successfully with ID: ${uploadStream.id}`);
				resolve(uploadStream.id);
			});
			uploadStream.on("error", (err) => {
				console.error("Error during file upload:", err);
				reject(err);
			});

			// Write the file buffer to the stream
			uploadStream.end(file.buffer);
		} catch (error) {
			console.error("Unexpected error during file upload:", error);
			reject(error);
		}
	});
};

/**
 * Retrieve a file's metadata from GridFS
 * @param fileId - The ID of the file to retrieve
 * @param bucketName - The GridFS bucket name
 * @returns The file's metadata or null if not found
 */
export const retrieveFileFromGridFS = async (fileId: ObjectId, bucketName: string): Promise<any | null> => {
	// Validate input
	if (!fileId) {
		throw new Error("File ID is required.");
	}
	if (!bucketName) {
		throw new Error("Bucket name is required.");
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	try {
		// Find the file in GridFS
		const files = await bucket.find({ _id: fileId }).toArray();
		if (files.length === 0) {
			console.warn(`File not found with ID: ${fileId}`);
			return null;
		}

		// Log and return the file metadata
		console.log(`File metadata retrieved for ID: ${fileId}`);
		return files[0];
	} catch (error: any) {
		console.error("Error retrieving file from GridFS:", error.message);
		throw new Error("Failed to retrieve file.");
	}
};

/**
 * Rename a file in GridFS
 * @param fileId - The ID of the file to rename
 * @param newName - The new name for the file
 * @param bucketName - The GridFS bucket name
 * @returns A boolean indicating success or failure
 */
export const renameFileInGridFS = async (fileId: ObjectId, newName: string, bucketName: string): Promise<boolean> => {
	// Validate input
	if (!fileId) {
		throw new Error("File ID is required.");
	}
	if (!newName) {
		throw new Error("New name is required.");
	}
	if (!bucketName) {
		throw new Error("Bucket name is required.");
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	try {
		// Find the file in GridFS
		const files = await bucket.find({ _id: fileId }).toArray();
		if (files.length === 0) {
			console.warn(`File not found for ID: ${fileId}`);
			return false;
		}

		// Rename the file
		await bucket.rename(fileId, newName);
		console.log(`File renamed successfully. ID: ${fileId}, New Name: ${newName}`);
		return true;
	} catch (error: any) {
		console.error("Error renaming file:", error.message);
		throw new Error("Failed to rename file in GridFS.");
	}
};

/**
 * Delete a file from GridFS
 * @param fileId - The ID of the file to delete
 * @param bucketName - The GridFS bucket name
 * @returns A boolean indicating success or failure
 */
export const deleteFileFromGridFS = async (fileId: ObjectId, bucketName: string): Promise<boolean> => {
	// Validate input
	if (!fileId) {
		throw new Error("File ID is required.");
	}
	if (!bucketName) {
		throw new Error("Bucket name is required.");
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	try {
		// Find the file in GridFS
		const files = await bucket.find({ _id: fileId }).toArray();
		if (files.length === 0) {
			console.warn(`File not found for ID: ${fileId}`);
			return false;
		}

		// Delete the file
		await bucket.delete(fileId);
		console.log(`File deleted successfully. ID: ${fileId}`);
		return true;
	} catch (error: any) {
		console.error("Error deleting file:", error.message);
		throw new Error("Failed to delete file from GridFS.");
	}
};
