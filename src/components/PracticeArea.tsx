import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, HelpCircle, Check, X } from "lucide-react";
import NumberLine from "./NumberLine";

interface PracticeAreaProps {
  onComplete?: (score: number, total: number) => void;
  onEarnCoin?: () => void;
}

const PracticeArea = ({
  onComplete = () => {},
  onEarnCoin = () => {},
}: PracticeAreaProps) => {
  const [practiceMode, setPracticeMode] = useState<"pattern" | "crossing">(
    "pattern",
  );
  const [patternType, setPatternType] = useState<"1" | "2" | "3" | "5" | "10">(
    "1",
  );
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [startNumber, setStartNumber] = useState<number>(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [isExerciseActive, setIsExerciseActive] = useState<boolean>(false);
  const [crossingType, setCrossingType] = useState<"decade" | "hundred">(
    "decade",
  );
  const [numberOfNumbers, setNumberOfNumbers] = useState<number>(40);
  const [showPrincessAnimation, setShowPrincessAnimation] =
    useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate sequence based on selected options
  const generateSequence = () => {
    let newSequence: number[] = [];
    const step = parseInt(patternType);
    const count = numberOfNumbers; // Number of items in sequence

    if (practiceMode === "pattern") {
      for (let i = 0; i < count; i++) {
        if (direction === "forward") {
          newSequence.push(startNumber + i * step);
        } else {
          newSequence.push(startNumber - i * step);
        }
      }
    } else if (practiceMode === "crossing") {
      // For decade/hundred crossing practice
      const crossingPoint = crossingType === "decade" ? 10 : 100;
      let current = startNumber;

      // Ensure we cross at least one decade/hundred boundary
      for (let i = 0; i < count; i++) {
        newSequence.push(current);
        if (direction === "forward") {
          current += step;
        } else {
          current -= step;
        }
      }
    }

    setSequence(newSequence);
    setUserAnswers(Array(count).fill(null));
    setCurrentIndex(0);
    setShowHint(false);
    setFeedback("");
    setUserInput("");
    setIsExerciseActive(true);
  };

  // Create audio element for "Well done Bianca" sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createWellDoneSound = () => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.1,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);

      // Add a second higher note for celebration
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5 note
        oscillator2.type = "sine";

        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(
          0.3,
          audioContext.currentTime + 0.1,
        );
        gainNode2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1,
        );

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 1);
      }, 200);
    };

    setAudioElement({ play: createWellDoneSound } as any);
  }, []);

  // Handle user input for answers
  const handleAnswerSubmit = () => {
    if (!userInput || currentIndex >= sequence.length) return;

    const userAnswer = parseInt(userInput);
    const isCorrect = userAnswer === sequence[currentIndex];

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentIndex] = userAnswer;
    setUserAnswers(newUserAnswers);

    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowPrincessAnimation(true);

      // Award a golden coin for correct answer
      onEarnCoin();

      // Play "Well done Bianca" sound
      if (audioElement) {
        audioElement.play();
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setUserInput("");
        setFeedback("");
        setShowPrincessAnimation(false);
        // Focus the input box after animation completes
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 2500);
    }

    setTotalQuestions((prev) => prev + 1);
  };

  // Reset the exercise
  const resetExercise = () => {
    setIsExerciseActive(false);
    setUserAnswers(Array(sequence.length).fill(null));
    setCurrentIndex(0);
    setShowHint(false);
    setFeedback("");
    setUserInput("");
  };

  // Check if exercise is complete
  useEffect(() => {
    if (isExerciseActive && currentIndex >= sequence.length) {
      onComplete(score, totalQuestions);
      resetExercise();
    }
  }, [
    currentIndex,
    isExerciseActive,
    onComplete,
    score,
    sequence.length,
    totalQuestions,
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <Tabs
        value={practiceMode}
        onValueChange={(value) =>
          setPracticeMode(value as "pattern" | "crossing")
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pattern" className="text-lg py-3">
            Number Pattern Generator
          </TabsTrigger>
          <TabsTrigger value="crossing" className="text-lg py-3">
            Decade/Hundred Crossing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pattern" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Count by:</h3>
              <Select
                value={patternType}
                onValueChange={(value) =>
                  setPatternType(value as "2" | "3" | "5" | "10")
                }
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="2">2s</SelectItem>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Starting Number:</h3>
              <Input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 0)}
                className="text-lg h-12"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Direction:</h3>
              <Select
                value={direction}
                onValueChange={(value) =>
                  setDirection(value as "forward" | "backward")
                }
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forward">
                    Forward {<ArrowRight className="inline ml-2" />}
                  </SelectItem>
                  <SelectItem value="backward">
                    Backward {<ArrowLeft className="inline ml-2" />}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generateSequence} className="w-full text-lg py-6">
            Generate Number Pattern
          </Button>
        </TabsContent>

        <TabsContent value="crossing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Crossing Type:</h3>
              <Select
                value={crossingType}
                onValueChange={(value) =>
                  setCrossingType(value as "decade" | "hundred")
                }
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select crossing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decade">Decade Crossing</SelectItem>
                  <SelectItem value="hundred">Hundred Crossing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Count by:</h3>
              <Select
                value={patternType}
                onValueChange={(value) =>
                  setPatternType(value as "2" | "3" | "5" | "10")
                }
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1s</SelectItem>
                  <SelectItem value="2">2s</SelectItem>
                  <SelectItem value="3">3s</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Direction:</h3>
              <Select
                value={direction}
                onValueChange={(value) =>
                  setDirection(value as "forward" | "backward")
                }
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forward">
                    Forward {<ArrowRight className="inline ml-2" />}
                  </SelectItem>
                  <SelectItem value="backward">
                    Backward {<ArrowLeft className="inline ml-2" />}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Starting Number:</h3>
            <Input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 0)}
              className="text-lg h-12"
            />
          </div>

          <Button onClick={generateSequence} className="w-full text-lg py-6">
            Generate Crossing Challenge
          </Button>
        </TabsContent>
      </Tabs>

      {isExerciseActive && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {practiceMode === "pattern"
                  ? "Number Pattern Practice"
                  : `${crossingType.charAt(0).toUpperCase() + crossingType.slice(1)} Crossing Practice`}
              </h2>
              <p className="text-lg">
                {direction === "forward"
                  ? "Counting forward"
                  : "Counting backward"}{" "}
                by {patternType}s
                {practiceMode === "pattern"
                  ? ` starting from ${startNumber}`
                  : ``}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 flex items-center justify-center text-xl font-bold rounded-lg border-2 ${index === currentIndex ? "border-blue-500 bg-blue-50" : "border-gray-300"} ${index < currentIndex ? "bg-green-100" : ""}`}
                >
                  {index < currentIndex
                    ? num
                    : index === currentIndex
                      ? "?"
                      : ""}
                </div>
              ))}
            </div>

            {currentIndex < sequence.length && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your answer"
                    className="text-xl h-14 text-center w-32"
                    autoFocus
                  />
                  <Button
                    onClick={handleAnswerSubmit}
                    className="h-14 px-8 text-lg"
                  >
                    Check
                  </Button>
                </div>

                {feedback && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center justify-center p-4 rounded-lg ${feedback === "correct" ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {feedback === "correct" ? (
                      <>
                        <Check className="text-green-600 mr-2" size={24} />
                        <span className="text-xl font-medium text-green-600">
                          Correct! Great job!
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="text-red-600 mr-2" size={24} />
                        <span className="text-xl font-medium text-red-600">
                          Try again!
                        </span>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Princess Animation */}
                {showPrincessAnimation && (
                  <motion.div
                    initial={{ scale: 0, y: 50, opacity: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      y: [50, -10, 0],
                      opacity: 1,
                      rotate: [0, -5, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      times: [0, 0.3, 1],
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                  >
                    <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full p-8 shadow-2xl">
                      <div className="text-8xl animate-bounce">👸</div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-center mt-4"
                      >
                        <div className="text-2xl font-bold text-white mb-2">
                          ✨ WELL DONE BIANCA! ✨
                        </div>
                        <div className="text-lg text-pink-100 mb-2">
                          You're a math princess! 👑
                        </div>
                        <div className="text-xl text-yellow-200 font-bold">
                          🪙 +1 Golden Coin!
                        </div>
                      </motion.div>
                    </div>

                    {/* Sparkle effects */}
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                      className="absolute top-1/4 left-1/4 text-4xl"
                    >
                      ✨
                    </motion.div>
                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                      className="absolute top-1/3 right-1/4 text-3xl"
                    >
                      🌟
                    </motion.div>
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                      className="absolute bottom-1/3 left-1/3 text-3xl"
                    >
                      💫
                    </motion.div>
                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: [1, 1.4, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                      className="absolute bottom-1/4 right-1/3 text-4xl"
                    >
                      ⭐
                    </motion.div>
                  </motion.div>
                )}

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle size={18} />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>

                {showHint && (
                  <div className="mt-4">
                    <NumberLine
                      sequence={sequence}
                      currentIndex={currentIndex}
                      patternType={parseInt(patternType)}
                      direction={direction}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PracticeArea;
