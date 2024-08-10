interface FetchOptions extends RequestInit {
	retry?: boolean;
}

// fetch wrapper with refresh token interceptor.
export async function Fetch(
	url: string,
	init?: FetchOptions | undefined,
): Promise<Response> {
	try {
		const response = await fetch(url, init);
		// if the response status is 401 and the request is not a retry, try to refresh the token
		if (response.status === 401 && !init?.retry) {
			console.log("Unauthorized, trying to refresh token...");
			const refreshResponse = await fetch("/api/auth/refresh", {
				credentials: "include",
			});
			// if the refresh token is successful, retry the original request
			if (refreshResponse.ok) {
				console.log("Token refreshed, retrying original request...");
				return await Fetch(url, { ...init, retry: true });
			}
			console.log("Token refresh failed");
			return response;
		}
		return response;
	} catch (error) {
		throw error;
	}
}

export function isErrorResponse(body: any): body is ErrorResponse {
	return (
		typeof body === "object" &&
		body !== null &&
		"error" in body &&
		typeof body.error === "object" &&
		"code" in body.error &&
		typeof body.error.code === "number" &&
		"message" in body.error &&
		typeof body.error.message === "string"
	);
}
