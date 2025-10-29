import { Star, Trophy, Rocket, Book, Brain, Palette, Music, Calculator, Settings, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { playSound } from '../utils/sounds';
import { ChildProgress } from '../utils/progressManager';

interface HomeDashboardProps {
  onNavigate: (screen: string, subject?: string) => void;
  userMode: 'kid' | 'parent' | 'teacher';
  progress: ChildProgress;
}

const getSubjectIcon = (subjectId: string) => {
  switch (subjectId) {
    case 'math': return Calculator;
    case 'reading': return Book;
    case 'science': return Brain;
    case 'art': return Palette;
    case 'music': return Music;
    default: return Book;
  }
};

const getSubjectColor = (subjectId: string) => {
  switch (subjectId) {
    case 'math': return 'from-blue-400 to-blue-600';
    case 'reading': return 'from-green-400 to-green-600';
    case 'science': return 'from-purple-400 to-purple-600';
    case 'art': return 'from-pink-400 to-pink-600';
    case 'music': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

export function HomeDashboard({ onNavigate, userMode, progress }: HomeDashboardProps) {
  const kidName = progress.name;
  const currentLevel = progress.level;
  const totalStars = progress.totalStars;
  const dailyStreak = progress.dailyStreak;
  const userAvatar = progress.avatar;

  // Get subjects from progress with icons and colors
  const subjects = progress.subjects.map(subject => ({
    ...subject,
    icon: getSubjectIcon(subject.id),
    color: getSubjectColor(subject.id),
  }));

  // Get recently earned badges (last 3)
  const recentBadges = progress.badges
    .filter(badge => badge.earned)
    .sort((a, b) => {
      if (!a.earnedDate || !b.earnedDate) return 0;
      return new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime();
    })
    .slice(0, 3)
    .map(badge => ({
      name: badge.name,
      emoji: badge.icon,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {userAvatar && (
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  {userAvatar === 'rocket' && '🚀'}
                  {userAvatar === 'unicorn' && '🦄'}
                  {userAvatar === 'dinosaur' && '🦕'}
                  {userAvatar === 'superhero' && '🦸'}
                  {userAvatar === 'cat' && '🐱'}
                  {userAvatar === 'robot' && '🤖'}
                  {userAvatar === 'panda' && '🐼'}
                  {userAvatar === 'star' && '⭐'}
                </div>
              )}
              <div>
                <p className="opacity-90">Welcome back,</p>
                <h2 className="text-white">{kidName}!</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  playSound('click');
                  onNavigate('shop');
                }}
                className="bg-white/20 hover:bg-white/30 rounded-xl"
                size="icon"
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => {
                  playSound('click');
                  onNavigate('settings');
                }}
                className="bg-white/20 hover:bg-white/30 rounded-xl"
                size="icon"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-900" />
                </div>
              </div>
              <div className="text-white">Level {currentLevel}</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
              <div className="text-white">{totalStars} Stars</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white">
                  🔥
                </div>
              </div>
              <div className="text-white">{dailyStreak} Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Welcome Message for New Users */}
        {totalStars === 0 && (
          <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-blue-100 to-purple-100">
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-purple-700 mb-2">Welcome to BrainQuest Jr., {kidName}!</h3>
              <p className="text-purple-600">Start your learning adventure by choosing a subject below!</p>
            </div>
          </Card>
        )}

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-purple-700">Recent Achievements</h3>
              <Button 
                onClick={() => {
                  playSound('click');
                  onNavigate('rewards');
                }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 rounded-xl text-white"
              >
                View All
              </Button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {recentBadges.map((badge, idx) => (
                <Badge 
                  key={idx} 
                className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl border-2 border-purple-200"
              >
                <span className="mr-2">{badge.emoji}</span>
                {badge.name}
              </Badge>
            ))}
          </div>
        </Card>
        )}

        {/* Community Hub */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-orange-400 to-pink-500 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              🌟
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">Community Hub</h3>
              <p className="text-white/90">Play with friends & compete!</p>
            </div>
            <Button 
              onClick={() => {
                playSound('whoosh');
                onNavigate('community');
              }}
              className="bg-white text-orange-600 hover:bg-white/90 rounded-xl"
            >
              Join
            </Button>
          </div>
        </Card>

        {/* Daily Challenge */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-blue-400 to-purple-500 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">Daily Challenge</h3>
              <p className="text-white/90">Solve 5 Math Problems!</p>
            </div>
            <Button 
              onClick={() => {
                playSound('whoosh');
                onNavigate('lesson', 'math');
              }}
              className="bg-white text-purple-600 hover:bg-white/90 rounded-xl"
            >
              Start
            </Button>
          </div>
        </Card>

        {/* Subjects */}
        <div>
          <h3 className="text-purple-700 mb-4">Your Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              return (
                <Card 
                  key={subject.id} 
                  className="p-5 rounded-3xl shadow-lg border-0 bg-white hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => {
                    playSound('click');
                    onNavigate('lesson', subject.id);
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${subject.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800">{subject.name}</h4>
                      <p className="text-gray-500">{subject.progress}% Complete</p>
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-3 bg-gray-100" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Upgrade Banner (Freemium) */}
        <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-yellow-300 to-orange-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-800 mb-1">Unlock Premium!</h3>
              <p className="text-gray-700">Get unlimited lessons, badges & more</p>
            </div>
            <Button 
              onClick={() => {
                playSound('click');
                onNavigate('shop');
              }}
              className="bg-white text-orange-600 hover:bg-gray-50 rounded-xl shadow-lg"
            >
              Upgrade
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
