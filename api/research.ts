export async function getResearchWorks({
  limit = 10,
  offset = 0,
  search = "",
  start,
  end,
  authToken,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  start?: string;
  end?: string;
  authToken: string;
}) {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  if (search) params.append("search", search);
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const response = await axios.get(
    `${API_BASE}/research?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function addResearchWork({
  researchName,
  file,
  authToken,
}: {
  researchName: string;
  file: File;
  authToken: string;
}) {
  const formData = new FormData();
  formData.append("researchName", researchName);
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/research/addResearch`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}

export async function openOrDownloadFile(
  file_id: string,
  authToken: string,
  mode: "open" | "download" = "download"
) {
  if (!authToken) throw new Error("Missing auth token");
  const response = await axios.get(`${API_BASE}/research/file/${file_id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const mimeType =
    response.headers["content-type"] || "application/octet-stream";
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: mimeType })
  );
  if (mode === "open") {
    window.open(url, "_blank");
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file_id);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function updateResearchWork({
  researchId,
  researchName,
  file,
  authToken,
}: {
  researchId: string;
  researchName: string;
  file?: File;
  authToken: string;
}) {
  const formData = new FormData();
  formData.append("researchName", researchName);
  if (file) {
    formData.append("file", file);
  }

  const response = await axios.put(
    `${API_BASE}/research/${researchId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}

export async function deleteResearchWork({
  researchId,
  authToken,
}: {
  researchId: string;
  authToken: string;
}) {
  const response = await axios.delete(`${API_BASE}/research/${researchId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
}
