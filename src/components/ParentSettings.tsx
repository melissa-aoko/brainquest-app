import { ArrowLeft, Clock, Shield, BarChart3, Bell, User, Lock, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ParentSettingsProps {
  onNavigate: (screen: string) => void;
}

export function ParentSettings({ onNavigate }: ParentSettingsProps) {
  const childName = "Alex";
  
  const weeklyProgress = [
    { day: 'Mon', minutes: 25, lessons: 3 },
    { day: 'Tue', minutes: 30, lessons: 4 },
    { day: 'Wed', minutes: 20, lessons: 2 },
    { day: 'Thu', minutes: 35, lessons: 5 },
    { day: 'Fri', minutes: 28, lessons: 3 },
    { day: 'Sat', minutes: 15, lessons: 2 },
    { day: 'Sun', minutes: 22, lessons: 3 },
  ];

  const subjectProgress = [
    { name: 'Math', progress: 75, time: '2h 15m' },
    { name: 'Reading', progress: 85, time: '3h 30m' },
    { name: 'Science', progress: 60, time: '1h 45m' },
    { name: 'Art', progress: 90, time: '2h 50m' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={() => onNavigate('home')}
              className="bg-white/20 hover:bg-white/30 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-white">Parent Dashboard</h2>
            <div className="w-10"></div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758525861536-15fb8a3ee629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHN0dWR5aW5nJTIwdGFibGV0fGVufDF8fHx8MTc2MTI2OTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Child profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white">{childName}</h3>
              <p className="text-white/80">Age 8 • Grade 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 shadow-md">
            <TabsTrigger value="progress" className="rounded-xl">
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="controls" className="rounded-xl">
              <Shield className="w-4 h-4 mr-2" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="account" className="rounded-xl">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Weekly Activity */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <h3 className="text-purple-700 mb-4">This Week's Activity</h3>
              <div className="flex items-end justify-between gap-2 h-40 mb-4">
                {weeklyProgress.map((day, idx) => {
                  const maxMinutes = Math.max(...weeklyProgress.map(d => d.minutes));
                  const height = (day.minutes / maxMinutes) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-purple-600">{day.lessons}</div>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-xl transition-all hover:opacity-80"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-purple-500">{day.day}</div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-purple-700">195 min</div>
                  <div className="text-purple-500">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-700">22 lessons</div>
                  <div className="text-purple-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-700">7 days</div>
                  <div className="text-purple-500">Streak</div>
                </div>
              </div>
            </Card>

            {/* Subject Progress */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <h3 className="text-purple-700 mb-4">Subject Progress</h3>
              <div className="space-y-4">
                {subjectProgress.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-700">{subject.name}</span>
                      <span className="text-purple-500">{subject.time}</span>
                    </div>
                    <Progress value={subject.progress} className="h-3 bg-purple-100" />
                    <div className="text-right text-purple-500 mt-1">{subject.progress}%</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths & Recommendations */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-100 to-blue-100">
              <h3 className="text-green-700 mb-3">✨ Insights & Recommendations</h3>
              <div className="space-y-2">
                <p className="text-green-600">• {childName} is excelling in Art and Reading!</p>
                <p className="text-green-600">• Consider more Science practice to improve confidence</p>
                <p className="text-green-600">• Consistent daily usage - great job maintaining the streak!</p>
              </div>
            </Card>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            {/* Screen Time Limits */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-purple-700">Daily Time Limit</h3>
                  <p className="text-purple-500">Control screen time</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-600">Maximum: 60 minutes/day</span>
                  </div>
                  <Slider defaultValue={[60]} max={120} step={15} className="mb-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600">Enable time limit</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Safety Controls */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-purple-700">Safety & Privacy</h3>
                  <p className="text-purple-500">Keep learning safe</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-700">Ad-free experience</div>
                    <div className="text-purple-500">Premium feature</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-700">Restrict in-app purchases</div>
                    <div className="text-purple-500">Requires parent approval</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-700">Content filtering</div>
                    <div className="text-purple-500">Age-appropriate only</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-purple-700">Notifications</h3>
                  <p className="text-purple-500">Stay informed</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-600">Daily progress reports</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600">Achievement alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600">Weekly summary email</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Profile */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <h3 className="text-purple-700 mb-4">Child Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-purple-600 mb-2 block">Name</label>
                  <div className="px-4 py-3 bg-purple-50 rounded-xl text-purple-700">
                    {childName}
                  </div>
                </div>
                <div>
                  <label className="text-purple-600 mb-2 block">Age</label>
                  <div className="px-4 py-3 bg-purple-50 rounded-xl text-purple-700">
                    8 years old
                  </div>
                </div>
                <div>
                  <label className="text-purple-600 mb-2 block">Grade Level</label>
                  <div className="px-4 py-3 bg-purple-50 rounded-xl text-purple-700">
                    Grade 3
                  </div>
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white">
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Subscription */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">Premium Plan</h3>
                  <p className="text-white/80">Active until Dec 24, 2025</p>
                </div>
              </div>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-50 rounded-xl">
                Manage Subscription
              </Button>
            </Card>

            {/* Parent Email */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-700">Parent Email</h3>
                  <p className="text-purple-500">parent@example.com</p>
                </div>
                <Button variant="outline" className="rounded-xl">
                  Change
                </Button>
              </div>
            </Card>

            {/* Sign Out */}
            <Button 
              onClick={() => onNavigate('welcome')}
              className="w-full h-12 bg-red-500 hover:bg-red-600 rounded-xl text-white"
            >
              Sign Out
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
