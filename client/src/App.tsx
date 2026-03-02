import React, { useState, useEffect } from 'react';
import { Plus, Crown, X } from 'lucide-react';
import { User, Member, MemberFormData, FamilyRoot } from './types/types';
import { PLANS } from './constants/constants';
import { AuthService } from './services/AuthService';
import { LoginView } from './components/LoginView';
import { UpgradeModal } from './components/UpgradeModal';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DashboardView } from './components/DashboardView';
import { MemberModal } from './components/MemberModal';

const FamilyTreeApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'dashboard'>('login');
  const [members, setMembers] = useState<Member[]>([]);
  const [familyRoot, setFamilyRoot] = useState<FamilyRoot>({ familyName: 'Smith Family', createdDate: new Date().toISOString() });
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedParent, setSelectedParent] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFamilyNameModal, setShowFamilyNameModal] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState('');

  const [formData, setFormData] = useState<MemberFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    gender: '',
    parentId: null,
    relationship: '',
    spouseIds: [],
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = () => {
    if (!user) return;

    const stored = localStorage.getItem(`family_${user.id}`);
    const storedRoot = localStorage.getItem(`family_root_${user.id}`);

    if (storedRoot) {
      setFamilyRoot(JSON.parse(storedRoot));
    }

    if (stored) {
      const parsedMembers = JSON.parse(stored);
      // Migration: Convert spouseId to spouseIds
      const migratedMembers = parsedMembers.map((m: any) => ({
        ...m,
        spouseIds: m.spouseIds || (m.spouseId ? [m.spouseId] : []),
        spouseId: undefined // Remove old field
      }));
      setMembers(migratedMembers);
    } else {
      // Initialize with sample hierarchical data
      const sample: Member[] = [
        {
          id: 1,
          firstName: 'Robert',
          lastName: 'Smith',
          birthDate: '1945-03-15',
          gender: 'male',
          relationship: 'Grandfather',
          parentId: null,
          spouseIds: [2],
          children: [3, 4]
        },
        {
          id: 2,
          firstName: 'Mary',
          lastName: 'Smith',
          birthDate: '1947-07-22',
          gender: 'female',
          relationship: 'Grandmother',
          parentId: null,
          spouseIds: [1],
          children: [3, 4]
        },
        {
          id: 3,
          firstName: 'John',
          lastName: 'Smith',
          birthDate: '1970-11-10',
          gender: 'male',
          relationship: 'Father',
          parentId: 1,
          spouseIds: [5],
          children: [6, 7]
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Smith',
          birthDate: '1972-05-18',
          gender: 'female',
          relationship: 'Aunt',
          parentId: 1,
          children: [8],
          spouseIds: []
        },
        {
          id: 5,
          firstName: 'Jennifer',
          lastName: 'Smith',
          birthDate: '1972-09-25',
          gender: 'female',
          relationship: 'Mother',
          parentId: null,
          spouseIds: [3],
          children: [6, 7]
        },
        {
          id: 6,
          firstName: 'Michael',
          lastName: 'Smith',
          birthDate: '1995-04-12',
          gender: 'male',
          relationship: 'Son',
          parentId: 3,
          children: [],
          spouseIds: []
        },
        {
          id: 7,
          firstName: 'Emily',
          lastName: 'Smith',
          birthDate: '1998-08-30',
          gender: 'female',
          relationship: 'Daughter',
          parentId: 3,
          children: [],
          spouseIds: []
        },
        {
          id: 8,
          firstName: 'David',
          lastName: 'Smith',
          birthDate: '2000-12-05',
          gender: 'male',
          relationship: 'Cousin',
          parentId: 4,
          children: [],
          spouseIds: []
        }
      ];
      setMembers(sample);
      localStorage.setItem(`family_${user.id}`, JSON.stringify(sample));
    }
  };

  const saveFamilyData = (data: Member[]) => {
    if (!user) return;
    localStorage.setItem(`family_${user.id}`, JSON.stringify(data));
    setMembers(data);
  };

  const saveFamilyRoot = (root: FamilyRoot) => {
    if (!user) return;
    localStorage.setItem(`family_root_${user.id}`, JSON.stringify(root));
    setFamilyRoot(root);
  };

  const handleLogin = async (email: string, password: string) => {
    const loggedUser = await AuthService.login(email, password);
    setUser(loggedUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setView('login');
    setMembers([]);
  };

  const canAddMember = () => {
    if (!user) return false;
    const plan = PLANS[user.subscription];
    return plan.members === -1 || members.length < plan.members;
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      deathDate: '',
      gender: '',
      parentId: null,
      relationship: '',
      spouseIds: [],
      notes: ''
    });
    setSelectedParent(null);
    setSelectedMember(null);
  };

  const openAddModal = (parentMember: Member | null = null) => {
    if (!canAddMember()) {
      setShowUpgrade(true);
      return;
    }
    setSelectedParent(parentMember);
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      deathDate: '',
      gender: '',
      parentId: parentMember?.id || null,
      relationship: '',
      spouseIds: [],
      notes: ''
    });
    setShowAddModal(true);
  };

  const addMember = () => {
    if (!user) return;
    if (!formData.firstName || !formData.lastName) {
      alert('Please fill in first and last name');
      return;
    }

    const newMember: Member = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      deathDate: formData.deathDate,
      gender: formData.gender as 'male' | 'female' | 'other',
      parentId: selectedParent ? selectedParent.id : null,
      relationship: formData.relationship,
      spouseIds: formData.spouseIds || [],
      notes: formData.notes,
      children: []
    };

    let updatedMembers = [...members, newMember];

    // If adding a child, update parent's children array
    if (selectedParent) {
      updatedMembers = updatedMembers.map(m =>
        m.id === selectedParent.id
          ? { ...m, children: [...(m.children || []), newMember.id] }
          : m
      );
    }

    // Handle spouse linking
    if (newMember.spouseIds && newMember.spouseIds.length > 0) {
      updatedMembers = updatedMembers.map(m => {
        if (newMember.spouseIds?.includes(m.id)) {
          // Add new member to spouse's spouseIds if not already there
          const currentSpouses = m.spouseIds || [];
          if (!currentSpouses.includes(newMember.id)) {
            return { ...m, spouseIds: [...currentSpouses, newMember.id] };
          }
        }
        return m;
      });
    }

    saveFamilyData(updatedMembers);
    setShowAddModal(false);
    resetForm();
  };

  const editMember = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      birthDate: member.birthDate,
      deathDate: member.deathDate || '',
      gender: member.gender,
      parentId: member.parentId,
      relationship: member.relationship || '',
      notes: member.notes || '',
      spouseIds: member.spouseIds || []
    });
    setShowEditModal(true);
  };

  const updateMember = () => {
    if (!selectedMember || !user) return;
    if (!formData.firstName || !formData.lastName) {
      alert('Please fill in first and last name');
      return;
    }

    const updatedMember: Member = {
      ...selectedMember,
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      deathDate: formData.deathDate,
      gender: formData.gender as 'male' | 'female' | 'other',
      relationship: formData.relationship,
      spouseIds: formData.spouseIds || [],
      notes: formData.notes
    };

    let updatedMembers = members.map(m =>
      m.id === selectedMember.id ? updatedMember : m
    );

    // Handle spouse linking changes
    // 1. Remove from spouses that were removed
    const oldSpouses = selectedMember.spouseIds || [];
    const newSpouses = updatedMember.spouseIds || [];

    const removedSpouses = oldSpouses.filter(id => !newSpouses.includes(id));
    const addedSpouses = newSpouses.filter(id => !oldSpouses.includes(id));

    updatedMembers = updatedMembers.map(m => {
      // If this member was removed as a spouse
      if (removedSpouses.includes(m.id)) {
        return {
          ...m,
          spouseIds: (m.spouseIds || []).filter(id => id !== selectedMember.id)
        };
      }
      // If this member was added as a spouse
      if (addedSpouses.includes(m.id)) {
        const currentSpouses = m.spouseIds || [];
        if (!currentSpouses.includes(updatedMember.id)) {
          return { ...m, spouseIds: [...currentSpouses, updatedMember.id] };
        }
      }
      return m;
    });

    saveFamilyData(updatedMembers);
    setShowEditModal(false);
    setSelectedMember(null);
    resetForm();
  };

  const deleteMember = (memberId: number) => {
    if (!confirm('Are you sure you want to delete this member and all their descendants?')) {
      return;
    }

    const getDescendants = (id: number): number[] => {
      const member = members.find(m => m.id === id);
      if (!member) return [id];

      let descendants = [id];
      (member.children || []).forEach(childId => {
        descendants = [...descendants, ...getDescendants(childId)];
      });
      return descendants;
    };

    const toDelete = getDescendants(memberId);
    const updated = members.filter(m => !toDelete.includes(m.id));

    // Remove from parent's children array and spouses
    updated.forEach(m => {
      if (m.children) {
        m.children = m.children.filter(cid => !toDelete.includes(cid));
      }
      if (m.spouseIds) {
        m.spouseIds = m.spouseIds.filter(sid => !toDelete.includes(sid));
      }
    });

    saveFamilyData(updated);
  };

  const handleAddChild = (parentId: number | null) => {
    const parent = parentId ? members.find(m => m.id === parentId) : null;
    openAddModal(parent);
  };

  const handleEditFamilyName = () => {
    setTempFamilyName(familyRoot.familyName);
    setShowFamilyNameModal(true);
  };

  const saveFamilyName = () => {
    if (!tempFamilyName.trim()) {
      alert('Please enter a family name');
      return;
    }
    saveFamilyRoot({ ...familyRoot, familyName: tempFamilyName });
    setShowFamilyNameModal(false);
  };

  const upgradePlan = (planType: 'free' | 'premium' | 'family') => {
    if (!user) return;
    setUser({ ...user, subscription: planType });
    setShowUpgrade(false);
    alert(`Successfully upgraded to ${PLANS[planType].name} plan!`);
  };

  // LOGIN VIEW
  if (view === 'login') {
    return <LoginView onLogin={handleLogin} />;
  }

  // UPGRADE MODAL
  if (showUpgrade && user) {
    return (
      <UpgradeModal
        user={user}
        onUpgrade={upgradePlan}
        onClose={() => setShowUpgrade(false)}
      />
    );
  }

  // MAIN APP
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onUpgrade={() => setShowUpgrade(true)}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <StatsCards user={user} members={members} />

        {/* Add Root Member Button */}
        <div className="mb-6">
          <button
            onClick={() => openAddModal(null)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Root Member
          </button>
        </div>

        {/* Dashboard View */}
        <DashboardView
          familyRoot={familyRoot}
          members={members}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={editMember}
          onDelete={deleteMember}
          onAddChild={handleAddChild}
          onEditFamilyName={handleEditFamilyName}
        />
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={showAddModal}
        isEdit={false}
        members={members}
        formData={formData}
        selectedMember={null}
        selectedParent={selectedParent}
        onFormChange={setFormData}
        onSave={addMember}
        onClose={() => setShowAddModal(false)}
      />

      <MemberModal
        isOpen={showEditModal}
        isEdit={true}
        members={members}
        formData={formData}
        selectedMember={selectedMember}
        selectedParent={null}
        onFormChange={setFormData}
        onSave={updateMember}
        onClose={() => setShowEditModal(false)}
      />

      {/* Family Name Modal */}
      {showFamilyNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Family Name</h2>
              <button onClick={() => setShowFamilyNameModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Name
              </label>
              <input
                type="text"
                value={tempFamilyName}
                onChange={(e) => setTempFamilyName(e.target.value)}
                placeholder="e.g., Smith Family"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveFamilyName}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowFamilyNameModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeApp;