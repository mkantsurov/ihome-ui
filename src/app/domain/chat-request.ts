export interface MessageEntry {
  role: 'user' | 'ai';
  text: string;
}

export interface ChatRequest {
  messages: MessageEntry[];
}
