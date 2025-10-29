import { ArrowLeft, Users, BookOpen, TrendingUp, Award, Download, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TeacherDashboardProps {
  onNavigate: (screen: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const classStats = {
    totalStudents: 24,
    activeToday: 18,
    averageProgress: 72,
    completedLessons: 156
  };

  const students = [
    { id: 1, name: 'Emma Wilson', progress: 85, lessonsCompleted: 12, streak: 7, level: 8 },
    { id: 2, name: 'Liam Johnson', progress: 92, lessonsCompleted: 15, streak: 10, level: 9 },
    { id: 3, name: 'Olivia Brown', progress: 68, lessonsCompleted: 8, streak: 3, level: 6 },
    { id: 4, name: 'Noah Davis', progress: 78, lessonsCompleted: 10, streak: 5, level: 7 },
    { id: 5, name: 'Ava Martinez', progress: 95, lessonsCompleted: 16, streak: 12, level: 10 },
    { id: 6, name: 'Ethan Garcia', progress: 61, lessonsCompleted: 7, streak: 2, level: 5 },
  ];

  const assignments = [
    { id: 1, title: 'Math: Addition & Subtraction', assigned: 24, completed: 18, due: '2 days' },
    { id: 2, title: 'Reading: Story Comprehension', assigned: 24, completed: 20, due: '5 days' },
    { id: 3, title: 'Science: Plants & Animals', assigned: 24, completed: 12, due: '1 week' },
  ];

  const subjects = [
    { name: 'Math', avgProgress: 75, color: 'from-blue-400 to-blue-600' },
    { name: 'Reading', avgProgress: 82, color: 'from-green-400 to-green-600' },
    { name: 'Science', avgProgress: 68, color: 'from-purple-400 to-purple-600' },
    { name: 'Art', avgProgress: 88, color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => onNavigate('welcome')}
              className="bg-white/20 hover:bg-white/30 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-white">Teacher Dashboard</h2>
            <Button className="bg-white/20 hover:bg-white/30 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div>
            <h3 className="text-white mb-1">Mrs. Johnson's Class</h3>
            <p className="text-white/80">Grade 3 • Room 205</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Class Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 rounded-3xl shadow-lg border-0 bg-white text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-700">{classStats.totalStudents}</div>
            <div className="text-purple-500">Students</div>
          </Card>

          <Card className="p-5 rounded-3xl shadow-lg border-0 bg-white text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-700">{classStats.activeToday}</div>
            <div className="text-purple-500">Active Today</div>
          </Card>

          <Card className="p-5 rounded-3xl shadow-lg border-0 bg-white text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-700">{classStats.completedLessons}</div>
            <div className="text-purple-500">Lessons Done</div>
          </Card>

          <Card className="p-5 rounded-3xl shadow-lg border-0 bg-white text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-purple-700">{classStats.averageProgress}%</div>
            <div className="text-purple-500">Avg Progress</div>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 shadow-md">
            <TabsTrigger value="students" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input 
                  placeholder="Search students..."
                  className="pl-10 h-12 rounded-xl border-2"
                />
              </div>
              <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>

            <Card className="rounded-3xl shadow-lg border-0 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-purple-700">Student</th>
                      <th className="px-6 py-4 text-center text-purple-700">Level</th>
                      <th className="px-6 py-4 text-center text-purple-700">Progress</th>
                      <th className="px-6 py-4 text-center text-purple-700">Lessons</th>
                      <th className="px-6 py-4 text-center text-purple-700">Streak</th>
                      <th className="px-6 py-4 text-center text-purple-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400">
                              <AvatarFallback className="text-white">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-purple-700">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className="bg-purple-100 text-purple-700">
                            Level {student.level}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="h-2 flex-1" />
                            <span className="text-purple-600 w-12">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-purple-700">
                          {student.lessonsCompleted}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-orange-600">
                            🔥 {student.streak}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-purple-700">Active Assignments</h3>
              <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-6 rounded-3xl shadow-lg border-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-purple-700 mb-1">{assignment.title}</h4>
                    <p className="text-purple-500">Due in {assignment.due}</p>
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-600">Completion</span>
                      <span className="text-purple-700">{assignment.completed}/{assignment.assigned}</span>
                    </div>
                    <Progress 
                      value={(assignment.completed / assignment.assigned) * 100} 
                      className="h-3 bg-purple-100" 
                    />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white">
              <h3 className="text-purple-700 mb-4">Subject Performance</h3>
              <div className="space-y-4">
                {subjects.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-700">{subject.name}</span>
                      <span className="text-purple-600">{subject.avgProgress}% class average</span>
                    </div>
                    <div className={`h-4 bg-gradient-to-r ${subject.color} rounded-full`} 
                         style={{ width: `${subject.avgProgress}%` }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-400 to-green-600 text-white">
                <h4 className="text-white mb-2">Top Performers</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥇</span>
                    <span>Ava Martinez - 95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥈</span>
                    <span>Liam Johnson - 92%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥉</span>
                    <span>Ava Martinez - 88%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <h4 className="text-white mb-2">Needs Attention</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Ethan Garcia</span>
                    <Badge className="bg-white/20">61%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Olivia Brown</span>
                    <Badge className="bg-white/20">68%</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-white text-orange-600 hover:bg-gray-50 rounded-xl">
                  Send Support Materials
                </Button>
              </Card>
            </div>

            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <h3 className="text-white mb-3">Premium Teacher Tools</h3>
              <p className="text-white/90 mb-4">Unlock advanced analytics, custom lesson plans, and bulk student management</p>
              <Button className="bg-white text-purple-600 hover:bg-gray-50 rounded-xl">
                Upgrade to Teacher Pro
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
