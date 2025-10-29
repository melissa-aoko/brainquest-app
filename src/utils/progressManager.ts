// Progress Manager - Handles individual child progress tracking

export interface SubjectProgress {
  id: string;
  name: string;
  progress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
  rarity: 'bronze' | 'silver' | 'gold';
  earnedDate?: string;
}

export interface ChildProgress {
  name: string;
  age: number;
  grade: number;
  avatar: string;
  level: number;
  totalStars: number;
  dailyStreak: number;
  lastPlayedDate: string;
  subjects: SubjectProgress[];
  badges: Badge[];
  completedLessons: string[]; // Array of lesson IDs
}

// Initial subject setup
const createInitialSubjects = (): SubjectProgress[] => [
  { id: 'math', name: 'Math', progress: 0, completedLessons: 0, totalLessons: 20 },
  { id: 'reading', name: 'Reading', progress: 0, completedLessons: 0, totalLessons: 20 },
  { id: 'science', name: 'Science', progress: 0, completedLessons: 0, totalLessons: 20 },
  { id: 'art', name: 'Art', progress: 0, completedLessons: 0, totalLessons: 15 },
  { id: 'music', name: 'Music', progress: 0, completedLessons: 0, totalLessons: 15 },
];

// All available badges
const createInitialBadges = (): Badge[] => [
  { id: 1, name: 'First Steps', icon: '👣', earned: false, rarity: 'bronze' },
  { id: 2, name: 'Math Beginner', icon: '🧮', earned: false, rarity: 'bronze' },
  { id: 3, name: 'Math Whiz', icon: '🔢', earned: false, rarity: 'silver' },
  { id: 4, name: 'Math Master', icon: '➗', earned: false, rarity: 'gold' },
  { id: 5, name: 'Book Worm', icon: '📚', earned: false, rarity: 'silver' },
  { id: 6, name: 'Science Star', icon: '🔬', earned: false, rarity: 'silver' },
  { id: 7, name: 'Art Expert', icon: '🎨', earned: false, rarity: 'silver' },
  { id: 8, name: '3 Day Streak', icon: '🔥', earned: false, rarity: 'bronze' },
  { id: 9, name: '5 Day Streak', icon: '⚡', earned: false, rarity: 'silver' },
  { id: 10, name: '10 Day Streak', icon: '💥', earned: false, rarity: 'gold' },
  { id: 11, name: 'Speed Demon', icon: '⚡', earned: false, rarity: 'bronze' },
  { id: 12, name: 'Brain Champion', icon: '🧠', earned: false, rarity: 'gold' },
  { id: 13, name: 'Music Maestro', icon: '🎵', earned: false, rarity: 'silver' },
  { id: 14, name: 'Perfect Score', icon: '💯', earned: false, rarity: 'gold' },
  { id: 15, name: 'Explorer', icon: '🗺️', earned: false, rarity: 'bronze' },
  { id: 16, name: 'Team Player', icon: '🤝', earned: false, rarity: 'silver' },
  { id: 17, name: 'Star Collector', icon: '⭐', earned: false, rarity: 'silver' },
  { id: 18, name: 'Level 5', icon: '🏆', earned: false, rarity: 'bronze' },
  { id: 19, name: 'Level 10', icon: '👑', earned: false, rarity: 'gold' },
];

// Create initial progress for a new child
export const createInitialProgress = (userData: {
  name: string;
  age: number;
  grade: number;
  avatar: string;
}): ChildProgress => {
  return {
    ...userData,
    level: 1,
    totalStars: 0,
    dailyStreak: 0,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    subjects: createInitialSubjects(),
    badges: createInitialBadges(),
    completedLessons: [],
  };
};

// Load child progress from localStorage
export const loadProgress = (): ChildProgress | null => {
  const saved = localStorage.getItem('brainquest_progress');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress data');
      return null;
    }
  }
  return null;
};

// Save child progress to localStorage
export const saveProgress = (progress: ChildProgress): void => {
  localStorage.setItem('brainquest_progress', JSON.stringify(progress));
};

// Update daily streak
export const updateStreak = (progress: ChildProgress): ChildProgress => {
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = new Date(progress.lastPlayedDate);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = progress.dailyStreak;
  
  if (diffDays === 1) {
    // Consecutive day - increment streak
    newStreak = progress.dailyStreak + 1;
  } else if (diffDays > 1) {
    // Missed days - reset streak
    newStreak = 1;
  }
  // If diffDays === 0, it's the same day, keep current streak

  return {
    ...progress,
    dailyStreak: newStreak,
    lastPlayedDate: today,
  };
};

