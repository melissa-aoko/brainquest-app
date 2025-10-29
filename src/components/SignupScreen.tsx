import { useState } from 'react';
import { ArrowLeft, Sparkles, Cake, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { playSound } from '../utils/sounds';

interface SignupScreenProps {
  onComplete: (userData: { name: string; age: number; grade: number; avatar: string }) => void;
  onBack: () => void;
}

export function SignupScreen({ onComplete, onBack }: SignupScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatars = [
    { id: 'rocket', emoji: '🚀', name: 'Space Explorer' },
    { id: 'unicorn', emoji: '🦄', name: 'Magic Unicorn' },
    { id: 'dinosaur', emoji: '🦕', name: 'Dino Friend' },
    { id: 'superhero', emoji: '🦸', name: 'Super Hero' },
    { id: 'cat', emoji: '🐱', name: 'Cool Cat' },
    { id: 'robot', emoji: '🤖', name: 'Robot Buddy' },
    { id: 'panda', emoji: '🐼', name: 'Panda Pal' },
    { id: 'star', emoji: '⭐', name: 'Shining Star' },
  ];

  const handleNext = () => {
    playSound('click');
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && age && grade) {
      setStep(3);
    }
  };

  const handleAvatarSelect = (avatarId: string) => {
    playSound('success');
    setSelectedAvatar(avatarId);
  };

  const handleComplete = () => {
    if (selectedAvatar) {
      playSound('levelUp');
      onComplete({
        name: name.trim(),
        age: parseInt(age),
        grade: parseInt(grade),
        avatar: selectedAvatar
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => {
              playSound('click');
              if (step > 1) {
                setStep(step - 1);
              } else {
                onBack();
              }
            }}
            className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-12 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-purple-600' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          <div className="w-10"></div>
        </div>

        <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-purple-700 mb-2">What's Your Name?</h2>
                <p className="text-purple-500">Let's get to know you!</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-700">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-xl border-2 border-purple-200 focus:border-purple-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNext();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white shadow-lg disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 2: Age & Grade */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-purple-700 mb-2">Tell Us More!</h2>
                <p className="text-purple-500">This helps us personalize your learning</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-purple-700 flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    How old are you?
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    min="5"
                    max="10"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-14 rounded-xl border-2 border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-purple-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    What grade are you in?
                  </Label>
                  <Input
                    id="grade"
                    type="number"
                    placeholder="Grade (1-5)"
                    min="1"
                    max="5"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-14 rounded-xl border-2 border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!age || !grade}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white shadow-lg disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 3: Avatar Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">
                    {avatars.find(a => a.id === selectedAvatar)?.emoji || '🎨'}
                  </span>
                </div>
                <h2 className="text-purple-700 mb-2">Choose Your Avatar!</h2>
                <p className="text-purple-500">Pick your learning buddy</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`p-4 rounded-2xl transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 ring-4 ring-purple-300 scale-105'
                        : 'bg-purple-50 hover:bg-purple-100'
                    }`}
                  >
                    <div className="text-4xl">{avatar.emoji}</div>
                  </button>
                ))}
              </div>

              {selectedAvatar && (
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <p className="text-purple-700">
                    {avatars.find(a => a.id === selectedAvatar)?.name}
                  </p>
                </div>
              )}

              <Button
                onClick={handleComplete}
                disabled={!selectedAvatar}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl text-white shadow-lg disabled:opacity-50"
              >
                Start Learning! 🚀
              </Button>
            </div>
          )}
        </Card>

        {/* Welcome Message */}
        {step === 1 && (
          <p className="text-center text-purple-600 mt-6">
            Hey there! Let's create your BrainQuest Jr. account
          </p>
        )}
      </div>
    </div>
  );
}
