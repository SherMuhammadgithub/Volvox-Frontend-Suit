import { jsPDF } from "jspdf";
import { marked } from "marked"; // Install with: npm install marked

export async function downloadMarkdownAsPdf(
  markdown: string,
  fileName: string = "summary.pdf"
) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  // Use Poppins font if available, fallback to sans-serif
  doc.setFont("Poppins", "normal");
  doc.setFontSize(18); // increased font size for better readability
  const leftMargin = 20;
  const topMargin = 30;
  const maxWidth = 170;
  const html = marked(markdown);
  await doc.html(
    `<div style="font-family:'Poppins',sans-serif;font-size:18px;margin:32px 40px;color:#000;">${html}</div>`,
    {
      x: leftMargin,
      y: topMargin,
      width: maxWidth,
      windowWidth: 800,
      callback: () => doc.save(fileName),
    }
  );
}

export async function markdownToPdfBlob(markdown: string): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.setFont("Poppins", "normal");
  doc.setFontSize(18);
  const leftMargin = 20;
  const topMargin = 30;
  const maxWidth = 170;
  const html = marked(markdown);
  return new Promise((resolve) => {
    doc.html(
      `<div style="font-family:'Poppins',sans-serif;font-size:18px;margin:32px 40px;color:#000;">${html}</div>`,
      {
        x: leftMargin,
        y: topMargin,
        width: maxWidth,
        windowWidth: 800,
        callback: () => resolve(doc.output("blob")),
      }
    );
  });
}
