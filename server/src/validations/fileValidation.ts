/**
 * Validates if the provided MIME type is within the list of allowed MIME types.
 *
 * @param mimetype - The MIME type of the file to validate.
 * @param allowedMimeTypes - An array of allowed MIME types.
 * @returns `true` if the MIME type is allowed, otherwise `false`.
 */
export const validateFileType = (mimetype: string, allowedMimeTypes: string[]): boolean => {
	return allowedMimeTypes.includes(mimetype);
};

/**
 * Validates if the given file size is within the allowed maximum size.
 *
 * @param fileSize - The size of the file to be validated.
 * @param maxSize - The maximum allowed file size.
 * @returns `true` if the file size is less than or equal to the maximum size, otherwise `false`.
 */
export const validateFileSize = (fileSize: number, maxSize: number): boolean => {
	return fileSize <= maxSize;
};
