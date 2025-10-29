// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SignupScreen } from './components/SignupScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { LessonScreen } from './components/LessonScreen';
import { RewardScreen } from './components/RewardScreen';
import { ShopScreen } from './components/ShopScreen';
import { ParentSettings } from './components/ParentSettings';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CommunityHub } from './components/CommunityHub';
import { MultiplayerBattle } from './components/MultiplayerBattle';
import { StudySession } from './components/StudySession';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { enableSound } from './utils/sounds';
import { Screen, NavigateFn } from './types/navigation';
import {
  ChildProgress,
  loadProgress,
  saveProgress,
  createInitialProgress,
  updateStreak,
  addStars,
  completeLesson,
  checkAndAwardBadges,
  awardTeamPlayerBadge
} from './utils/progressManager';

type UserMode = 'kid' | 'parent' | 'teacher' | null;

interface UserData {
  name: string;
  age: number;
  grade: number;
  avatar: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [childProgress, setChildProgress] = useState<ChildProgress | null>(null);
  const [lessonStars, setLessonStars] = useState(0);
  const [lessonSubject, setLessonSubject] = useState('math');
  const [battleId, setBattleId] = useState('');
  const [studySessionId, setStudySessionId] = useState('');

  // Enable sound on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      enableSound();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Load user data and progress
  useEffect(() => {
    const savedUserData = localStorage.getItem('brainquest_user');
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch {
        console.error('Failed to parse user data');
      }
    }

    const progress = loadProgress();
    if (progress) setChildProgress(progress);
  }, []);

  const handleSelectMode = (mode: 'kid' | 'parent' | 'teacher') => {
    setUserMode(mode);
    if (mode === 'teacher') setCurrentScreen('teacher');
    else if (mode === 'parent') setCurrentScreen('settings');
    else setCurrentScreen(userData ? 'home' : 'signup');
  };

  const handleSignupComplete = (newUserData: UserData) => {
    setUserData(newUserData);
    localStorage.setItem('brainquest_user', JSON.stringify(newUserData));
    const initialProgress = createInitialProgress(newUserData);
    setChildProgress(initialProgress);
    saveProgress(initialProgress);
    setCurrentScreen('home');
  };

  const handleNavigate: NavigateFn = useCallback((screen, subject) => {
  if (screen === 'lesson') {
    if (subject) {
      setLessonSubject(subject);
    } else {
      console.warn('handleNavigate: lesson navigation without subject — using current lessonSubject');
    }
  }
  setCurrentScreen(screen);
}, [setLessonSubject, setCurrentScreen]);

  // Lesson completion
  const handleLessonComplete = (earnedStars: number) => {
    if (!childProgress) return;
    let updatedProgress = childProgress;
    updatedProgress = updateStreak(updatedProgress);
    updatedProgress = addStars(updatedProgress, earnedStars);
    updatedProgress = completeLesson(updatedProgress, lessonSubject, `${lessonSubject}-${Date.now()}`);
    updatedProgress = checkAndAwardBadges(updatedProgress);
    setChildProgress(updatedProgress);
    saveProgress(updatedProgress);
    setLessonStars(earnedStars);
    setCurrentScreen('rewards');
  };

  // Battle completion
  const handleBattleComplete = (earnedStars: number, won: boolean, battleSubject?: string) => {
    if (!childProgress) return;
    let updatedProgress = childProgress;
    updatedProgress = updateStreak(updatedProgress);
    updatedProgress = addStars(updatedProgress, earnedStars);
    if (battleSubject) {
      const lessonId = `battle-${battleSubject}-${Date.now()}`;
      updatedProgress = completeLesson(updatedProgress, battleSubject, lessonId);
    }
    updatedProgress = checkAndAwardBadges(updatedProgress);
    setChildProgress(updatedProgress);
    saveProgress(updatedProgress);
    setLessonStars(earnedStars);
    setCurrentScreen('rewards');
  };

  // Study session completion
  const handleStudySessionComplete = (earnedStars: number, sessionSubject?: string) => {
    if (!childProgress) return;
    let updatedProgress = childProgress;
    updatedProgress = updateStreak(updatedProgress);
    updatedProgress = addStars(updatedProgress, earnedStars);
    if (sessionSubject) {
      const lessonId = `study-${sessionSubject}-${Date.now()}`;
      updatedProgress = completeLesson(updatedProgress, sessionSubject, lessonId);
    }
    updatedProgress = checkAndAwardBadges(updatedProgress);
    setChildProgress(updatedProgress);
    saveProgress(updatedProgress);
    setLessonStars(earnedStars);
    setCurrentScreen('rewards');
  };

  // Start battle
  const handleStartBattle = (id: string) => {
    setBattleId(id);
    if (childProgress) {
      const updatedProgress = awardTeamPlayerBadge(childProgress);
      setChildProgress(updatedProgress);
      saveProgress(updatedProgress);
      if (updatedProgress.badges.find(b => b.id === 16)?.earned) {
        toast.success('🎉 New Badge Earned: Team Player! 🤝');
      }
    }
    setCurrentScreen('battle');
  };

  // Join study session
  const handleJoinStudySession = (id: string) => {
    setStudySessionId(id);
    if (childProgress) {
      const updatedProgress = awardTeamPlayerBadge(childProgress);
      setChildProgress(updatedProgress);
      saveProgress(updatedProgress);
      if (updatedProgress.badges.find(b => b.id === 16)?.earned) {
        toast.success('🎉 New Badge Earned: Team Player! 🤝');
      }
    }
    setCurrentScreen('study');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && <WelcomeScreen onSelectMode={handleSelectMode} />}
      {currentScreen === 'signup' && <SignupScreen onComplete={handleSignupComplete} onBack={() => setCurrentScreen('welcome')} />}
      {currentScreen === 'home' && userMode && childProgress && (
        <HomeDashboard onNavigate={handleNavigate} userMode={userMode} progress={childProgress} />
      )}
      {currentScreen === 'lesson' && childProgress && (
        <LessonScreen onNavigate={handleNavigate} onComplete={handleLessonComplete} subject={lessonSubject} />
      )}
      {currentScreen === 'rewards' && childProgress && (
        <RewardScreen onNavigate={handleNavigate} earnedStars={lessonStars} progress={childProgress} />
      )}
      {currentScreen === 'shop' && <ShopScreen onNavigate={handleNavigate} />}
      {currentScreen === 'settings' && <ParentSettings onNavigate={handleNavigate} />}
      {currentScreen === 'teacher' && <TeacherDashboard onNavigate={handleNavigate} />}
      {currentScreen === 'community' && childProgress && (
        <CommunityHub
          onNavigate={handleNavigate}
          onStartBattle={handleStartBattle}
          onJoinStudySession={handleJoinStudySession}
          progress={childProgress}
        />
      )}
      {currentScreen === 'battle' && childProgress && battleId && (
        <MultiplayerBattle onNavigate={handleNavigate} onComplete={handleBattleComplete} battleId={battleId} progress={childProgress} />
      )}
      {currentScreen === 'study' && childProgress && studySessionId && (
        <StudySession onNavigate={handleNavigate} onComplete={handleStudySessionComplete} sessionId={studySessionId} progress={childProgress} />
      )}
      <Toaster />
    </div>
  );
}
