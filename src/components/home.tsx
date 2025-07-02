import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PracticeArea from "./PracticeArea";
import ProgressTracker from "./ProgressTracker";
import { motion } from "framer-motion";
import { Coins, Settings } from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("number-patterns");
  const [coins, setCoins] = useState(0);
  const [eggs, setEggs] = useState(0);
  const [parentMode, setParentMode] = useState(false);
  const [tempCoins, setTempCoins] = useState(0);
  const [tempEggs, setTempEggs] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");

  // Load saved coins and eggs from localStorage
  useEffect(() => {
    const savedCoins = localStorage.getItem("bianca-coins");
    const savedEggs = localStorage.getItem("bianca-eggs");
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedEggs) setEggs(parseInt(savedEggs));
  }, []);

  // Save coins and eggs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bianca-coins", coins.toString());
    localStorage.setItem("bianca-eggs", eggs.toString());
  }, [coins, eggs]);

  // Handle earning a coin and automatic conversion to eggs
  const handleEarnCoin = () => {
    setCoins((prevCoins) => {
      const newCoins = prevCoins + 1;
      if (newCoins >= 10) {
        setEggs((prevEggs) => prevEggs + Math.floor(newCoins / 10));
        return newCoins % 10;
      }
      return newCoins;
    });
  };

  // Handle parent updates
  const handleParentUpdate = () => {
    setCoins(tempCoins);
    setEggs(tempEggs);
    setParentMode(false);
  };

  // Handle password verification
  const handlePasswordSubmit = () => {
    if (password === "7527") {
      setTempCoins(coins);
      setTempEggs(eggs);
      setParentMode(true);
      setShowPasswordDialog(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  // Open password dialog
  const openPasswordDialog = () => {
    setShowPasswordDialog(true);
  };

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

        {/* Reward Display */}
        <motion.div
          className="flex justify-center items-center gap-6 mt-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl p-4 max-w-md mx-auto border-2 border-yellow-300 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="text-3xl">🪙</div>
            <div className="text-xl font-bold text-yellow-700">{coins}</div>
            <div className="text-sm text-yellow-600">Golden Coins</div>
          </div>
          <div className="w-px h-8 bg-yellow-400"></div>
          <div className="flex items-center gap-2">
            <div className="text-3xl">🥚</div>
            <div className="text-xl font-bold text-orange-700">{eggs}</div>
            <div className="text-sm text-orange-600">Golden Eggs</div>
          </div>

          {/* Parent Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white border border-yellow-300"
            onClick={openPasswordDialog}
          >
            <Settings className="h-4 w-4 text-yellow-700" />
          </Button>

          {/* Password Dialog */}
          <Dialog
            open={showPasswordDialog}
            onOpenChange={setShowPasswordDialog}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-purple-600">
                  Enter Parent Password
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePasswordSubmit()
                    }
                    className="w-full"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handlePasswordSubmit}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setPassword("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Parent Settings Dialog */}
          <Dialog open={parentMode} onOpenChange={setParentMode}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-purple-600">
                  Parent Settings
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Golden Coins
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={tempCoins}
                    onChange={(e) =>
                      setTempCoins(parseInt(e.target.value) || 0)
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Golden Eggs
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={tempEggs}
                    onChange={(e) => setTempEggs(parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleParentUpdate}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Update Rewards
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
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
                  <PracticeArea onEarnCoin={handleEarnCoin} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crossing-practice" className="mt-0">
              <Card className="border-4 border-green-300 bg-green-50 shadow-xl">
                <CardContent className="p-6">
                  <PracticeArea onEarnCoin={handleEarnCoin} />
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
