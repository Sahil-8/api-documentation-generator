const fs = require("fs");
const path = require("path");
const SwaggerParser = require("swagger-parser");
const yaml = require("js-yaml");
const marked = require("marked");
const { jsPDF } = require("jspdf");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    const fileContent = fs.readFileSync(filePath, "utf8");
    let parsedData = null;

    // Parse file content
    if (ext === ".json") {
      try {
        parsedData = await SwaggerParser.parse(filePath);
      } catch (e) {
        parsedData = JSON.parse(fileContent);
      }
    } else if (ext === ".yaml" || ext === ".yml") {
      const doc = yaml.load(fileContent);
      try {
        parsedData = await SwaggerParser.parse(doc);
      } catch (e) {
        parsedData = doc;
      }
    } else if (ext === ".md") {
      parsedData = marked.parse(fileContent);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Build HTML content
    let htmlContent = "";
    if (typeof parsedData === "string") {
      htmlContent = generateMarkdownHTML(parsedData, req.file.originalname);
    } else if (parsedData.info && parsedData.info.schema?.includes("postman")) {
      htmlContent = generatePostmanHTML(parsedData, req.file.originalname);
    } else if (parsedData.openapi || parsedData.swagger) {
      htmlContent = generateSwaggerHTML(parsedData, req.file.originalname);
    } else {
      htmlContent = generateGenericJSONHTML(parsedData, req.file.originalname);
    }

    // Generate PDF using jsPDF
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(16);
      doc.text('API Documentation', 20, 20);
      
      // Add file name
      doc.setFontSize(12);
      doc.text(`File: ${req.file.originalname || "documentation"}`, 20, 35);
      
      // Add generation date
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add content (simplified for jsPDF)
      doc.setFontSize(10);
      let yPosition = 60;
      
      // Convert HTML content to simple text for PDF
      const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Split text into lines that fit the page width
      const maxWidth = 170; // A4 width minus margins
      const lines = doc.splitTextToSize(textContent, maxWidth);
      
      // Add text lines to PDF
      lines.forEach(line => {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      // Send PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${req.file.originalname || "documentation"}.pdf"`
      );
      res.end(doc.output('arraybuffer'));
    } catch (pdfError) {
      console.error("PDF creation error:", pdfError);
      return res
        .status(500)
        .json({ message: "Error creating PDF", error: pdfError.message });
    }
  } catch (err) {
    console.error("File processing error:", err);
    res
      .status(500)
      .json({ message: "Error parsing or generating PDF", error: err.message });
  }
};

exports.generatePDFFromData = async (req, res) => {
  try {
    const { parsedData, fileName } = req.body;
    
    if (!parsedData) {
      return res.status(400).json({ message: "No parsed data provided" });
    }

    // Build HTML content based on the parsed data
    let htmlContent = "";
    if (typeof parsedData === "string") {
      htmlContent = generateMarkdownHTML(parsedData, fileName);
    } else if (parsedData.info && parsedData.info.schema?.includes("postman")) {
      htmlContent = generatePostmanHTML(parsedData, fileName);
    } else if (parsedData.openapi || parsedData.swagger) {
      htmlContent = generateSwaggerHTML(parsedData, fileName);
    } else {
      htmlContent = generateGenericJSONHTML(parsedData, fileName);
    }

    // Generate PDF using jsPDF
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(16);
      doc.text('API Documentation', 20, 20);
      
      // Add file name
      doc.setFontSize(12);
      doc.text(`File: ${fileName || "documentation"}`, 20, 35);
      
      // Add generation date
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add content (simplified for jsPDF)
      doc.setFontSize(10);
      let yPosition = 60;
      
      // Convert HTML content to simple text for PDF
      const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Split text into lines that fit the page width
      const maxWidth = 170; // A4 width minus margins
      const lines = doc.splitTextToSize(textContent, maxWidth);
      
      // Add text lines to PDF
      lines.forEach(line => {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      // Send PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName || "documentation"}.pdf"`
      );
      res.end(doc.output('arraybuffer'));
    } catch (pdfError) {
      console.error("PDF creation error:", pdfError);
      return res
        .status(500)
        .json({ message: "Error creating PDF", error: pdfError.message });
    }
  } catch (err) {
    console.error("PDF generation error:", err);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: err.message });
  }
};

// ---------------- Helper functions ----------------

