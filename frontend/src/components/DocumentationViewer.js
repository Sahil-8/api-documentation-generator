import React, { useState } from "react";

export default function DocumentationViewer({ parsedDocs }) {
  const [expandedEndpoints, setExpandedEndpoints] = useState({});

  // 🔹 NEW: function to trigger PDF download
  const downloadPDF = async () => {
    try {
      const response = await fetch("/upload/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // keep if auth is enabled
        },
        body: JSON.stringify({
          parsedData: parsedDocs,
          fileName: "api-documentation",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "api-documentation.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Could not generate PDF");
    }
  };

  if (!parsedDocs) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Documentation</h2>

        {/* 🔹 NEW: Download button */}
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* 🔹 Everything below is your existing code */}
      {typeof parsedDocs === "string" ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedDocs }}
        />
      ) : parsedDocs.info &&
        parsedDocs.info.schema &&
        parsedDocs.info.schema.includes("postman") ? (
        // 📦 Postman rendering (your existing code here)
        <div>{/* ... unchanged ... */}</div>
      ) : parsedDocs.openapi || parsedDocs.swagger ? (
        // 📘 Swagger/OpenAPI rendering (your existing code here)
        <div>{/* ... unchanged ... */}</div>
      ) : (
        // 🧾 Generic JSON rendering (your existing code here)
        <div>{/* ... unchanged ... */}</div>
      )}
    </div>
  );
}
