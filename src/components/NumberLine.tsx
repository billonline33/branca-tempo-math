import React from "react";
import { motion } from "framer-motion";

interface NumberLineProps {
  numbers: number[];
  highlightedIndex?: number;
  patternStep?: number;
  showPattern?: boolean;
  onNumberClick?: (number: number, index: number) => void;
}

const NumberLine: React.FC<NumberLineProps> = ({
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  highlightedIndex = -1,
  patternStep = 1,
  showPattern = false,
  onNumberClick = () => {},
}) => {
  // Determine if a number crosses a decade or hundred boundary
  const isBoundary = (num: number, prevNum: number) => {
    const crossesDecade = Math.floor(num / 10) !== Math.floor(prevNum / 10);
    const crossesHundred = Math.floor(num / 100) !== Math.floor(prevNum / 100);
    return { crossesDecade, crossesHundred };
  };

  // Get color for a number based on pattern and boundaries
  const getNumberColor = (num: number, index: number) => {
    if (index === highlightedIndex) return "bg-yellow-300";
    if (showPattern && index % patternStep === 0) return "bg-blue-200";
    return "bg-white";
  };

  // Get border color for boundary crossings
  const getBorderColor = (num: number, index: number) => {
    if (index === 0) return "";
    const prevNum = numbers[index - 1];
    const { crossesDecade, crossesHundred } = isBoundary(num, prevNum);

    if (crossesHundred) return "border-red-500 border-4";
    if (crossesDecade) return "border-purple-500 border-2";
    return "border-gray-200";
  };

  return (
    <div className="w-full p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-md">
      <div className="relative">
        {/* The number line itself */}
        <div className="h-2 bg-gray-400 rounded-full my-8 relative">
          {/* Tick marks */}
          {numbers.map((_, index) => (
            <div
              key={`tick-${index}`}
              className="absolute w-0.5 h-3 bg-gray-600"
              style={{
                left: `${(index / (numbers.length - 1)) * 100}%`,
                top: "-4px",
              }}
            />
          ))}
        </div>

        {/* Numbers */}
        <div className="flex justify-between mt-2">
          {numbers.map((num, index) => (
            <motion.div
              key={`number-${index}`}
              className={`flex flex-col items-center cursor-pointer`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNumberClick(num, index)}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border ${getBorderColor(num, index)} ${getNumberColor(num, index)}`}
                animate={{
                  scale: highlightedIndex === index ? [1, 1.2, 1] : 1,
                  transition: { duration: 0.5 },
                }}
              >
                <span className="text-lg font-bold">{num}</span>
              </motion.div>

              {/* Pattern indicator */}
              {showPattern && index % patternStep === 0 && (
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}

              {/* Boundary indicators */}
              {index > 0 && (
                <>
                  {isBoundary(num, numbers[index - 1]).crossesDecade && (
                    <span className="text-xs text-purple-600 font-semibold mt-1">
                      decade
                    </span>
                  )}
                  {isBoundary(num, numbers[index - 1]).crossesHundred && (
                    <span className="text-xs text-red-600 font-bold mt-1">
                      hundred
                    </span>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
          <span>Pattern</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-purple-500 rounded-full"></div>
          <span>Decade Cross</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-4 border-red-500 rounded-full"></div>
          <span>Hundred Cross</span>
        </div>
      </div>
    </div>
  );
};

export default NumberLine;
