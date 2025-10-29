// src/components/LessonScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Heart, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { playSound } from '../utils/sounds';
import { getLessonsBySubject } from '../utils/lessonData';
import { NavigateFn } from '../types/navigation';

interface LessonScreenProps {
  onNavigate: NavigateFn;
  onComplete: (earnedStars: number, correctAnswers: number, totalQuestions: number) => void;
  subject: string;
}

export function LessonScreen({ onNavigate, onComplete, subject }: LessonScreenProps) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLessonSelect, setShowLessonSelect] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const availableLessons = getLessonsBySubject(subject) || [];
    setLessons(availableLessons);
    // reset view when subject changes
    setLessonIndex(0);
    setShowLessonSelect(true);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [subject]);

  const selectLesson = (index: number) => {
    playSound('click');
    setLessonIndex(index);
    setShowLessonSelect(false);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  if (showLessonSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => {
                playSound('click');
                onNavigate('home');
              }}
              className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-purple-700">
              {subject.charAt(0).toUpperCase() + subject.slice(1)} Lessons
            </h2>
            <div className="w-10" />
          </div>

          <div className="space-y-4">
            {lessons.length === 0 && (
              <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
                <div className="text-center text-gray-600">No lessons available for this subject yet.</div>
              </Card>
            )}

            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id ?? index}
                className="p-6 rounded-3xl shadow-lg border-0 bg-white hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => selectLesson(index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-800">{lesson.title}</h3>
                      <p className="text-gray-500">{(lesson.questions || []).length} questions</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      lesson.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : lesson.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }
                  >
                    {lesson.difficulty}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const questions = lessons[lessonIndex]?.questions || [];

  // safety: if there are no questions, go back to lesson select
  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 rounded-3xl shadow-lg">
          <div className="text-center">
            <p className="mb-4">This lesson has no questions.</p>
            <Button
              onClick={() => {
                playSound('click');
                setShowLessonSelect(true);
              }}
            >
              Back to lessons
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

// Safety check
  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 rounded-3xl shadow-lg">
          <div className="text-center">
            <p className="mb-4">This lesson has no valid question.</p>
            <Button
              onClick={() => {
                playSound('click');
                setShowLessonSelect(true);
              }}
            >
              Back to lessons
            </Button>
          </div>
        </Card>
      </div>
    );
  }


  const handleAnswer = (index: number) => {
    if (showFeedback) return;

    setSelectedAnswer(index);
    const correct = index === currentQ.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSound('correct');
      setCorrectAnswers(prev => prev + 1);
    } else {
      playSound('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    playSound('click');

    // move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      // Calculate stars based on correct answers (0 - 3)
      const total = questions.length;
      const pct = total > 0 ? (correctAnswers / total) * 100 : 0;
      let earnedStars = 0;
      if (pct >= 90) earnedStars = 3;
      else if (pct >= 70) earnedStars = 2;
      else if (pct >= 50) earnedStars = 1;
      else earnedStars = 0;

      playSound('success');
      onComplete(earnedStars, correctAnswers, total);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => {
              playSound('click');
              onNavigate('home');
            }}
            className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-3 bg-white" />
          </div>

          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center mb-4">
          <div className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-purple-700">{correctAnswers} correct</span>
          </div>
          <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
            <span className="text-purple-700">Question {currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl mb-4">
              <span className="text-5xl">{currentQ.emoji ?? '❓'}</span>
            </div>
            <h2 className="text-purple-700 mb-2">{currentQ.question}</h2>
            <p className="text-purple-500">Choose the correct answer</p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((option: string, index: number) => {
              let buttonClass = 'h-20 rounded-2xl border-4 transition-all ';

              if (showFeedback && index === selectedAnswer) {
                buttonClass += isCorrect
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-red-100 border-red-500 text-red-700';
              } else if (showFeedback && index === currentQ.correct) {
                buttonClass += 'bg-green-100 border-green-500 text-green-700';
              } else {
                buttonClass += 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100 text-purple-700';
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
                    {showFeedback && index === selectedAnswer && (isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-2xl mb-6 ${isCorrect ? 'bg-green-100' : 'bg-orange-100'}`}>
              <p className={`text-center ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                {isCorrect ? '🎉 Awesome! You got it right!' : "💪 Keep trying! You'll get it next time!"}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button
              onClick={handleNext}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white shadow-lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
