import { useState, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { playSound } from '../utils/sounds';
import { ChildProgress } from '../utils/progressManager';
import { getLessonsBySubject } from '../utils/lessonData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StudySessionProps {
  onNavigate: (screen: string) => void;
  onComplete: (earnedStars: number) => void;
  sessionId: string;
  progress: ChildProgress;
}

interface SessionState {
  id: string;
  hostId: string;
  hostName: string;
  subject: string;
  maxParticipants: number;
  participants: Array<{
    userId: string;
    name: string;
  }>;
  status: string;
  createdAt: number;
}

export function StudySession({ onNavigate, onComplete, sessionId, progress }: StudySessionProps) {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const userId = `user-${progress.name.toLowerCase().replace(/\s+/g, '-')}`;
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-78a36db3`;

  // Fetch session state
  const fetchSessionState = async () => {
    try {
      const res = await fetch(`${serverUrl}/study-sessions`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      const session = data.sessions?.find((s: any) => s.id === sessionId);
      
      if (session) {
        setSessionState(session);
      }
    } catch (error) {
      console.error('Error fetching session state:', error);
    }
  };

  useEffect(() => {
    fetchSessionState();
    const interval = setInterval(fetchSessionState, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (sessionState && !hasStarted) {
      // Get questions for the study session subject
      const lessons = getLessonsBySubject(sessionState.subject);
      const allQuestions = lessons[0]?.questions || []; // Use first lesson
      setQuestions(allQuestions);
    }
  }, [sessionState]);

  const handleStartStudying = () => {
    playSound('whoosh');
    setHasStarted(true);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;

    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSound('correct');
      setCorrectAnswers(correctAnswers + 1);
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Session complete
      const percentage = (correctAnswers / questions.length) * 100;
      let earnedStars = 0;

      if (percentage === 100) {
        earnedStars = 100;
      } else if (percentage >= 80) {
        earnedStars = 80;
      } else if (percentage >= 60) {
        earnedStars = 60;
      } else if (percentage >= 40) {
        earnedStars = 40;
      } else {
        earnedStars = 20;
      }

      playSound('success');
      onComplete(earnedStars);
    }
  };

  if (!sessionState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4 flex items-center justify-center">
        <Card className="p-8 rounded-3xl shadow-lg border-0 bg-white text-center">
          <div className="animate-pulse">
            <BookOpen className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-purple-700">Loading study session...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Waiting room / Study lobby
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
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
            <h2 className="text-purple-700">Study Session</h2>
            <div className="w-10"></div>
          </div>

          <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white text-center mb-6">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-purple-700 mb-2">{sessionState.hostName}'s Study Group</h3>
            <Badge className="bg-green-100 text-green-700 mb-6">
              {sessionState.subject.charAt(0).toUpperCase() + sessionState.subject.slice(1)}
            </Badge>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-6 h-6 text-green-600" />
                <h4 className="text-green-700">Participants ({sessionState.participants.length}/{sessionState.maxParticipants})</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sessionState.participants.map((participant, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl">
                    <p className="text-purple-700">{participant.name}</p>
                  </div>
                ))}
                {sessionState.participants.length < sessionState.maxParticipants && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Open slot</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl mb-6">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-700">Study together and help each other learn!</p>
            </div>

            <Button
              onClick={handleStartStudying}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-2xl text-white shadow-lg"
            >
              Start Studying
            </Button>
          </Card>

          <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-yellow-100 to-orange-100">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="text-orange-700 mb-1">Study Session Tips</h4>
                <p className="text-orange-600">Work through questions together and learn from each other!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Active study session
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4 flex items-center justify-center">
        <Card className="p-8 rounded-3xl shadow-lg border-0 bg-white text-center">
          <p className="text-purple-700">Loading questions...</p>
        </Card>
      </div>
    );
  }

  const progress_value = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
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

        {/* Session Info */}
        <Card className="p-3 rounded-2xl shadow-lg border-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-purple-700">{sessionState.participants.length} studying together</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-purple-700">{correctAnswers} correct</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl mb-4">
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
                {isCorrect ? '🎉 Great job! You got it right!' : '💪 Nice try! The correct answer is highlighted.'}
              </p>
              {currentQ.explanation && (
                <p className="text-center text-purple-600 mt-2">
                  💡 {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button
              onClick={handleNext}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-2xl text-white shadow-lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Session'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
