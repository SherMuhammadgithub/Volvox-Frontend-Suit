import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface ChatMessage {
  question: string;
  response: string;
  research_id?: string | null;
}

export interface Chat {
  chat_id: string;
  chat_title: string;
  createdAt: string;
}

export interface ChatDetail extends Chat {
  messages: ChatMessage[];
}

export interface AskQuestionResponse {
  response: string;
  chat_id: string;
  chat_title: string;
}

export async function askQuestion({
  question,
  chatId,
  researchId,
  authToken,
}: {
  question: string;
  chatId?: string;
  researchId?: string;
  authToken: string;
}): Promise<AskQuestionResponse> {
  const params = new URLSearchParams();
  params.append("question", question);
  if (chatId) params.append("chat_id", chatId);
  if (researchId) params.append("research_id", researchId);

  const response = await axios.post(
    `${API_BASE}/chat/ask?${params.toString()}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}

export async function getChatHistory({
  authToken,
}: {
  authToken: string;
}): Promise<Chat[]> {
  const response = await axios.get(`${API_BASE}/chat/chatHistory`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
}

export async function getChatById({
  chatId,
  authToken,
}: {
  chatId: string;
  authToken: string;
}): Promise<ChatDetail> {
  const response = await axios.get(`${API_BASE}/chat/chatHistory/${chatId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
}

export async function deleteChat({
  chatId,
  authToken,
}: {
  chatId: string;
  authToken: string;
}): Promise<void> {
  await axios.delete(`${API_BASE}/chat/deleteChat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
