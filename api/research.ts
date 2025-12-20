import axios from "axios";
import { extractJsonArrayFromTextResponse } from "./utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_SUB = process.env.NEXT_PUBLIC_API_SUB;

function isArray(data: any): data is any[] {
  return Array.isArray(data);
}

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
  try {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    params.append("offset", String(offset));
    if (search) params.append("search", search);
    if (start) params.append("start", start);
    if (end) params.append("end", end);

    const response = await axios.post(
      `${API_BASE}`,
      {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "volvox_research_list",
          arguments: {
            token: authToken,
            limit,
            offset,
            search,
            start,
            end,
          },
        },
        id: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
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

export async function addResearchWork({
  researchName,
  file,
  authToken,
}: {
  researchName: string;
  file: File;
  authToken: string;
}) {
  try {
    const formData = new FormData();
    // formData.append("researchName", researchName);
    formData.append(
      "jsonrpc",
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_research_create",
          arguments: {
            token: authToken,
            researchName,
          },
        },
      })
    );
    formData.append("file", file);

    const response = await axios.post(`${API_BASE}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

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

export async function openOrDownloadFile(
  file_id: string,
  authToken: string,
  mode: "open" | "download" = "download",
  fileName?: string // Actual filename from database
) {
  if (!authToken) return;
  try {
    const response = await axios.get(`${API_SUB}/research/file/${file_id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const mimeType =
      response.headers["content-type"] || "application/octet-stream";

    // Use the provided fileName if available, otherwise fall back to file_id
    const downloadFileName = fileName || file_id;

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: mimeType })
    );

    if (mode === "open") {
      // Create a temporary link with download attribute to preserve filename
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke URL after delay to allow tab to open
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke URL after download starts
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    }
  } catch (error) {
    // fail silently
    return;
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
  try {
    const formData = new FormData();
    // formData.append("researchName", researchName);

    formData.append(
      "jsonrpc",
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "volvox_research_update",
          arguments: {
            token: authToken,
            research_id: researchId,
            researchName,
          },
        },
      })
    );

    if (file) {
      formData.append("file", file);
    }

    const response = await axios.post(`${API_BASE}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = extractJsonArrayFromTextResponse(response.data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function deleteResearchWork({
  researchId,
  authToken,
}: {
  researchId: string;
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
          name: "volvox_research_delete",
          arguments: {
            token: authToken,
            research_id: researchId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
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
