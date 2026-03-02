import React from 'react';
import { Member, MemberFormData } from '../types/types';

interface MemberFormProps {
    formData: MemberFormData;
    members: Member[];
    selectedMember: Member | null;
    onFormChange: (data: MemberFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
    formData,
    members,
    selectedMember,
    onFormChange,
    onSubmit,
    onCancel
}) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
                {selectedMember ? 'Edit Member' : 'Add New Member'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => onFormChange({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Date
                    </label>
                    <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => onFormChange({ ...formData, birthDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        value={formData.gender}
                        onChange={(e) => onFormChange({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent
                    </label>
                    <select
                        value={formData.parentId || ''}
                        onChange={(e) => onFormChange({
                            ...formData,
                            parentId: e.target.value ? parseInt(e.target.value) : null
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">None (Root)</option>
                        {members.filter(m => m.id !== selectedMember?.id).map(m => (
                            <option key={m.id} value={m.id}>
                                {m.firstName} {m.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    onClick={onSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    {selectedMember ? 'Update Member' : 'Add Member'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
