import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { Quiz, Question } from '../types/course';

interface LessonQuizProps {
  quiz: Quiz;
  onQuizComplete: (score: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ quiz, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    setShowResults(true);
    onQuizComplete(score);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
  };

  if (quiz.completed && !quizStarted) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-success-100 rounded-full">
              <Award className="text-success-600\" size={24} />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-4">
            Quiz completed with a score of <span className="font-semibold text-success-600">{quiz.score}%</span>
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-4">
            Test your knowledge with {quiz.questions.length} questions. 
            You need {quiz.passingScore}% to pass.
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${passed ? 'bg-success-100' : 'bg-red-100'}`}>
              {passed ? (
                <CheckCircle className="text-success-600\" size={32} />
              ) : (
                <XCircle className="text-red-600" size={32} />
              )}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h3>
          <p className="text-gray-600 mb-4">
            You scored <span className={`font-semibold ${passed ? 'text-success-600' : 'text-red-600'}`}>
              {score}%
            </span> ({correctAnswers}/{quiz.questions.length} correct)
          </p>
          {!passed && (
            <p className="text-sm text-gray-500 mb-4">
              You need {quiz.passingScore}% to pass. Review the lesson and try again.
            </p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="text-success-500 mt-1\" size={20} />
                  ) : (
                    <XCircle className="text-red-500 mt-1" size={20} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                    <p className="text-sm text-gray-600">
                      Your answer: <span className={isCorrect ? 'text-success-600' : 'text-red-600'}>
                        {question.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-success-600">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-sm text-gray-500 mt-2 italic">{question.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h4>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};