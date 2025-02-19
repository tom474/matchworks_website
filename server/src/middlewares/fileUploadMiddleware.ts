import multer from "multer";

const storage = multer.memoryStorage();

// Middleware for single file upload
export const uploadSingleFile = (fieldName: string) => multer({ storage }).single(fieldName);

// Middleware for multiple file uploads (if needed)
export const uploadMultipleFiles = (fieldName: string, maxCount: number) =>
	multer({ storage }).array(fieldName, maxCount);
