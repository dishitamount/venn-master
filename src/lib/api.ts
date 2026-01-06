// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Types
export interface StartGameRequest {
  name: string;
  class: number;
}

export interface StartGameResponse {
  session_id: string;
  difficulty: string;
  current_score: number;
  current_level: number;
}

export interface LevelResponse {
  level_id: number;
  items: string[];
  allowed_circles: string[];
  points: number;
  circle_a_label: string;
  circle_b_label: string;
}

export interface SubmitAnswerRequest {
  session_id: string;
  level_id: number;
  user_answers: Record<string, string>;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  points_added: number;
  total_score: number;
  game_over: boolean;
  explanation: string;
  next_level?: number;
  levels_completed?: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  class_level: number;
  difficulty: string;
  score: number;
  levels_completed: number;
  timestamp: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

// API Service
class GameAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async startGame(data: StartGameRequest): Promise<StartGameResponse> {
    return this.fetch<StartGameResponse>('/start-game', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLevel(levelId: number, sessionId: string): Promise<LevelResponse> {
    return this.fetch<LevelResponse>(`/level/${levelId}?session_id=${sessionId}`);
  }

  async submitAnswer(data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    return this.fetch<SubmitAnswerResponse>('/submit-answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardResponse> {
    return this.fetch<LeaderboardResponse>(`/leaderboard?limit=${limit}`);
  }

  async resetGame(sessionId: string): Promise<void> {
    await this.fetch('/reset-game', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetch('/health');
  }
}

export const gameAPI = new GameAPI();


