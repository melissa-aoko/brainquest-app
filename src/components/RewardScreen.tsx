import { Star, Trophy, Medal, Zap, Crown, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { playSound } from '../utils/sounds';
import { useEffect, useState } from 'react';
import { ChildProgress } from '../utils/progressManager';

interface RewardScreenProps {
  onNavigate: (screen: string) => void;
  earnedStars: number;
  progress: ChildProgress;
}

export function RewardScreen({ onNavigate, earnedStars, progress }: RewardScreenProps) {
  const [previousProgress] = useState<ChildProgress>(() => {
    // Try to get the previous state to compare badges
    const saved = localStorage.getItem('brainquest_progress_before_lesson');
    if (saved) {
      try {
        localStorage.removeItem('brainquest_progress_before_lesson');
        return JSON.parse(saved);
      } catch (e) {
        return progress;
      }
    }
    return progress;
  });

  // Play celebration sounds when component mounts
  useEffect(() => {
    playSound('levelUp');
    // Check if new badges were earned
    const newBadges = progress.badges.filter(badge => {
      const prevBadge = previousProgress.badges.find(b => b.id === badge.id);
      return badge.earned && (!prevBadge || !prevBadge.earned);
    });
    
    if (newBadges.length > 0) {
      setTimeout(() => playSound('badge'), 500);
    }
  }, []);

  // Get newly earned badges (comparing with previous state)
  const earnedBadges = progress.badges.filter(badge => {
    const prevBadge = previousProgress.badges.find(b => b.id === badge.id);
    return badge.earned && (!prevBadge || !prevBadge.earned);
  });

  const allBadges = progress.badges;

  // Calculate level progress
  const currentLevel = progress.level;
  const nextLevel = currentLevel + 1;
  const starsForCurrentLevel = (currentLevel - 1) * 100;
  const starsInCurrentLevel = progress.totalStars - starsForCurrentLevel;
  const levelProgress = starsInCurrentLevel; // 0-100 scale

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 pb-8">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white p-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Sparkles className="absolute top-4 left-4 w-8 h-8" />
          <Star className="absolute top-8 right-8 w-6 h-6" />
          <Trophy className="absolute bottom-4 left-1/4 w-10 h-10" />
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <Button 
            onClick={() => {
              playSound('click');
              onNavigate('home');
            }}
            className="bg-white/20 hover:bg-white/30 rounded-xl mb-4"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4"
            >
              <Trophy className="w-16 h-16 text-yellow-500" />
            </motion.div>
            <h1 className="text-white mb-2">Amazing Work!</h1>
            <p className="text-white/90">You earned {earnedStars} stars!</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* New Badges Earned */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
          <h3 className="text-purple-700 mb-4">🎉 New Badges Unlocked!</h3>
          <div className="grid grid-cols-2 gap-4">
            {earnedBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.2, type: "spring" }}
              >
                <Card className={`p-6 rounded-2xl text-center ${
                  badge.rarity === 'gold' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400' :
                  badge.rarity === 'silver' ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400' :
                  'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400'
                } border-2`}>
                  <div className="text-5xl mb-2">{badge.icon}</div>
                  <div className="text-purple-700">{badge.name}</div>
                  <Badge className="mt-2 bg-purple-600 text-white">NEW!</Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Level Progress */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Crown className="w-10 h-10 text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span>Level {currentLevel}</span>
                <span>Level {nextLevel}</span>
              </div>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full"
                />
              </div>
              <p className="text-white/90 mt-2">{100 - levelProgress} more stars to level up!</p>
            </div>
          </div>
        </Card>

        {/* All Badges Collection */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-700">Badge Collection</h3>
            <Badge className="bg-purple-100 text-purple-700">
              {allBadges.filter(b => b.earned).length}/{allBadges.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl text-center transition-all ${
                  badge.earned 
                    ? badge.rarity === 'gold' 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' 
                      : badge.rarity === 'silver'
                      ? 'bg-gradient-to-br from-gray-100 to-gray-200'
                      : 'bg-gradient-to-br from-orange-100 to-orange-200'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`text-3xl mb-1 ${!badge.earned && 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                <p className={`text-xs ${badge.earned ? 'text-purple-700' : 'text-gray-500'}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              playSound('whoosh');
              onNavigate('lesson');
            }}
            className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button 
            onClick={() => {
              playSound('click');
              onNavigate('home');
            }}
            className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl text-white shadow-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
