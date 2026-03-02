import React from 'react';
import { User, Member } from '../types/types';
import { PLANS } from '../constants/constants';

interface StatsCardsProps {
    user: User;
    members: Member[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ user, members }) => {
    const calculateGenerations = () => {
        if (members.length === 0) return 0;

        return Math.max(...members.map(m => {
            let depth = 0;
            let current = m;
            while (current.parentId) {
                depth++;
                current = members.find(p => p.id === current.parentId) || { parentId: null } as Member;
            }
            return depth;
        }), 0) + 1;
    };

    const plan = PLANS[user.subscription];

    return (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Total Members</div>
                <div className="text-3xl font-bold text-gray-800">{members.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                    {plan.members === -1 ? 'Unlimited' : `${plan.members - members.length} remaining`}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Generations</div>
                <div className="text-3xl font-bold text-gray-800">{calculateGenerations()}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                <div className="text-2xl font-bold text-blue-600">{plan.name}</div>
                <div className="text-xs text-gray-500 mt-1">${plan.price}/month</div>
            </div>
        </div>
    );
};
