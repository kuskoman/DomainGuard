export interface SessionData {
  createdAt: Date;
  sessionHash: string;
}

export interface RetrieveSessionPayload {
  userId: string;
  sessionId: string;
}
