/**
 * Validates that all required environment variables are set.
 *
 * @param requiredVariables - An array of strings representing the names of the required environment variables.
 * @throws Will terminate the process with an exit code of 1 if any required environment variables are missing.
 */
export const validateEnv = (requiredVariables: string[]): void => {
	const unsetVariables = requiredVariables.filter((variable) => !process.env[variable]);

	if (unsetVariables.length > 0) {
		console.error(`The following environment variables are missing: ${unsetVariables.join(", ")}`);
		process.exit(1);
	}
};