// Add stars and check for level up
export const addStars = (progress: ChildProgress, stars: number): ChildProgress => {
  const newTotalStars = progress.totalStars + stars;
  
  // Level up every 100 stars
  const newLevel = Math.floor(newTotalStars / 100) + 1;

  return {
    ...progress,
    totalStars: newTotalStars,
    level: newLevel,
  };
};

// Complete a lesson in a subject
export const completeLesson = (
  progress: ChildProgress,
  subjectId: string,
  lessonId: string
): ChildProgress => {
  // Check if lesson already completed
  if (progress.completedLessons.includes(lessonId)) {
    return progress;
  }

  // Add lesson to completed
  const completedLessons = [...progress.completedLessons, lessonId];

  // Update subject progress
  const subjects = progress.subjects.map(subject => {
    if (subject.id === subjectId) {
      const newCompletedCount = subject.completedLessons + 1;
      const newProgress = Math.min(100, Math.round((newCompletedCount / subject.totalLessons) * 100));
      
      return {
        ...subject,
        completedLessons: newCompletedCount,
        progress: newProgress,
      };
    }
    return subject;
  });

  return {
    ...progress,
    subjects,
    completedLessons,
  };
};

// Award a badge
export const awardBadge = (progress: ChildProgress, badgeId: number): ChildProgress => {
  const badges = progress.badges.map(badge => {
    if (badge.id === badgeId && !badge.earned) {
      return {
        ...badge,
        earned: true,
        earnedDate: new Date().toISOString(),
      };
    }
    return badge;
  });

  return {
    ...progress,
    badges,
  };
};

// Check and award automatic badges based on progress
export const checkAndAwardBadges = (progress: ChildProgress): ChildProgress => {
  let updatedProgress = { ...progress };

  // First Steps - complete first lesson
  if (progress.completedLessons.length === 1 && !progress.badges.find(b => b.id === 1)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 1);
  }

  // Math badges based on math lessons completed
  const mathSubject = progress.subjects.find(s => s.id === 'math');
  if (mathSubject) {
    if (mathSubject.completedLessons >= 3 && !progress.badges.find(b => b.id === 2)?.earned) {
      updatedProgress = awardBadge(updatedProgress, 2); // Math Beginner
    }
    if (mathSubject.completedLessons >= 10 && !progress.badges.find(b => b.id === 3)?.earned) {
      updatedProgress = awardBadge(updatedProgress, 3); // Math Whiz
    }
    if (mathSubject.completedLessons >= 20 && !progress.badges.find(b => b.id === 4)?.earned) {
      updatedProgress = awardBadge(updatedProgress, 4); // Math Master
    }
  }

  // Streak badges
  if (progress.dailyStreak >= 3 && !progress.badges.find(b => b.id === 8)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 8);
  }
  if (progress.dailyStreak >= 5 && !progress.badges.find(b => b.id === 9)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 9);
  }
  if (progress.dailyStreak >= 10 && !progress.badges.find(b => b.id === 10)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 10);
  }

  // Star badges
  if (progress.totalStars >= 100 && !progress.badges.find(b => b.id === 17)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 17); // Star Collector
  }

  // Level badges
  if (progress.level >= 5 && !progress.badges.find(b => b.id === 18)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 18);
  }
  if (progress.level >= 10 && !progress.badges.find(b => b.id === 19)?.earned) {
    updatedProgress = awardBadge(updatedProgress, 19);
  }

  return updatedProgress;
};

// Award Team Player badge (called when joining multiplayer activities)
export const awardTeamPlayerBadge = (progress: ChildProgress): ChildProgress => {
  if (!progress.badges.find(b => b.id === 16)?.earned) {
    return awardBadge(progress, 16); // Team Player badge
  }
  return progress;
};

// Get newly earned badges (for display on reward screen)
export const getNewlyEarnedBadges = (oldProgress: ChildProgress, newProgress: ChildProgress): Badge[] => {
  const newBadges: Badge[] = [];
  
  newProgress.badges.forEach(newBadge => {
    const oldBadge = oldProgress.badges.find(b => b.id === newBadge.id);
    if (newBadge.earned && (!oldBadge || !oldBadge.earned)) {
      newBadges.push(newBadge);
    }
  });

  return newBadges;
};
