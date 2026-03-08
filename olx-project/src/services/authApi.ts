const BASE_URL = 'https://localhost:5000/api'

export interface User {
    username: string
    email: string
    token?: string
}

export async function register(username: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) {
        throw new Error('Помилка реєстрації')
    }
    return await res.json()
}

export async function login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
        throw new Error('Помилка логіну')
    }
    return await res.json()
}