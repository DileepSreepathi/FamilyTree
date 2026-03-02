import React from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { Member, FamilyRoot } from '../types/types';
import { FamilyTreeVisual } from './FamilyTreeVisual';

interface DashboardViewProps {
    familyRoot: FamilyRoot;
    members: Member[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onEdit: (member: Member) => void;
    onDelete: (id: number) => void;
    onAddChild: (parentId: number | null) => void;
    onEditFamilyName: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    familyRoot,
    members,
    searchTerm,
    onSearchChange,
    onEdit,
    onDelete,
    onAddChild,
    onEditFamilyName
}) => {
    const filteredMembers = members.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search family members..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {searchTerm ? (
                <div className="space-y-2">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex-1">
                                <div className="font-semibold">{member.firstName} {member.lastName}</div>
                                <div className="text-sm text-gray-500">{member.birthDate} • {member.gender}</div>
                            </div>
                            <button
                                onClick={() => onEdit(member)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(member.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <FamilyTreeVisual
                        familyRoot={familyRoot}
                        members={members}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddChild={onAddChild}
                        onEditFamilyName={onEditFamilyName}
                    />
                </div>
            )}
        </div>
    );
};
