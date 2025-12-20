import axios from "axios";
import { extractJsonArrayFromTextResponse } from "./utils";

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

function isArray(data: any): data is any[] {
  return Array.isArray(data);
}

function isObject(data: any): data is object {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

export async function askQuestion({
  question,
  chatId,
  researchId,
  web_search,
  authToken,
}: {
  question: string;
  chatId?: string;
  researchId?: string;
  web_search?: boolean;
  authToken: string;
}): Promise<AskQuestionResponse | null> {
  try {
    const response = await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_chat_ask",
          arguments: {
            question,
            document_id: researchId ?? "",
            chat_id: chatId ?? "",
            web_search: typeof web_search === "boolean" ? web_search : false,
            token: authToken,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Defensive: check for error in response
    if (response.data?.result?.isError || response.data?.isError) {
      return null;
    }

    // Defensive: check for error in extracted content
    const data = extractJsonArrayFromTextResponse(response.data) as any;
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      !data.error
    ) {
      return data as AskQuestionResponse;
    }
    return null;
  } catch (error) {
    console.error("askQuestion error:", error);
    return null;
  }
}

export async function getChatHistory({
  authToken,
}: {
  authToken: string;
}): Promise<Chat[]> {
  try {
    const response = await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_chat_history_list",
          arguments: {
            token: authToken,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = extractJsonArrayFromTextResponse(response.data) as any;
    if (isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

export async function getChatById({
  chatId,
  authToken,
}: {
  chatId: string;
  authToken: string;
}): Promise<ChatDetail | null> {
  try {
    const response = await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_chat_history_get",
          arguments: {
            chat_id: chatId,
            token: authToken,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = extractJsonArrayFromTextResponse(response.data) as any;
    if (isObject(data)) {
      return data as ChatDetail;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function deleteChat({
  chatId,
  authToken,
}: {
  chatId: string;
  authToken: string;
}): Promise<void> {
  try {
    await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_chat_history_delete",
          arguments: {
            chat_id: chatId,
            token: authToken,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (error) {
    // fail silently
    return;
  }
}
