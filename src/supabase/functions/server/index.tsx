import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-78a36db3/health", (c) => {
  return c.json({ status: "ok" });
});

// ========= COMMUNITY & MULTIPLAYER FEATURES =========

// Get online users
app.get("/make-server-78a36db3/online-users", async (c) => {
  try {
    const users = await kv.getByPrefix("online:");
    const now = Date.now();
    // Filter out users who haven't been active in the last 5 minutes
    const activeUsers = users.filter((user: any) => {
      return now - user.lastActive < 5 * 60 * 1000;
    });
    return c.json({ users: activeUsers });
  } catch (error) {
    console.error("Error fetching online users:", error);
    return c.json({ error: "Failed to fetch online users" }, 500);
  }
});

// Update user presence (heartbeat)
app.post("/make-server-78a36db3/presence", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, name, avatar, level } = body;
    
    await kv.set(`online:${userId}`, {
      userId,
      name,
      avatar,
      level,
      lastActive: Date.now()
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating presence:", error);
    return c.json({ error: "Failed to update presence" }, 500);
  }
});

// Create a study session
app.post("/make-server-78a36db3/study-session", async (c) => {
  try {
    const body = await c.req.json();
    const { hostId, hostName, subject, maxParticipants } = body;
    
    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      hostId,
      hostName,
      subject,
      maxParticipants: maxParticipants || 4,
      participants: [{ userId: hostId, name: hostName }],
      status: 'waiting', // waiting, active, completed
      createdAt: Date.now()
    };
    
    await kv.set(`study-session:${sessionId}`, session);
    
    return c.json({ session });
  } catch (error) {
    console.error("Error creating study session:", error);
    return c.json({ error: "Failed to create study session" }, 500);
  }
});

// Get active study sessions
app.get("/make-server-78a36db3/study-sessions", async (c) => {
  try {
    const sessions = await kv.getByPrefix("study-session:");
    const now = Date.now();
    
    // Filter out old sessions (older than 1 hour)
    const activeSessions = sessions.filter((session: any) => {
      return now - session.createdAt < 60 * 60 * 1000 && session.status !== 'completed';
    });
    
    return c.json({ sessions: activeSessions });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return c.json({ error: "Failed to fetch study sessions" }, 500);
  }
});

// Join a study session
app.post("/make-server-78a36db3/study-session/:sessionId/join", async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    const { userId, name } = body;
    
    const session = await kv.get(`study-session:${sessionId}`);
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    
    if (session.participants.length >= session.maxParticipants) {
      return c.json({ error: "Session is full" }, 400);
    }
    
    // Check if user already in session
    const alreadyJoined = session.participants.some((p: any) => p.userId === userId);
    if (alreadyJoined) {
      return c.json({ session });
    }
    
    session.participants.push({ userId, name });
    await kv.set(`study-session:${sessionId}`, session);
    
    return c.json({ session });
  } catch (error) {
    console.error("Error joining study session:", error);
    return c.json({ error: "Failed to join study session" }, 500);
  }
});

// Create a multiplayer battle
app.post("/make-server-78a36db3/battle", async (c) => {
  try {
    const body = await c.req.json();
    const { hostId, hostName, hostAvatar, subject, difficulty } = body;
    
    const battleId = `battle-${Date.now()}`;
    const battle = {
      id: battleId,
      subject,
      difficulty: difficulty || 'easy',
      players: [{
        userId: hostId,
        name: hostName,
        avatar: hostAvatar,
        score: 0,
        ready: false
      }],
      status: 'waiting', // waiting, active, completed
      currentQuestion: 0,
      createdAt: Date.now()
    };
    
    await kv.set(`battle:${battleId}`, battle);
    
    return c.json({ battle });
  } catch (error) {
    console.error("Error creating battle:", error);
    return c.json({ error: "Failed to create battle" }, 500);
  }
});

// Get active battles
app.get("/make-server-78a36db3/battles", async (c) => {
  try {
    const battles = await kv.getByPrefix("battle:");
    const now = Date.now();
    
    // Filter out old battles (older than 30 minutes)
    const activeBattles = battles.filter((battle: any) => {
      return now - battle.createdAt < 30 * 60 * 1000 && battle.status !== 'completed';
    });
    
    return c.json({ battles: activeBattles });
  } catch (error) {
    console.error("Error fetching battles:", error);
    return c.json({ error: "Failed to fetch battles" }, 500);
  }
});

