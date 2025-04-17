import { useState, useEffect } from "react";
import "./UploadResume.css"

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
  }, [])

  useEffect(() => {
    loadResume()
  })

  const loadResume = async () => {
    const userToken = localStorage.getItem("token")
    if (userToken) {
      const res = await fetch('http://localhost:4000/api/my-resume', {
        method: 'POST',
        body: userToken,
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      })

      const result = await res.json()
      const url = result.path

      setResumeUrl(`./${url}`)
    }
    else {
      console.log('User is not logged in')
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

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
      const userToken = localStorage.getItem("token")
      if (!userToken) {
        alert("You are not logged in!")
        return
      }
      try {
        const data = new FormData()
        data.append('image',file)
        
        const userToken = localStorage.getItem("token")
        const res = await fetch('http://localhost:4000/api/upload-resume', {
          method: 'POST',
          body: data,
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })

        const result = await res.json()
        const url = result.path
        
        setResumeUrl(`./${url}`)
      }
      catch (err)
      {
        console.log(err)
      }
    
    }
    else {
      alert("Please select a file first!");
    }
  };

  return (
    <>
      <div className="upload-resume-container">
        <p className="upload-resume-title">Upload Your Resume</p>
        <p className="upload-resume-label">Select a PDF or DOCX file to showcase your experience.</p>
        
        <div>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          <button onClick={handleSubmit} className="upload-resume-btn">Submit</button>
        </div>
      </div>
      <div className="resume-display-container">
        {user ? <iframe src={resumeUrl} width="100%" height="500px" title="Resume Preview"></iframe> : <p> Please Log in to view your Resume</p>}
      </div>
    </>
  );
};

export default UploadResume;
