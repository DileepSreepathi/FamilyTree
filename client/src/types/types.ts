export interface FamilyRoot {
    familyName: string;
    createdDate: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    subscription: 'free' | 'premium' | 'family';
}

export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate?: string;
    gender: 'male' | 'female' | 'other';
    relationship?: string;
    parentId: number | null;
    spouseIds?: number[]; // Changed from spouseId to support multiple spouses
    children: number[];
    notes?: string;
}

export interface Plan {
    name: string;
    members: number;
    price: number;
    features: string[];
}

export interface MemberFormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate?: string;
    gender: string;
    parentId: number | null;
    relationship: string;
    spouseIds?: number[];
    notes?: string;
}
