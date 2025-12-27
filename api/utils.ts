export function extractJsonArrayFromTextResponse(response: any): any[] {
  try {
    // Find the first content item with type "text"
    const textContent = response?.result?.content?.find(
      (item: any) => item.type === "text"
    )?.text;

    if (!textContent) return [];

    // Parse the text as JSON
    return JSON.parse(textContent);
  } catch (e) {
    return [];
  }
}

/**
 * Extracts the summary string from a YouTube/video summarizer API response.
 * Handles cases where the text content is a JSON object with a "summary" property.
 */
export function extractSummaryFromVideoTextResponse(response: any): string {
  try {
    const textContent = response?.result?.content?.find(
      (item: any) => item.type === "text"
    )?.text;

    if (!textContent) return "";

    const parsed = JSON.parse(textContent);

    let summary = "";
    if (typeof parsed === "object" && parsed.summary) {
      summary = parsed.summary;
    } else if (typeof parsed === "string") {
      summary = parsed;
    } else {
      return "";
    }

    // Handle multiple layers of JSON escaping
    // First, try to parse it again in case it's double-encoded
    try {
      const doubleDecoded = JSON.parse(summary);
      if (typeof doubleDecoded === "string") {
        summary = doubleDecoded;
      }
    } catch {
      // Not double-encoded, continue with current summary
    }

    // Clean up any remaining escaped characters
    const cleanedSummary = summary
      .replace(/\\n/g, "\n") // Replace \n with actual newlines
      .replace(/\\"/g, '"') // Replace \" with "
      .replace(/\\\\/g, "\\") // Replace \\ with \
      .trim();

    return cleanedSummary;
  } catch (e) {
    console.error("Error parsing summary:", e);
    return "";
  }
}