function generateMarkdownHTML(content, fileName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${fileName || "Documentation"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        p { margin-bottom: 10px; }
        code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 15px; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        ul, ol { margin-bottom: 10px; }
        li { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>${fileName || "Documentation"}</h1>
      ${content}
    </body>
    </html>
  `;
}

function generatePostmanHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.info?.name || "Postman Collection"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
        .get { background-color: #d4edda; color: #155724; }
        .post { background-color: #cce5ff; color: #004085; }
        .put { background-color: #fff3cd; color: #856404; }
        .delete { background-color: #f8d7da; color: #721c24; }
        .request { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .url { font-family: monospace; background-color: #f5f5f5; padding: 5px; border-radius: 3px; }
        .section { margin-bottom: 20px; }
        .header-item, .body-item { margin: 5px 0; font-size: 14px; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${data.info?.name || "Postman Collection"}</h1>
      <p><strong>Collection ID:</strong> ${data.info?._postman_id || "N/A"}</p>
  `;

  if (data.item && data.item.length > 0) {
    html += "<h2>API Requests</h2>";
    data.item.forEach((item) => {
      const method = item.request?.method || "UNKNOWN";
      const methodClass = method.toLowerCase();
      const url =
        item.request?.url?.raw || item.request?.url?.host?.join("/") || "N/A";

      html += `
        <div class="request">
          <h3>${item.name}</h3>
          <div class="section">
            <span class="method ${methodClass}">${method}</span>
            <span class="url">${url}</span>
          </div>
      `;

      if (item.request?.header?.length) {
        html += '<div class="section"><h4>Headers</h4>';
        item.request.header.forEach((header) => {
          html += `<div class="header-item"><strong>${header.key}:</strong> ${header.value}</div>`;
        });
        html += "</div>";
      }

      if (item.request?.body) {
        html += '<div class="section"><h4>Request Body</h4>';
        html += `<pre>${
          item.request.body.raw || JSON.stringify(item.request.body, null, 2)
        }</pre>`;
        html += "</div>";
      }

      html += "</div>";
    });
  }

  html += "</body></html>";
  return html;
}

function generateSwaggerHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.info?.title || "API Documentation"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
        .get { background-color: #d4edda; color: #155724; }
        .post { background-color: #cce5ff; color: #004085; }
        .put { background-color: #fff3cd; color: #856404; }
        .delete { background-color: #f8d7da; color: #721c24; }
        .endpoint { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .path { font-family: monospace; background-color: #f5f5f5; padding: 5px; border-radius: 3px; }
        .section { margin-bottom: 15px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f5f5f5; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
        .server { background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <h1>${data.info?.title || "API Documentation"}</h1>
      <p><strong>Version:</strong> ${data.info?.version || "N/A"}</p>
      ${data.info?.description ? `<p>${data.info.description}</p>` : ""}
  `;

  if (data.servers?.length) {
    html += "<h2>Servers</h2>";
    data.servers.forEach((server) => {
      html += `
        <div class="server">
          <strong>${server.url}</strong>
          ${
            server.description ? `<br><small>${server.description}</small>` : ""
          }
        </div>
      `;
    });
  }

  if (data.paths) {
    html += "<h2>Endpoints</h2>";
    Object.entries(data.paths).forEach(([path, methods]) => {
      html += `<div class="endpoint"><h3 class="path">${path}</h3>`;

      Object.entries(methods).forEach(([method, details]) => {
        const methodClass = method.toLowerCase();
        html += `
          <div class="section">
            <span class="method ${methodClass}">${method.toUpperCase()}</span>
            <strong>${details.summary || "No summary"}</strong>
            ${details.description ? `<p>${details.description}</p>` : ""}
        `;

        if (details.parameters?.length) {
          html +=
            "<h4>Parameters</h4><table><tr><th>Name</th><th>Type</th><th>Location</th><th>Required</th></tr>";
          details.parameters.forEach((param) => {
            html += `<tr><td>${param.name}</td><td>${
              param.schema?.type || "string"
            }</td><td>${param.in}</td><td>${
              param.required ? "Yes" : "No"
            }</td></tr>`;
          });
          html += "</table>";
        }

        if (details.responses) {
          html += "<h4>Responses</h4>";
          Object.entries(details.responses).forEach(([code, response]) => {
            html += `<div><strong>${code}</strong>: ${response.description}</div>`;
          });
        }

        html += "</div>";
      });
      html += "</div>";
    });
  }

  if (data.components?.schemas) {
    html += "<h2>Data Models</h2>";
    Object.entries(data.components.schemas).forEach(([name, schema]) => {
      html += `
        <div class="endpoint">
          <h3>${name}</h3>
          <pre>${JSON.stringify(schema, null, 2)}</pre>
        </div>
      `;
    });
  }

  html += "</body></html>";
  return html;
}

function generateGenericJSONHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${fileName || "Data Structure"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .section { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${fileName || "Data Structure"}</h1>
  `;

  Object.entries(data).forEach(([key, value]) => {
    html += `
      <div class="section">
        <h3>${key}</h3>
        ${Array.isArray(value) ? `<p>Array with ${value.length} items</p>` : ""}
        <pre>${JSON.stringify(value, null, 2)}</pre>
      </div>
    `;
  });

  html += "</body></html>";
  return html;
}
