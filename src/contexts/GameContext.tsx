import React, { createContext, useContext, useState, useEffect } from 'react';
import { gameAPI, LeaderboardEntry as APILeaderboardEntry } from '@/lib/api';

interface Player {
  name: string;
  className: string;
  score: number;
  sessionId?: string;
  difficulty?: string;
}

interface LeaderboardEntry {
  name: string;
  className: string;
  score: number;
  date: string;
  difficulty?: string;
  levelsCompleted?: number;
}

interface GameContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  score: number;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  leaderboard: LeaderboardEntry[];
  fetchLeaderboard: () => Promise<void>;
  sessionId: string | null;
  difficulty: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = async () => {
    try {
      const response = await gameAPI.getLeaderboard(10);
      const entries: LeaderboardEntry[] = response.leaderboard.map((entry: APILeaderboardEntry) => ({
        name: entry.name,
        className: entry.class_level.toString(),
        score: entry.score,
        date: entry.timestamp,
        difficulty: entry.difficulty,
        levelsCompleted: entry.levels_completed,
      }));
      setLeaderboard(entries);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  // Load leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Update player when sessionId changes
  useEffect(() => {
    if (player && sessionId && difficulty) {
      setPlayer({
        ...player,
        sessionId,
        difficulty,
      });
    }
  }, [sessionId, difficulty]);

  const addScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
  };

  // Start new game with backend
  const startNewGame = async (name: string, classLevel: number) => {
    try {
      const response = await gameAPI.startGame({
        name,
        class: classLevel,
      });
      
      setSessionId(response.session_id);
      setDifficulty(response.difficulty);
      setCurrentLevel(response.current_level);
      setScore(response.current_score);
      
      setPlayer({
        name,
        className: classLevel.toString(),
        score: 0,
        sessionId: response.session_id,
        difficulty: response.difficulty,
      });
      
      return response;
    } catch (error) {
      console.error('Failed to start game:', error);
      throw error;
    }
  };

  return (
    <GameContext.Provider
      value={{
        player,
        setPlayer,
        currentLevel,
        setCurrentLevel,
        score,
        setScore,
        addScore,
        resetGame,
        leaderboard,
        fetchLeaderboard,
        sessionId,
        difficulty,
        // @ts-ignore - Add startNewGame to context
        startNewGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
