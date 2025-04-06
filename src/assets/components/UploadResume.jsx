import React, { useState, useEffect } from "react";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [textExtract, setTextExtract] = useState("")
  const [previewURL, setPreviewURL] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null)

  useEffect(() => {

  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (file) {
      try {
        const data = new FormData()

        data.append('image',file)
        
        const res = await fetch('http://localhost:4000/api/upload-resume', {
          method: 'POST',
          body: data,
        })

        const result = await res.json()
        const url = result.path
        
        setResumeUrl(`./${url}`)
      }
      catch (err) {
        console.log(err)
      }
    
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
      
      {/* {file && (
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
      )} */}

      <div className="">
        <iframe src={resumeUrl} width="100%" height="500px" title="Resume Preview"></iframe>
      </div>

    </div>
  );
};

export default UploadResume;
