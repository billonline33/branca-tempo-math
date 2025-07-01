import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PracticeArea from "./PracticeArea";
import ProgressTracker from "./ProgressTracker";
import { motion } from "framer-motion";

const Home = () => {
  const [activeTab, setActiveTab] = useState("number-patterns");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 md:p-8">
      <motion.header
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
          Bianca Huang's Math Adventure
        </h1>
        <p className="text-lg text-blue-600">Fun with Number Patterns!</p>
      </motion.header>

      <div className="max-w-6xl mx-auto">
        <Tabs
          defaultValue="number-patterns"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8 bg-blue-200 p-1 rounded-xl">
            <TabsTrigger
              value="number-patterns"
              className="text-lg py-3 data-[state=active]:bg-yellow-200 data-[state=active]:text-purple-700"
            >
              Number Patterns
            </TabsTrigger>
            <TabsTrigger
              value="crossing-practice"
              className="text-lg py-3 data-[state=active]:bg-green-200 data-[state=active]:text-purple-700"
            >
              Decade/Hundred Crossing
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-lg py-3 data-[state=active]:bg-pink-200 data-[state=active]:text-purple-700"
            >
              My Progress
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            {/* Decorative math elements */}
            <motion.div
              className="absolute -top-16 -left-10 text-5xl text-blue-300 opacity-30 rotate-12"
              animate={{ rotate: [12, -5, 12], y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              +
            </motion.div>
            <motion.div
              className="absolute -bottom-10 -right-5 text-6xl text-purple-300 opacity-30 -rotate-12"
              animate={{ rotate: [-12, 5, -12], y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              ×
            </motion.div>
            <motion.div
              className="absolute top-1/2 -left-16 text-7xl text-green-300 opacity-30"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              −
            </motion.div>
            <motion.div
              className="absolute top-20 -right-12 text-5xl text-yellow-300 opacity-30 rotate-45"
              animate={{ rotate: [45, 30, 45], scale: [1, 1.1, 1] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              ÷
            </motion.div>

            <TabsContent value="number-patterns" className="mt-0">
              <Card className="border-4 border-yellow-300 bg-yellow-50 shadow-xl">
                <CardContent className="p-6">
                  <PracticeArea
                    mode="number-patterns"
                    title="Number Pattern Generator"
                    description="Practice counting in 2s, 3s, 5s, or 10s, starting from any number!"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crossing-practice" className="mt-0">
              <Card className="border-4 border-green-300 bg-green-50 shadow-xl">
                <CardContent className="p-6">
                  <PracticeArea
                    mode="crossing-practice"
                    title="Decade & Hundred Crossing Practice"
                    description="Master counting across decades and hundreds!"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="mt-0">
              <Card className="border-4 border-pink-300 bg-pink-50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="w-full md:w-2/3">
                      <h2 className="text-3xl font-bold text-purple-600 mb-4">
                        Your Achievements
                      </h2>
                      <p className="text-lg text-blue-600 mb-6">
                        Look at all the stars you've earned!
                      </p>
                      <ProgressTracker />
                    </div>
                    <div className="w-full md:w-1/3">
                      <motion.img
                        src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&q=80"
                        alt="Happy student"
                        className="rounded-full border-4 border-pink-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <footer className="text-center mt-12 text-purple-600 text-sm">
        <p>Created with ❤️ for Bianca</p>
      </footer>
    </div>
  );
};

export default Home;
