import { Rocket, Users, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { playSound } from '../utils/sounds';

interface WelcomeScreenProps {
  onSelectMode: (mode: 'kid' | 'parent' | 'teacher') => void;
}

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  const handleModeSelect = (mode: 'kid' | 'parent' | 'teacher') => {
    playSound('click');
    onSelectMode(mode);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <Rocket className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <div>
            <h1 className="text-purple-700 mb-2">BrainQuest Jr.</h1>
            <p className="text-purple-600">Where Learning is an Adventure!</p>
          </div>
        </div>

        {/* Welcome Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1565373086464-c8af0d586c0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYxMjEyMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Happy children learning"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Selection Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => handleModeSelect('kid')}
            className="w-full h-16 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-2xl shadow-lg text-white"
          >
            <Rocket className="w-6 h-6 mr-2" />
            I'm a Kid - Let's Play!
          </Button>

          <Button 
            onClick={() => handleModeSelect('parent')}
            className="w-full h-16 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-2xl shadow-lg text-white"
          >
            <Users className="w-6 h-6 mr-2" />
            I'm a Parent
          </Button>

          <Button 
            onClick={() => handleModeSelect('teacher')}
            className="w-full h-16 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 rounded-2xl shadow-lg text-white"
          >
            <GraduationCap className="w-6 h-6 mr-2" />
            I'm a Teacher
          </Button>
        </div>

        {/* Footer */}
        <p className="text-purple-500">Safe • Fun • Educational</p>
      </div>
    </div>
  );
}
