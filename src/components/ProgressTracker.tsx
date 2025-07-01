import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Award, Trophy, TrendingUp } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: "star" | "badge" | "trophy";
  color: string;
  earned: boolean;
  date?: string;
}

interface ProgressStats {
  category: string;
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressTrackerProps {
  achievements?: Achievement[];
  stats?: ProgressStats[];
}

const ProgressTracker = ({
  achievements = [
    {
      id: "1",
      title: "Counting by 2s",
      description: "Completed 5 exercises counting by 2s",
      type: "star",
      color: "bg-yellow-400",
      earned: true,
      date: "2023-06-15",
    },
    {
      id: "2",
      title: "Counting by 5s",
      description: "Completed 5 exercises counting by 5s",
      type: "star",
      color: "bg-blue-400",
      earned: true,
      date: "2023-06-16",
    },
    {
      id: "3",
      title: "Counting by 10s",
      description: "Completed 5 exercises counting by 10s",
      type: "badge",
      color: "bg-purple-400",
      earned: true,
      date: "2023-06-17",
    },
    {
      id: "4",
      title: "Decade Master",
      description: "Successfully crossed decades 10 times",
      type: "badge",
      color: "bg-green-400",
      earned: false,
    },
    {
      id: "5",
      title: "Hundred Hero",
      description: "Successfully crossed hundreds 5 times",
      type: "trophy",
      color: "bg-pink-400",
      earned: false,
    },
  ],
  stats = [
    {
      category: "Counting by 2s",
      completed: 15,
      total: 20,
      percentage: 75,
    },
    {
      category: "Counting by 3s",
      completed: 8,
      total: 20,
      percentage: 40,
    },
    {
      category: "Counting by 5s",
      completed: 12,
      total: 20,
      percentage: 60,
    },
    {
      category: "Counting by 10s",
      completed: 18,
      total: 20,
      percentage: 90,
    },
    {
      category: "Decade Crossing",
      completed: 5,
      total: 10,
      percentage: 50,
    },
    {
      category: "Hundred Crossing",
      completed: 2,
      total: 5,
      percentage: 40,
    },
  ],
}: ProgressTrackerProps) => {
  const [activeTab, setActiveTab] = useState("achievements");

  const renderAchievementIcon = (type: string, color: string) => {
    switch (type) {
      case "star":
        return <Star className="h-8 w-8 text-yellow-500" />;
      case "badge":
        return <Award className="h-8 w-8 text-blue-500" />;
      case "trophy":
        return <Trophy className="h-8 w-8 text-purple-500" />;
      default:
        return <Star className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border-2 border-primary">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-center text-2xl font-bold">
          Bianca's Progress
        </CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements" className="text-lg font-medium">
            <Award className="mr-2 h-4 w-4" /> Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-lg font-medium">
            <TrendingUp className="mr-2 h-4 w-4" /> Stats
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-4">
          <TabsContent value="achievements" className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center p-3 rounded-lg border-2 ${achievement.earned ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"}`}
                >
                  <div
                    className={`p-2 rounded-full ${achievement.color} mr-3 flex items-center justify-center`}
                  >
                    {renderAchievementIcon(achievement.type, achievement.color)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-green-600 mt-1">
                        Earned on {achievement.date}
                      </p>
                    )}
                  </div>
                  {achievement.earned ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Earned
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-500 border-gray-300"
                    >
                      Not Yet
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-2">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{stat.category}</h3>
                  <span className="text-sm text-gray-500">
                    {stat.completed}/{stat.total} completed
                  </span>
                </div>
                <Progress value={stat.percentage} className="h-3" />
                <p className="text-xs text-right text-gray-500">
                  {stat.percentage}% complete
                </p>
              </div>
            ))}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ProgressTracker;
