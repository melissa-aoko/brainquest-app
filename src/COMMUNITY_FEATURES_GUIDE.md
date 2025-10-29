# BrainQuest Jr. - Community & Multiplayer Features Guide

## 🎮 New Features Added

### 1. **Community Hub** 🌟
A central place where kids can connect, compete, and learn together!

**Features:**
- See who's online in real-time
- Add friends
- Join quiz battles
- Create and join study sessions

**How to Access:**
- From the home dashboard, click the orange "Community Hub" card
- Navigate between tabs: Battles, Study Groups, and Friends

### 2. **Multiplayer Quiz Battles** ⚔️
Real-time competitive learning where two kids compete head-to-head!

**Features:**
- Create a battle in Math or Reading
- Wait for an opponent to join
- Both players answer the same questions
- Score points based on correctness and speed
- Win the battle and earn stars!

**How to Play:**
1. Go to Community Hub → Battles tab
2. Click "Math Battle" or "Reading Battle" to create
3. Wait for another player to join
4. Click "I'm Ready!" when you see your opponent
5. Answer questions quickly to earn more points!

### 3. **Group Study Sessions** 📚
Collaborative learning environment where up to 4 kids can study together!

**Features:**
- Create study sessions for different subjects
- See all participants in the session
- Work through questions together
- Learn from explanations

**How to Use:**
1. Go to Community Hub → Study Groups tab
2. Click "Math Study" or "Reading Study" to create a session
3. Other kids can join your session
4. Click "Start Studying" to begin
5. Complete the lesson together!

### 4. **Friends System** 👥
Connect with other learners!

**Features:**
- See kids who are online now
- Add friends with one click
- View your friends list
- See friend levels and avatars

**How to Add Friends:**
1. Go to Community Hub → Friends tab
2. Browse "Kids Online Now"
3. Click the + button to add a friend
4. Your friends appear in "My Friends" section

### 5. **Functional Subjects** 📖
Two subjects are now fully functional with real lesson content!

#### **Math Lessons** 🧮
1. Addition Basics (Easy)
2. Subtraction Fun (Easy)
3. Shapes and Sides (Easy)
4. Comparing Numbers (Easy)
5. Multiplication Magic (Medium)

#### **Reading Lessons** 📚
1. Letter Sounds (Easy)
2. Rhyming Words (Easy)
3. Simple Words (Easy)
4. Opposite Words (Medium)
5. Story Understanding (Medium)

**How to Access:**
1. Click on Math or Reading from the home dashboard
2. Choose a lesson from the list
3. Complete 5 questions per lesson
4. Earn stars based on performance!

## 🏆 New Badge: Team Player
Automatically awarded when you join your first multiplayer activity (battle or study session)!

## 🎯 Testing the Features

### Test Scenario 1: Solo Learning
1. Create an account
2. Click Math or Reading subject
3. Select any lesson
4. Complete the quiz
5. Earn stars and badges!

### Test Scenario 2: Multiplayer Battle
1. Open the app in two browser windows/tabs
2. Create two different accounts (different names)
3. Window 1: Go to Community Hub → Create a Math Battle
4. Window 2: Go to Community Hub → Join the battle
5. Both windows: Click "I'm Ready!"
6. Play the quiz battle and compete!

### Test Scenario 3: Study Session
1. Open app in multiple windows (up to 4)
2. Create different accounts in each
3. Window 1: Create a Reading Study session
4. Other windows: Join the session
5. Any participant can start studying
6. Work through questions together!

### Test Scenario 4: Making Friends
1. Have multiple accounts online
2. Go to Community Hub → Friends tab
3. Add friends from the "Kids Online Now" list
4. Check "My Friends" section

## 🔧 Technical Details

### Backend (Supabase Edge Functions)
- **Endpoints:**
  - `/online-users` - Get list of online users
  - `/presence` - Update user presence (heartbeat)
  - `/battle` - Create/manage battles
  - `/battles` - List active battles
  - `/battle/:id/join` - Join a battle
  - `/battle/:id/ready` - Mark player as ready
  - `/battle/:id/answer` - Submit battle answer
  - `/study-session` - Create study sessions
  - `/study-sessions` - List active sessions
  - `/study-session/:id/join` - Join a session
  - `/friends/add` - Add a friend
  - `/friends/:userId` - Get friends list

### Data Storage
- **Key-Value Store** (using Supabase KV):
  - `online:{userId}` - User presence data
  - `battle:{battleId}` - Battle state
  - `study-session:{sessionId}` - Study session state
  - `friends:{userId}` - User's friends list

### Real-Time Updates
- Presence updates every 30 seconds
- Battle/session state refreshes every 2-5 seconds
- Automatic cleanup of old data

## 🎨 Design Highlights

- **Kid-Friendly Colors:** Bright gradients throughout
- **Clear Visual Hierarchy:** Easy navigation with tabs
- **Engaging Emojis:** Used consistently for visual appeal
- **Responsive Cards:** Hover effects and shadows
- **Accessibility:** Large touch targets, clear text

## 🚀 Future Enhancements (Ideas)

- Voice chat in study sessions
- More subjects (Science, Art, Music)
- Leaderboards and tournaments
- Achievement sharing
- Parent notifications for multiplayer activities
- Scheduled study sessions
- Custom battle difficulty levels
- Team battles (2v2)

## 📝 Notes

- All multiplayer features require Supabase backend
- Community features work across different browser tabs/windows
- Progress is saved locally per child account
- Team Player badge earned on first multiplayer participation
- Battle scoring: 15 pts for fast correct, 10 pts for correct, 0 for wrong
- Study sessions support up to 4 participants
- Battles are 1v1 only
- Sessions/battles older than 30-60 minutes are cleaned up automatically

---

Enjoy learning together in BrainQuest Jr.! 🎉
