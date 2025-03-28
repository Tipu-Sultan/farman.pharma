"use client";
import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cloud", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFileUrl(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} className="p-2 bg-blue-500 text-white rounded">
        Upload
      </button>

      {fileUrl && (
        <div className="mt-4">
          <p>Uploaded File:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View / Download
          </a>

          {/* Preview for PDF */}
          {file?.type === "application/pdf" && (
            <iframe src={fileUrl} width="100%" height="500px"></iframe>
          )}

          {/* Preview for DOC/PPT using Google Docs Viewer */}
          {(file?.type.includes("word") || file?.type.includes("presentation")) && (
            <iframe
              src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
              width="100%"
              height="500px"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}
