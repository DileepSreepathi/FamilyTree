import React from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Member } from '../types/types';

interface MemberTreeProps {
    members: Member[];
    expandedMembers: Set<number>;
    onToggleExpand: (id: number) => void;
    onEdit: (member: Member) => void;
    onDelete: (id: number) => void;
}

export const MemberTree: React.FC<MemberTreeProps> = ({
    members,
    expandedMembers,
    onToggleExpand,
    onEdit,
    onDelete
}) => {
    const renderMemberTree = (memberId: number, level: number = 0): JSX.Element | null => {
        const member = members.find(m => m.id === memberId);
        if (!member) return null;

        const hasChildren = member.children && member.children.length > 0;
        const isExpanded = expandedMembers.has(memberId);

        return (
            <div key={member.id} className="mb-2" style={{ marginLeft: `${level * 24}px` }}>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors">
                    {hasChildren && (
                        <button
                            onClick={() => onToggleExpand(memberId)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}
                    <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                            {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {member.birthDate} • {member.gender}
                        </div>
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
                {hasChildren && isExpanded && (
                    <div className="mt-2">
                        {member.children.map(childId => renderMemberTree(childId, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const rootMembers = members.filter(m => !m.parentId);

    return (
        <div className="space-y-4">
            {rootMembers.map(member => renderMemberTree(member.id))}
        </div>
    );
};
