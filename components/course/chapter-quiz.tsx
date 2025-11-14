"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateChapterQuiz, submitQuizAnswers } from "@/actions/course";
import { Loader2, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ChapterQuizProps {
  courseId: string;
  chapterId: string;
  chapterTitle: string;
}

export function ChapterQuiz({
  courseId,
  chapterId,
  chapterTitle,
}: ChapterQuizProps) {
  const [quizState, setQuizState] = useState<
    "idle" | "generating" | "taking" | "completed"
  >("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [examId, setExamId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    setQuizState("generating");
    setError("");

    try {
      const result = await generateChapterQuiz(courseId, chapterId);

      if (result.error) {
        setError(result.error);
        setQuizState("idle");
        return;
      }

      if ("examId" in result && "questions" in result && result.examId && result.questions) {
        setExamId(result.examId);
        setQuestions(result.questions);
        setAnswers(new Array(result.questions.length).fill(null));
        setQuizState("taking");
      }
    } catch (error) {
      setError("Failed to generate quiz. Please try again.");
      setQuizState("idle");
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (!examId || answers.some((a) => a === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitQuizAnswers(
        examId,
        answers as number[]
      );

      if (result.error) {
        setError(result.error);
      } else if ("score" in result && result.score !== undefined) {
        setScore(result.score);
        setQuizState("completed");
        setShowResults(true);
      }
    } catch (error) {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setQuizState("idle");
    setQuestions([]);
    setAnswers([]);
    setExamId(null);
    setScore(null);
    setShowResults(false);
    setError("");
  };

  if (quizState === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chapter Quiz</CardTitle>
          <CardDescription>
            Test your knowledge of {chapterTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-4">
            Generate a 5-question quiz to test your understanding of this
            chapter. The AI will create questions based on the chapter topics.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerateQuiz}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Generate Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (quizState === "generating") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Generating quiz questions using AI...
            <br />
            This may take 30-60 seconds.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "completed" && showResults) {
    const percentage = score || 0;
    const passed = percentage >= 70;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy
              className={cn(
                "h-6 w-6",
                passed ? "text-green-500" : "text-orange-500"
              )}
            />
            Quiz Results
          </CardTitle>
          <CardDescription>Chapter: {chapterTitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center py-8">
            <div
              className={cn(
                "text-6xl font-bold mb-2",
                passed ? "text-green-500" : "text-orange-500"
              )}
            >
              {percentage}%
            </div>
            <p className="text-lg text-muted-foreground">
              {passed ? "Great job!" : "Keep practicing!"}
            </p>
          </div>

          {/* Answer Review */}
          <div className="space-y-4">
            <h3 className="font-semibold">Answer Review:</h3>
            {questions.map((question, qIndex) => {
              const userAnswer = answers[qIndex];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <Card
                  key={qIndex}
                  className={cn(
                    "border-2",
                    isCorrect ? "border-green-500/50" : "border-red-500/50"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span>
                        Question {qIndex + 1}: {question.question}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={cn(
                            "p-2 rounded text-sm",
                            oIndex === question.correctAnswer &&
                              "bg-green-500/10 border border-green-500/20",
                            oIndex === userAnswer &&
                              oIndex !== question.correctAnswer &&
                              "bg-red-500/10 border border-red-500/20"
                          )}
                        >
                          {option}
                          {oIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-500 font-medium">
                              ✓ Correct
                            </span>
                          )}
                          {oIndex === userAnswer &&
                            oIndex !== question.correctAnswer && (
                              <span className="ml-2 text-red-500 font-medium">
                                Your answer
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleRetry} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Taking quiz state
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz: {chapterTitle}</CardTitle>
        <CardDescription>
          Answer all questions and submit to see your score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {answers.filter((a) => a !== null).length} of{" "}
            {questions.length} answered
          </span>
          <span>
            {Math.round(
              (answers.filter((a) => a !== null).length / questions.length) *
                100
            )}
            % complete
          </span>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="border-2">
              <CardHeader>
                <CardTitle className="text-base">
                  Question {qIndex + 1}: {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50",
                      answers[qIndex] === oIndex
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          answers[qIndex] === oIndex
                            ? "border-primary bg-primary"
                            : "border-border"
                        )}
                      >
                        {answers[qIndex] === oIndex && (
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm">{option}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmitQuiz}
            disabled={
              isSubmitting || answers.some((a) => a === null)
            }
            size="lg"
            className="bg-gradient-to-r from-primary to-accent"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Quiz</>
            )}
          </Button>
        </div>

        {answers.some((a) => a === null) && (
          <p className="text-center text-sm text-muted-foreground">
            Please answer all questions before submitting
          </p>
        )}
      </CardContent>
    </Card>
  );
}
