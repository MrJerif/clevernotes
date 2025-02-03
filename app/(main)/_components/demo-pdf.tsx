import { jsPDF } from "jspdf";

// Function to download content as a styled PDF
const downloadAsPDF = () => {
  // Check if documents or content exists
  if (!documents || !documents?.content) return;

  // Create a new jsPDF instance
  const pdf = new jsPDF();

  // Parse the content (if it's a stringified JSON, we'll parse it)
  let contentArray = [];
  try {
    contentArray = JSON.parse(documents.content); // If content is JSON string
  } catch (error) {
    contentArray = documents.content; // If it's already an array or string
  }

  // Set initial font size
  pdf.setFontSize(12);

  // Position for starting text in the PDF
  let yPosition = 10;
  const lineHeight = 10;
  
  // Function to handle paragraphs
  const renderParagraph = (text) => {
    const lines = pdf.splitTextToSize(text, 180);
    lines.forEach(line => {
      pdf.text(line, 10, yPosition);
      yPosition += lineHeight;
    });
  };

  // Function to handle lists
  const renderList = (items) => {
    items.forEach(item => {
      const lines = pdf.splitTextToSize(`• ${item}`, 180);
      lines.forEach(line => {
        pdf.text(line, 10, yPosition);
        yPosition += lineHeight;
      });
    });
  };

  // Iterate through the content array
  contentArray.forEach((block) => {
    switch (block.type) {
      case "header":
        // Render the header
        pdf.setFontSize(18); // Larger font size for headers
        pdf.text(block.value, 10, yPosition);
        yPosition += lineHeight * 2; // Add extra space after header
        pdf.setFontSize(12); // Reset font size to normal for other types
        break;
      
      case "paragraph":
        // Render paragraph
        renderParagraph(block.value);
        break;

      case "list":
        // Render list
        renderList(block.value);
        break;

      default:
        // For any unknown type, just render as normal text
        renderParagraph(block.value);
        break;
    }

    // Add new page if content exceeds the page height
    if (yPosition > 280) {
      pdf.addPage();
      yPosition = 10;
    }
  });

  // Sanitize the title for the PDF file name (remove spaces and truncate to 15 characters)
  let sanitizedTitle = documents?.title.replace(/\s+/g, '_'); // Replacing spaces with underscores
  sanitizedTitle = sanitizedTitle.substring(0, 15);
  sanitizedTitle = sanitizedTitle || 'untitled';

  // Save the PDF with the sanitized title
  pdf.save(`${sanitizedTitle}.pdf`);
};

// Usage in your component
<DropdownMenuItem onClick={downloadAsPDF}>
  <DownloadIcon className="h-4 w-4 mr-2" />
  Pdf (.pdf)
</DropdownMenuItem>
