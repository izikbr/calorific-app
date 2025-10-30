import React, { useState } from 'react';
import { UserProfile } from '../types';
import Card from './common/Card';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface UserSelectionProps {
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onAddNewUser: () => void;
  onDeleteUser: (userId: string) => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ users, onSelectUser, onAddNewUser, onDeleteUser }) => {
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation(); // Prevent triggering onSelectUser
    setUserToDelete(user);
  };
  
  const confirmDeletion = () => {
    if(userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  }

  return (
    <>
    <Card>
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">ברוכים השבים לקלוריק!</h1>
        <p className="text-slate-500 mb-8">מי משתמש באפליקציה היום?</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {users.map(user => (
            <div key={user.id} onClick={() => onSelectUser(user)} className="relative cursor-pointer group flex flex-col items-center p-4 border border-transparent rounded-lg hover:bg-primary-50 hover:border-primary-200 transition">
                <button
                    onClick={(e) => handleDeleteClick(e, user)}
                    className="absolute top-1 right-1 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title={`מחק את ${user.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-3 group-hover:bg-primary-200 transition">
                     <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-slate-500 group-hover:text-primary-600 transition"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              <span className="font-semibold text-slate-700 group-hover:text-primary-700 transition">{user.name}</span>
            </div>
          ))}
           <div onClick={onAddNewUser} className="cursor-pointer group flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-slate-400 group-hover:text-primary-500 transition"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                 </div>
                 <span className="font-semibold text-slate-500 group-hover:text-primary-600 transition">משתמש חדש</span>
            </div>
        </div>
      </div>
    </Card>
    <ConfirmDeleteModal 
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeletion}
        userName={userToDelete?.name || ''}
    />
    </>
  );
};

export default UserSelection;