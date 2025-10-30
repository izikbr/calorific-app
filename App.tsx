import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProfile, FoodItem, ModalType } from './types';
import { calculateNutritionGoals } from './services/apiService';
import ImageLogModal from './components/ImageLogModal';
import ManualLogModal from './components/ManualLogModal';
import UserSelection from './components/UserSelection';

const App: React.FC = () => {
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<UserProfile[]>('registeredUsers', []);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const foodLogKey = activeUser ? `foodLog-${activeUser.id}-${today}` : '';
  const [foodLog, setFoodLog] = useLocalStorage<FoodItem[]>(foodLogKey, []);
  
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset food log when active user changes
  useEffect(() => {
    if (activeUser) {
      const newKey = `foodLog-${activeUser.id}-${today}`;
      const storedData = localStorage.getItem(newKey);
      setFoodLog(storedData ? JSON.parse(storedData) : []);
    } else {
      setFoodLog([]);
    }
  }, [activeUser, today]);

  const nutritionGoals = useMemo(() => {
    if (activeUser) {
      return calculateNutritionGoals(activeUser);
    }
    return { tdee: 0, bmi: 0, protein: 0, carbs: 0, fat: 0 };
  }, [activeUser]);

  const handleOnboardingComplete = (profileData: Omit<UserProfile, 'id'>) => {
    const newUser = { ...profileData, id: Date.now().toString() };
    setRegisteredUsers(prev => [...prev, newUser]);
    setActiveUser(newUser);
    setShowOnboarding(false);
  };

  const addFoodItem = (item: FoodItem | FoodItem[]) => {
    const itemsToAdd = Array.isArray(item) ? item : [item];
    setFoodLog(prevLog => [...prevLog, ...itemsToAdd]);
    setActiveModal(null);
  };

  const removeFoodItem = (index: number) => {
    setFoodLog(prevLog => prevLog.filter((_, i) => i !== index));
  }

  const handleLogout = () => {
    setActiveUser(null);
  }
  
  const handleSelectUser = (user: UserProfile) => {
    setActiveUser(user);
  }
  
  const handleAddNewUser = () => {
    setShowOnboarding(true);
  }

  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;
  
  const renderContent = () => {
    if (activeUser) {
      return (
         <>
            <Dashboard
              userProfile={activeUser}
              foodLog={foodLog}
              nutritionGoals={nutritionGoals}
              onOpenModal={setActiveModal}
              onRemoveFoodItem={removeFoodItem}
            />
            {ai && (
              <>
                <ImageLogModal
                  isOpen={activeModal === 'image'}
                  onClose={() => setActiveModal(null)}
                  onAddFood={addFoodItem}
                  ai={ai}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
                <ManualLogModal
                  isOpen={activeModal === 'manual'}
                  onClose={() => setActiveModal(null)}
                  onAddFood={addFoodItem}
                  ai={ai}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </>
            )}
          </>
      )
    }
    
    if (showOnboarding || registeredUsers.length === 0) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    
    return <UserSelection users={registeredUsers} onSelectUser={handleSelectUser} onAddNewUser={handleAddNewUser} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header userProfile={activeUser} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
