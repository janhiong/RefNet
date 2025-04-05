import React, { useState } from "react";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [textExtract, setTextExtract] = useState("")
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Generate preview URL for PDF files
      if (selectedFile.type === "application/pdf") {
        const fileURL = URL.createObjectURL(selectedFile);
        setPreviewURL(fileURL);
      } else {
        setPreviewURL(null);
      }
    }
  };

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData()

      formData.append("pdfFile",file)

      fetch("http://localhost:4000/api/extract-text", {
        method: "post",
        body: formData
      })
      .then(res => {
        return res.text()
      })
      .then(extractedText => {
        setTextExtract(extractedText)
        console.log(textExtract)
      })

    } else {
      alert("Please select a file first!");
    }
  };

  return (
    <div className="upload-resume-container">
      <h2>Upload Your Resume</h2>
      <p>Select a PDF or DOCX file to showcase your experience.</p>
      
      {/* File Input */}
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>

      {/* Display Uploaded Resume */}
      {file && (
        <div className="resume-preview">
          <h3>Uploaded Resume: {file.name}</h3>
          {previewURL ? (
            <iframe
              src={previewURL}
              width="100%"
              height="500px"
              title="Resume Preview"
            ></iframe>
          ) : (
            <p>(Preview not available for this file type)</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResume;
