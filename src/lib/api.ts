export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('sa_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('sa_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('sa_token');
        }
    }

    async fetch(url: string, options: RequestInit = {}) {
        const headers = new Headers(options.headers || {});
        headers.set('Accept', 'application/json');
        
        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`);
        }
        
        if (!(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            this.clearToken();
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw { status: response.status, data };
            }
            return data;
        }

        if (!response.ok) {
            throw { status: response.status, data: await response.text() };
        }

        return response.text();
    }

    async get(url: string) {
        return this.fetch(url, { method: 'GET' });
    }

    async post(url: string, data?: any) {
        return this.fetch(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put(url: string, data?: any) {
        return this.fetch(url, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch(url: string, data?: any) {
        return this.fetch(url, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete(url: string) {
        return this.fetch(url, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
