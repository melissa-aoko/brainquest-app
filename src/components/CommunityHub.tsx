import { useState, useEffect } from 'react';
import { Users, Gamepad2, BookOpen, UserPlus, Trophy, Star, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { playSound } from '../utils/sounds';
import { ChildProgress } from '../utils/progressManager';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { NavigateFn } from '../types/navigation';

interface CommunityHubProps {
  onNavigate: NavigateFn;
  onStartBattle: (battleId: string) => void;
  onJoinStudySession: (sessionId: string) => void;
  progress: ChildProgress;
}

interface OnlineUser {
  userId: string;
  name: string;
  avatar: string;
  level: number;
  lastActive: number;
}

interface Battle {
  id: string;
  subject: string;
  difficulty: string;
  players: Array<{
    userId: string;
    name: string;
    avatar: string;
    score: number;
    ready: boolean;
  }>;
  status: string;
  createdAt: number;
}

interface StudySession {
  id: string;
  hostId: string;
  hostName: string;
  subject: string;
  maxParticipants: number;
  participants: Array<{
    userId: string;
    name: string;
  }>;
  status: string;
  createdAt: number;
}

export function CommunityHub({ onNavigate, onStartBattle, onJoinStudySession, progress }: CommunityHubProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = `user-${progress.name.toLowerCase().replace(/\s+/g, '-')}`;
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-78a36db3`;

  // Update presence every 30 seconds
  useEffect(() => {
    const updatePresence = async () => {
      try {
        await fetch(`${serverUrl}/presence`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId,
            name: progress.name,
            avatar: progress.avatar,
            level: progress.level
          })
        });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => clearInterval(interval);
  }, [userId, progress]);

  // Fetch data
  const fetchData = async () => {
    try {
      // Fetch online users
      const usersRes = await fetch(`${serverUrl}/online-users`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const usersData = await usersRes.json();
      setOnlineUsers(usersData.users || []);

      // Fetch battles
      const battlesRes = await fetch(`${serverUrl}/battles`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const battlesData = await battlesRes.json();
      setBattles(battlesData.battles || []);

      // Fetch study sessions
      const sessionsRes = await fetch(`${serverUrl}/study-sessions`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const sessionsData = await sessionsRes.json();
      setStudySessions(sessionsData.sessions || []);

      // Fetch friends
      const friendsRes = await fetch(`${serverUrl}/friends/${userId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching community data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const createBattle = async (subject: string) => {
    try {
      playSound('click');
      const res = await fetch(`${serverUrl}/battle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          hostId: userId,
          hostName: progress.name,
          hostAvatar: progress.avatar,
          subject,
          difficulty: 'easy'
        })
      });
      const data = await res.json();
      if (data.battle) {
        playSound('whoosh');
        onStartBattle(data.battle.id);
      }
    } catch (error) {
      console.error('Error creating battle:', error);
    }
  };

  const joinBattle = async (battleId: string) => {
    try {
      playSound('click');
      const res = await fetch(`${serverUrl}/battle/${battleId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId,
          name: progress.name,
          avatar: progress.avatar
        })
      });
      const data = await res.json();
      if (data.battle) {
        playSound('whoosh');
        onStartBattle(battleId);
      }
    } catch (error) {
      console.error('Error joining battle:', error);
    }
  };

  const createStudySession = async (subject: string) => {
    try {
      playSound('click');
      const res = await fetch(`${serverUrl}/study-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          hostId: userId,
          hostName: progress.name,
          subject,
          maxParticipants: 4
        })
      });
      const data = await res.json();
      if (data.session) {
        playSound('success');
        onJoinStudySession(data.session.id);
      }
    } catch (error) {
      console.error('Error creating study session:', error);
    }
  };

  const joinStudySession = async (sessionId: string) => {
    try {
      playSound('click');
      const res = await fetch(`${serverUrl}/study-session/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId,
          name: progress.name
        })
      });
      const data = await res.json();
      if (data.session) {
        playSound('success');
        onJoinStudySession(sessionId);
      }
    } catch (error) {
      console.error('Error joining study session:', error);
    }
  };

  const addFriend = async (friendUser: OnlineUser) => {
    try {
      playSound('click');
      await fetch(`${serverUrl}/friends/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId,
          friendId: friendUser.userId,
          friendName: friendUser.name,
          friendAvatar: friendUser.avatar
        })
      });
      playSound('success');
      fetchData();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const getAvatarEmoji = (avatar: string) => {
    const avatarMap: { [key: string]: string } = {
      'rocket': '🚀',
      'unicorn': '🦄',
      'dinosaur': '🦕',
      'superhero': '🦸',
      'cat': '🐱',
      'robot': '🤖',
      'panda': '🐼',
      'star': '⭐'
    };
    return avatarMap[avatar] || '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => {
                playSound('click');
                onNavigate('home');
              }}
              className="bg-white/20 hover:bg-white/30 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-white">Community Hub</h2>
            <div className="w-10"></div>
          </div>
          <p className="text-white/90 text-center">Connect, compete, and learn together!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Tabs defaultValue="battles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 shadow-md">
            <TabsTrigger value="battles" className="rounded-xl">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Battles
            </TabsTrigger>
            <TabsTrigger value="study" className="rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger value="friends" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
          </TabsList>

          {/* BATTLES TAB */}
          <TabsContent value="battles" className="space-y-4">
            {/* Create Battle Section */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-orange-400 to-red-500 text-white">
              <h3 className="text-white mb-4">⚔️ Start a Quiz Battle!</h3>
              <p className="text-white/90 mb-4">Challenge other kids to a fun learning battle!</p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => createBattle('math')}
                  className="bg-white text-orange-600 hover:bg-gray-50 rounded-xl"
                >
                  Math Battle
                </Button>
                <Button
                  onClick={() => createBattle('reading')}
                  className="bg-white text-orange-600 hover:bg-gray-50 rounded-xl"
                >
                  Reading Battle
                </Button>
              </div>
            </Card>

            {/* Active Battles */}
            <div>
              <h3 className="text-purple-700 mb-3">🎮 Join a Battle</h3>
              {battles.filter(b => b.status === 'waiting').length === 0 ? (
                <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white text-center">
                  <p className="text-gray-500">No battles available. Create one above!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {battles.filter(b => b.status === 'waiting').map((battle) => (
                    <Card key={battle.id} className="p-4 rounded-3xl shadow-lg border-0 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-2xl">
                            {getAvatarEmoji(battle.players[0].avatar)}
                          </div>
                          <div>
                            <p className="text-gray-800">{battle.players[0].name}'s Battle</p>
                            <Badge className="bg-blue-100 text-blue-700 mt-1">
                              {battle.subject.charAt(0).toUpperCase() + battle.subject.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => joinBattle(battle.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white"
                          disabled={battle.players.some(p => p.userId === userId)}
                        >
                          {battle.players.some(p => p.userId === userId) ? 'Joined' : 'Join'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* STUDY GROUPS TAB */}
          <TabsContent value="study" className="space-y-4">
            {/* Create Study Session */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <h3 className="text-white mb-4">📚 Start a Study Session!</h3>
              <p className="text-white/90 mb-4">Learn together with friends!</p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => createStudySession('math')}
                  className="bg-white text-green-600 hover:bg-gray-50 rounded-xl"
                >
                  Math Study
                </Button>
                <Button
                  onClick={() => createStudySession('reading')}
                  className="bg-white text-green-600 hover:bg-gray-50 rounded-xl"
                >
                  Reading Study
                </Button>
              </div>
            </Card>

            {/* Active Study Sessions */}
            <div>
              <h3 className="text-purple-700 mb-3">🎓 Join a Study Session</h3>
              {studySessions.filter(s => s.status === 'waiting').length === 0 ? (
                <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white text-center">
                  <p className="text-gray-500">No study sessions available. Create one above!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {studySessions.filter(s => s.status === 'waiting').map((session) => (
                    <Card key={session.id} className="p-4 rounded-3xl shadow-lg border-0 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-800">{session.hostName}'s Study Group</p>
                          <Badge className="bg-green-100 text-green-700 mt-1">
                            {session.subject.charAt(0).toUpperCase() + session.subject.slice(1)}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => joinStudySession(session.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white"
                          disabled={session.participants.some(p => p.userId === userId)}
                        >
                          {session.participants.some(p => p.userId === userId) ? 'Joined' : 'Join'}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{session.participants.length}/{session.maxParticipants} participants</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* FRIENDS TAB */}
          <TabsContent value="friends" className="space-y-4">
            {/* Online Users */}
            <div>
              <h3 className="text-purple-700 mb-3">🌟 Kids Online Now</h3>
              {onlineUsers.filter(u => u.userId !== userId).length === 0 ? (
                <Card className="p-6 rounded-3xl shadow-lg border-0 bg-white text-center">
                  <p className="text-gray-500">No other kids online right now. Check back soon!</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {onlineUsers
                    .filter(u => u.userId !== userId)
                    .slice(0, 6)
                    .map((user) => {
                      const isFriend = friends.some(f => f.friendId === user.userId);
                      return (
                        <Card key={user.userId} className="p-4 rounded-3xl shadow-lg border-0 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xl">
                                {getAvatarEmoji(user.avatar)}
                              </div>
                              <div>
                                <p className="text-gray-800">{user.name}</p>
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Trophy className="w-3 h-3" />
                                  <span>Level {user.level}</span>
                                </div>
                              </div>
                            </div>
                            {!isFriend && (
                              <Button
                                onClick={() => addFriend(user)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white"
                                size="sm"
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            )}
                            {isFriend && (
                              <Badge className="bg-green-100 text-green-700">
                                Friend
                              </Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Friends List */}
            {friends.length > 0 && (
              <div>
                <h3 className="text-purple-700 mb-3">👥 My Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {friends.map((friend) => (
                    <Card key={friend.friendId} className="p-4 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-purple-100 to-pink-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                          {getAvatarEmoji(friend.avatar)}
                        </div>
                        <div>
                          <p className="text-purple-700">{friend.name}</p>
                          <p className="text-purple-500">Friend</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