// Join a battle
app.post("/make-server-78a36db3/battle/:battleId/join", async (c) => {
  try {
    const battleId = c.req.param('battleId');
    const body = await c.req.json();
    const { userId, name, avatar } = body;
    
    const battle = await kv.get(`battle:${battleId}`);
    
    if (!battle) {
      return c.json({ error: "Battle not found" }, 404);
    }
    
    if (battle.players.length >= 2) {
      return c.json({ error: "Battle is full" }, 400);
    }
    
    if (battle.status !== 'waiting') {
      return c.json({ error: "Battle already started" }, 400);
    }
    
    // Check if user already in battle
    const alreadyJoined = battle.players.some((p: any) => p.userId === userId);
    if (alreadyJoined) {
      return c.json({ battle });
    }
    
    battle.players.push({
      userId,
      name,
      avatar,
      score: 0,
      ready: false
    });
    
    await kv.set(`battle:${battleId}`, battle);
    
    return c.json({ battle });
  } catch (error) {
    console.error("Error joining battle:", error);
    return c.json({ error: "Failed to join battle" }, 500);
  }
});

// Update battle player ready status
app.post("/make-server-78a36db3/battle/:battleId/ready", async (c) => {
  try {
    const battleId = c.req.param('battleId');
    const body = await c.req.json();
    const { userId } = body;
    
    const battle = await kv.get(`battle:${battleId}`);
    
    if (!battle) {
      return c.json({ error: "Battle not found" }, 404);
    }
    
    battle.players = battle.players.map((p: any) => {
      if (p.userId === userId) {
        return { ...p, ready: true };
      }
      return p;
    });
    
    // Check if all players are ready
    const allReady = battle.players.every((p: any) => p.ready);
    if (allReady && battle.players.length === 2) {
      battle.status = 'active';
    }
    
    await kv.set(`battle:${battleId}`, battle);
    
    return c.json({ battle });
  } catch (error) {
    console.error("Error updating ready status:", error);
    return c.json({ error: "Failed to update ready status" }, 500);
  }
});

// Submit battle answer
app.post("/make-server-78a36db3/battle/:battleId/answer", async (c) => {
  try {
    const battleId = c.req.param('battleId');
    const body = await c.req.json();
    const { userId, correct, responseTime } = body;
    
    const battle = await kv.get(`battle:${battleId}`);
    
    if (!battle) {
      return c.json({ error: "Battle not found" }, 404);
    }
    
    battle.players = battle.players.map((p: any) => {
      if (p.userId === userId) {
        const points = correct ? (responseTime < 5000 ? 15 : 10) : 0;
        return { ...p, score: p.score + points };
      }
      return p;
    });
    
    await kv.set(`battle:${battleId}`, battle);
    
    return c.json({ battle });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return c.json({ error: "Failed to submit answer" }, 500);
  }
});

// Get battle state
app.get("/make-server-78a36db3/battle/:battleId", async (c) => {
  try {
    const battleId = c.req.param('battleId');
    const battle = await kv.get(`battle:${battleId}`);
    
    if (!battle) {
      return c.json({ error: "Battle not found" }, 404);
    }
    
    return c.json({ battle });
  } catch (error) {
    console.error("Error fetching battle:", error);
    return c.json({ error: "Failed to fetch battle" }, 500);
  }
});

// Add friend
app.post("/make-server-78a36db3/friends/add", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, friendId, friendName, friendAvatar } = body;
    
    const userFriends = await kv.get(`friends:${userId}`) || { userId, friends: [] };
    
    // Check if already friends
    const alreadyFriends = userFriends.friends.some((f: any) => f.friendId === friendId);
    if (!alreadyFriends) {
      userFriends.friends.push({
        friendId,
        name: friendName,
        avatar: friendAvatar,
        addedAt: Date.now()
      });
      
      await kv.set(`friends:${userId}`, userFriends);
    }
    
    return c.json({ friends: userFriends.friends });
  } catch (error) {
    console.error("Error adding friend:", error);
    return c.json({ error: "Failed to add friend" }, 500);
  }
});

// Get friends list
app.get("/make-server-78a36db3/friends/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const userFriends = await kv.get(`friends:${userId}`) || { userId, friends: [] };
    
    return c.json({ friends: userFriends.friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return c.json({ error: "Failed to fetch friends" }, 500);
  }
});

Deno.serve(app.fetch);