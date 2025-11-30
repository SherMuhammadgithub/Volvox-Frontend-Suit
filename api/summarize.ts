import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export async function summarizeResearch({
  documentIds,
  authToken,
}: {
  documentIds: string[];
  authToken: string;
}) {
  const response = await axios.post(
    `${API_BASE}/chat/summarize-research`,
    {
      documents: documentIds,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}

export async function summarizeVideo({
  videoUrl,
  authToken,
}: {
  videoUrl: string;
  authToken: string;
}) {
  const response = await axios.post(
    `${API_BASE}/chat/summarize-video`,
    {}, // POST body (empty if not needed)
    {
      params: { video_url: videoUrl },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}
