import React from 'react';
import { UserPlus, Edit2, Trash2, Heart, Users } from 'lucide-react';
import { Member, FamilyRoot } from '../types/types';

interface FamilyTreeVisualProps {
    familyRoot: FamilyRoot;
    members: Member[];
    onEdit: (member: Member) => void;
    onDelete: (id: number) => void;
    onAddChild: (parentId: number | null) => void;
    onEditFamilyName: () => void;
}

export const FamilyTreeVisual: React.FC<FamilyTreeVisualProps> = ({
    familyRoot,
    members,
    onEdit,
    onDelete,
    onAddChild,
    onEditFamilyName
}) => {
    const getAge = (birthDate: string, deathDate?: string) => {
        if (!birthDate) return '';
        const birth = new Date(birthDate);
        const end = deathDate ? new Date(deathDate) : new Date();
        const age = end.getFullYear() - birth.getFullYear();
        return `${age}${deathDate ? '' : ' years old'}`;
    };

    // Render Family Root Card
    const renderFamilyRootCard = () => {
        const rootMembers = members.filter(m => !m.parentId);

        return (
            <div className="inline-block mb-8">
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl p-6 border-4 border-blue-400 min-w-[280px]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl shadow-lg">
                            {familyRoot.familyName[0]}
                        </div>
                        <button
                            onClick={onEditFamilyName}
                            className="p-2 text-white hover:bg-blue-700 rounded"
                            title="Edit family name"
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {familyRoot.familyName}
                        </h2>
                        <p className="text-blue-200 text-sm">Family Tree</p>
                        {familyRoot.createdDate && (
                            <p className="text-blue-300 text-xs mt-2">
                                Since {new Date(familyRoot.createdDate).getFullYear()}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => onAddChild(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow"
                        >
                            <UserPlus size={16} />
                            Add Member
                        </button>
                    </div>
                </div>

                {/* Vertical Line to Root Members */}
                {rootMembers.length > 0 && (
                    <div className="flex flex-col items-center">
                        <div className="w-0.5 h-12 bg-gray-400"></div>
                    </div>
                )}
            </div>
        );
    };

    // Render individual member card
    const renderMemberCard = (member: Member) => {
        return (
            <div
                className="relative bg-white rounded-lg shadow-md p-4 border-2 border-blue-300 hover:shadow-lg transition-shadow"
                style={{ minWidth: '200px', maxWidth: '200px' }}
            >
                {/* Card Header with Actions */}
                <div className="flex justify-between items-start mb-2">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}
                    >
                        {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onAddChild(member.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Add child"
                        >
                            <UserPlus size={14} />
                        </button>
                        <button
                            onClick={() => onEdit(member)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(member.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Member Info */}
                <div className="mb-2">
                    <h3 className="font-bold text-gray-800 text-base leading-tight">
                        {member.firstName} {member.lastName}
                    </h3>
                    {member.relationship && (
                        <p className="text-xs text-gray-600 italic">{member.relationship}</p>
                    )}
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                    {member.birthDate && (
                        <p>📅 {new Date(member.birthDate).toLocaleDateString()}</p>
                    )}
                    {member.deathDate && (
                        <p>🕊️ {new Date(member.deathDate).toLocaleDateString()}</p>
                    )}
                    {member.birthDate && (
                        <p className="text-[10px]">{getAge(member.birthDate, member.deathDate)}</p>
                    )}
                </div>

                {member.notes && (
                    <p className="text-[10px] text-gray-500 mt-2 italic line-clamp-2">{member.notes}</p>
                )}
            </div>
        );
    };

    // Render a couple (member and all spouses)
    const renderCouple = (member: Member) => {
        const spouses = member.spouseIds
            ? member.spouseIds.map(id => members.find(m => m.id === id)).filter((m): m is Member => !!m)
            : [];

        return (
            <div className="flex items-center gap-4">
                {/* Primary Member */}
                {renderMemberCard(member)}

                {/* Spouses */}
                {spouses.map(spouse => (
                    <React.Fragment key={spouse.id}>
                        <div className="flex flex-col items-center gap-1">
                            <Heart size={20} className="text-pink-500 fill-pink-500" />
                            <div className="h-8 w-0.5 bg-pink-400"></div>
                        </div>
                        {renderMemberCard(spouse)}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // Render tree hierarchy with couples
    const renderTree = (primaryParentId: number | null = null, level = 0): JSX.Element | null => {
        // Step 1: Identify the "Parent Group" and gather all potential children
        let potentialChildren: Member[] = [];
        let parentGroupIds: number[] = [];

        if (primaryParentId === null) {
            potentialChildren = members.filter(m => m.parentId === null);
        } else {
            // Find the primary parent
            const primaryParent = members.find(m => m.id === primaryParentId);
            if (primaryParent) {
                // The parent group includes the primary parent and all their spouses
                parentGroupIds = [primaryParent.id, ...(primaryParent.spouseIds || [])];

                // Get children of ANYONE in the parent group
                potentialChildren = members.filter(m =>
                    m.parentId !== null && parentGroupIds.includes(m.parentId)
                );
            }
        }

        // Step 2: Filter the children to determine who to render
        const children = potentialChildren.filter(m => {
            // 1. Exclude if m is a spouse of anyone in the parent group (fixes "spouse appearing as child" issue)
            if (m.spouseIds?.some(id => parentGroupIds.includes(id))) return false;

            // 2. Exclude if m is a spouse of someone else in THIS list (sibling logic)
            // We need to ensure we only render one "primary" member per couple in the next generation
            const isSpouseOfSomeoneHere = potentialChildren.some(other =>
                other.id !== m.id &&
                other.spouseIds?.includes(m.id)
            );

            if (isSpouseOfSomeoneHere) {
                // Find the spouse in this list
                const spouse = potentialChildren.find(s => s.id !== m.id && s.spouseIds?.includes(m.id));

                // If spouse exists in this list, use deterministic rule: Lower ID renders
                if (spouse && spouse.id < m.id) {
                    return false; // I am the "secondary" spouse, let the "primary" (lower ID) render me.
                }
            }
            return true;
        });

        if (children.length === 0) return null;

        return (
            <div className="flex flex-col items-center">
                {/* Horizontal line connecting siblings */}
                {children.length > 1 && (
                    <div className="relative w-full flex justify-center mb-4">
                        <div
                            className="border-t-2 border-gray-400"
                            style={{ width: `${(children.length - 1) * 320}px` }}
                        ></div>
                    </div>
                )}

                {/* Children Row */}
                <div className="flex gap-16 justify-center items-start">
                    {children.map((child) => {
                        const hasChildren = child.children && child.children.length > 0;

                        return (
                            <div key={child.id} className="flex flex-col items-center">
                                {/* Vertical line from horizontal connector to couple */}
                                {children.length > 1 && (
                                    <div className="w-0.5 h-8 bg-gray-400 mb-4"></div>
                                )}

                                {/* Couple (Member + Spouse) */}
                                {renderCouple(child)}

                                {/* Vertical line from couple to their children */}
                                {hasChildren && (
                                    <div className="w-0.5 h-12 bg-gray-400 mt-4"></div>
                                )}

                                {/* Recursive Children */}
                                {hasChildren && renderTree(child.id, level + 1)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-w-max mx-auto py-4 px-8">
            {/* Family Root Card */}
            <div className="flex justify-center">
                {renderFamilyRootCard()}
            </div>

            {/* Family Members Tree */}
            {renderTree()}

            {/* Empty State */}
            {members.length === 0 && (
                <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No family members yet. Click "Add Member" above to start!</p>
                </div>
            )}
        </div>
    );
};
