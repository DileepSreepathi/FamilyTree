import { User } from '../types/types';

class AuthServiceClass {
    currentUser: User | null = null;

    async login(email: string, password: string): Promise<User> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const user: User = {
            id: 1,
            email,
            name: email.split('@')[0],
            subscription: 'free'
        };

        this.currentUser = user;
        return user;
    }

    logout(): void {
        this.currentUser = null;
    }
}

export const AuthService = new AuthServiceClass();
