import React from 'react';
import { X } from 'lucide-react';
import { Member, MemberFormData } from '../types/types';

interface MemberModalProps {
    isOpen: boolean;
    isEdit: boolean;
    members: Member[];
    formData: MemberFormData;
    selectedMember: Member | null;
    selectedParent: Member | null;
    onFormChange: (data: MemberFormData) => void;
    onSave: () => void;
    onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
    isOpen,
    isEdit,
    members,
    formData,
    selectedMember,
    selectedParent,
    onFormChange,
    onSave,
    onClose
}) => {
    if (!isOpen) return null;

    const title = isEdit ? 'Edit Family Member' : 'Add New Family Member';

    // Filter potential spouses:
    // 1. Not self
    // 2. No spouse (or is current spouse)
    // 3. Opposite gender (optional, but keeps tree simple for now)
    const potentialSpouses = members.filter(m =>
        m.id !== selectedMember?.id &&
        // Allow if they are not already my spouse (unless they are the one I'm currently editing/linking?)
        // Actually, for "Add Spouse", we just want people who are NOT already in my spouseIds list.
        (!selectedMember?.spouseIds?.includes(m.id)) &&
        (!formData.gender || m.gender !== formData.gender)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {selectedParent && !isEdit && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            Adding child to: <strong>{selectedParent.firstName} {selectedParent.lastName}</strong>
                        </p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => onFormChange({ ...formData, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => onFormChange({ ...formData, birthDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Death Date (if applicable)
                        </label>
                        <input
                            type="date"
                            value={formData.deathDate || ''}
                            onChange={(e) => onFormChange({ ...formData, deathDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => onFormChange({ ...formData, gender: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Relation
                        </label>
                        <input
                            type="text"
                            value={formData.relationship}
                            onChange={(e) => onFormChange({ ...formData, relationship: e.target.value })}
                            placeholder="e.g., Father, Mother, Son"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Spouses
                        </label>

                        {/* List existing selected spouses */}
                        <div className="mb-2 flex flex-wrap gap-2">
                            {formData.spouseIds?.map(id => {
                                const spouse = members.find(m => m.id === id);
                                if (!spouse) return null;
                                return (
                                    <div key={id} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                        <span>{spouse.firstName} {spouse.lastName}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newIds = formData.spouseIds?.filter(sid => sid !== id) || [];
                                                onFormChange({ ...formData, spouseIds: newIds });
                                            }}
                                            className="hover:text-blue-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dropdown to add new spouse */}
                        <select
                            value=""
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val) {
                                    const currentIds = formData.spouseIds || [];
                                    if (!currentIds.includes(val)) {
                                        onFormChange({ ...formData, spouseIds: [...currentIds, val] });
                                    }
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">+ Add Spouse</option>
                            {potentialSpouses
                                .filter(s => !formData.spouseIds?.includes(s.id)) // Exclude already selected
                                .map(spouse => (
                                    <option key={spouse.id} value={spouse.id}>
                                        {spouse.firstName} {spouse.lastName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Any additional information..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={onSave}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        {isEdit ? 'Update Member' : 'Add Member'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
