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
