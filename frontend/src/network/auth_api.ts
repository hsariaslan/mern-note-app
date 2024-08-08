import { User } from "../models/user";
import {BadRequestError, ConflictError, UnauthorizedError} from "../errors/http_errors";

async function fetchData(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const response: Response = await fetch(input, init);

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if (response.status === 400) {
            throw new BadRequestError(errorMessage);
        } else if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw new Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }

    return response;
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
    confirm_password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response: Response = await fetchData("/api/v1/users/signup", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response: Response = await fetchData("/api/v1/users/login", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            "Content-Type": "application/json",
        }
    });

    return response.json();
}

export async function logout() {
    await fetchData("/api/v1/users/logout", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export async function getAuthenticatedUser(): Promise<User> {
    const response: Response = await fetchData('/api/v1/users', { method: 'GET' });

    return response.json();
}