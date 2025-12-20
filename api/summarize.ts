import axios from "axios";
import { extractJsonArrayFromTextResponse } from "./utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

function isArray(data: any): data is any[] {
  return Array.isArray(data);
}

export async function summarizeResearch({
  documentIds,
  authToken,
}: {
  documentIds: string[];
  authToken: string;
}) {
  try {
    const response = await axios.post(
      API_BASE,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_summarize_research",
          arguments: {
            document_ids: documentIds,
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

    const data = extractJsonArrayFromTextResponse(response.data);
    if (isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

export async function summarizeVideo({
  videoUrl,
  authToken,
}: {
  videoUrl: string;
  authToken: string;
}) {
  try {
    const response = await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_summarize_video",
          arguments: {
            video_url: videoUrl,
            token: authToken,
          },
        },
      }, // POST body (empty if not needed)
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = extractJsonArrayFromTextResponse(response.data);
    if (isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
