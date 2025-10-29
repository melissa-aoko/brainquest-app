import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { playSound } from '../utils/sounds';
import { ChildProgress } from '../utils/progressManager';
import { getLessonsBySubject } from '../utils/lessonData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MultiplayerBattleProps {
  onNavigate: (screen: string) => void;
  onComplete: (earnedStars: number, won: boolean, subject?: string) => void;
  battleId: string;
  progress: ChildProgress;
}

interface BattleState {
  id: string;
  subject: string;
  difficulty: string;
  players: Array<{
    userId: string;
    name: string;
    avatar: string;
    score: number;
    ready: boolean;
  }>;
  status: string;
  currentQuestion: number;
}

export function MultiplayerBattle({ onNavigate, onComplete, battleId, progress }: MultiplayerBattleProps) {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isReady, setIsReady] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const userId = `user-${progress.name.toLowerCase().replace(/\s+/g, '-')}`;
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-78a36db3`;

  // Fetch battle state
  const fetchBattleState = async () => {
    try {
      const res = await fetch(`${serverUrl}/battle/${battleId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.battle) {
        setBattleState(data.battle);
        
        // Check if battle just started
        if (data.battle.status === 'active' && questions.length === 0) {
          // Get questions for the battle subject
          const lessons = getLessonsBySubject(data.battle.subject);
          const allQuestions = lessons[0]?.questions || []; // Use first lesson
          setQuestions(allQuestions);
          setQuestionStartTime(Date.now());
        }
      }
    } catch (error) {
      console.error('Error fetching battle state:', error);
    }
  };

  useEffect(() => {
    fetchBattleState();
    const interval = setInterval(fetchBattleState, 2000);
    return () => clearInterval(interval);
  }, [battleId]);

  const handleReady = async () => {
    try {
      playSound('click');
      await fetch(`${serverUrl}/battle/${battleId}/ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId })
      });
      setIsReady(true);
      playSound('success');
    } catch (error) {
      console.error('Error setting ready:', error);
    }
  };

  const handleAnswer = async (index: number) => {
    if (showFeedback || !battleState) return;

    const responseTime = Date.now() - questionStartTime;
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Submit answer to server
    try {
      await fetch(`${serverUrl}/battle/${battleId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId,
          correct,
          responseTime
        })
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      // Battle complete
      if (battleState) {
        const myScore = battleState.players.find(p => p.userId === userId)?.score || 0;
        const opponentScore = battleState.players.find(p => p.userId !== userId)?.score || 0;
        const won = myScore > opponentScore;
        
        playSound('success');
        onComplete(won ? 100 : 50, won);
      }
    }
  };

  const getAvatarEmoji = (avatar: string) => {
    const avatarMap: { [key: string]: string } = {
      'rocket': '🚀',
      'unicorn': '🦄',
      'dinosaur': '🦕',
      'superhero': '🦸',
      'cat': '🐱',
      'robot': '🤖',
      'panda': '🐼',
      'star': '⭐'
    };
    return avatarMap[avatar] || '😊';
  };

  if (!battleState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 p-4 flex items-center justify-center">
        <Card className="p-8 rounded-3xl shadow-lg border-0 bg-white text-center">
          <div className="animate-pulse">
            <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <p className="text-purple-700">Loading battle...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Waiting room
  if (battleState.status === 'waiting' || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => {
                playSound('click');
                onNavigate('community');
              }}
              className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-purple-700">Quiz Battle</h2>
            <div className="w-10"></div>
          </div>

          <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white text-center mb-6">
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-purple-700 mb-2">Battle Arena</h3>
            <p className="text-purple-600 mb-6">
              {battleState.subject.charAt(0).toUpperCase() + battleState.subject.slice(1)} Challenge
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {battleState.players.map((player) => (
                <div key={player.userId} className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl">
                  <div className="text-4xl mb-2">{getAvatarEmoji(player.avatar)}</div>
                  <p className="text-purple-700">{player.name}</p>
                  {player.ready && (
                    <div className="mt-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
              {battleState.players.length === 1 && (
                <div className="bg-gray-100 p-4 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">Waiting for opponent...</p>
                </div>
              )}
            </div>

            {battleState.players.length === 2 && !isReady && (
              <Button
                onClick={handleReady}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-2xl text-white shadow-lg"
              >
                I'm Ready!
              </Button>
            )}

            {battleState.players.length === 1 && (
              <p className="text-gray-600">Waiting for another player to join...</p>
            )}

            {battleState.players.length === 2 && isReady && (
              <p className="text-purple-600">Waiting for opponent to be ready...</p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // Active battle
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 p-4 flex items-center justify-center">
        <Card className="p-8 rounded-3xl shadow-lg border-0 bg-white text-center">
          <p className="text-purple-700">Loading questions...</p>
        </Card>
      </div>
    );
  }

  const progress_value = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const myPlayer = battleState.players.find(p => p.userId === userId);
  const opponent = battleState.players.find(p => p.userId !== userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-red-200 to-pink-200 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => {
              playSound('click');
              onNavigate('community');
            }}
            className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 mx-4">
            <Progress value={progress_value} className="h-3 bg-white" />
          </div>

          <div className="text-purple-700">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* Player Scores */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3 rounded-2xl shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{getAvatarEmoji(myPlayer?.avatar || '')}</div>
              <div className="flex-1">
                <p className="text-white">You</p>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>{myPlayer?.score || 0} pts</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-3 rounded-2xl shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{getAvatarEmoji(opponent?.avatar || '')}</div>
              <div className="flex-1">
                <p className="text-white">{opponent?.name || 'Opponent'}</p>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>{opponent?.score || 0} pts</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl mb-4">
              <span className="text-5xl">{currentQ.emoji}</span>
            </div>
            <h2 className="text-purple-700 mb-2">{currentQ.question}</h2>
            <p className="text-purple-500">Choose the correct answer</p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((option: string, index: number) => {
              let buttonClass = "h-20 rounded-2xl border-4 transition-all ";

              if (showFeedback && index === selectedAnswer) {
                buttonClass += isCorrect
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-red-100 border-red-500 text-red-700";
              } else if (showFeedback && index === currentQ.correct) {
                buttonClass += "bg-green-100 border-green-500 text-green-700";
              } else {
                buttonClass += "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100 text-purple-700";
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={buttonClass}
                  disabled={showFeedback}
                >
                  <span className="flex items-center gap-2">
                    {option}
                    {showFeedback && index === selectedAnswer && (
                      isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                    )}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-2xl mb-6 ${isCorrect ? 'bg-green-100' : 'bg-orange-100'}`}>
              <p className={`text-center ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                {isCorrect ? '🎉 Awesome! You got it right!' : '💪 Keep trying! You\'ll get it next time!'}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button
              onClick={handleNext}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-2xl text-white shadow-lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
