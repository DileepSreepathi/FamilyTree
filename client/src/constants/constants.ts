import { Plan } from '../types/types';

export const PLANS: Record<'free' | 'premium' | 'family', Plan> = {
    free: {
        name: 'Free',
        members: 10,
        price: 0,
        features: ['Up to 10 family members', 'Basic tree view', 'Export to PDF']
    },
    premium: {
        name: 'Premium',
        members: 50,
        price: 9.99,
        features: ['Up to 50 family members', 'Advanced analytics', 'Photo uploads', 'Collaboration']
    },
    family: {
        name: 'Family',
        members: -1,
        price: 19.99,
        features: ['Unlimited members', 'Priority support', 'Advanced search', 'DNA integration']
    }
};
