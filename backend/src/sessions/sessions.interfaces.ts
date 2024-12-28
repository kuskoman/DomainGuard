export interface SessionSavedData {
  createdAt: Date;
  sessionHash: string;
}

export interface RetrieveSessionPayload {
  userId: string;
  sessionId: string;
}
