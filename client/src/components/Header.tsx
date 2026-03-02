import React from 'react';
import { Users, Crown, LogOut } from 'lucide-react';
import { User } from '../types/types';
import { PLANS } from '../constants/constants';

interface HeaderProps {
    user: User;
    onUpgrade: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onUpgrade, onLogout }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Family Tree</h1>
                        <p className="text-sm text-gray-600">
                            {user.name} • {PLANS[user.subscription].name} Plan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onUpgrade}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-colors"
                    >
                        <Crown size={18} />
                        Upgrade
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};
