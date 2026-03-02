import React from 'react';
import { Crown, CreditCard } from 'lucide-react';
import { User, Plan } from '../types/types';
import { PLANS } from '../constants/constants';

interface UpgradeModalProps {
    user: User;
    onUpgrade: (planType: 'free' | 'premium' | 'family') => void;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ user, onUpgrade, onClose }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center mb-8">Upgrade Your Plan</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {Object.entries(PLANS).map(([key, plan]) => (
                            <div
                                key={key}
                                className={`border-2 rounded-xl p-6 ${user.subscription === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    {key !== 'free' && <Crown className="text-yellow-500" size={24} />}
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                </div>
                                <div className="text-4xl font-bold mb-4">
                                    ${plan.price}<span className="text-lg text-gray-600">/mo</span>
                                </div>
                                <div className="mb-6">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Members: {plan.members === -1 ? 'Unlimited' : plan.members}
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {user.subscription !== key && (
                                    <button
                                        onClick={() => onUpgrade(key as 'free' | 'premium' | 'family')}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        {key === 'free' ? 'Current Plan' : 'Upgrade'}
                                    </button>
                                )}
                                {user.subscription === key && (
                                    <div className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold text-center">
                                        Current Plan
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-8 mx-auto block px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
