import { useState, useEffect } from "react"
import "./UploadResume.css"

const UploadResume = () => {
  const [file, setFile] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [user, setUser] = useState(null)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')


  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
  }, [])

  useEffect(() => {
    loadResume()
  })
  
  const loadAvatar = async () => {
    try {
      const userToken = localStorage.getItem("token")
      if (userToken) {
        const res = await fetch('http://localhost:4000/api/my-avatar', {
          method: 'POST',
          body: userToken,
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        })

        const result = await res.json()
        const url = result.path
        
        setAvatarUrl(`./${url}`)
      }
    }
    catch(error) {
      console.log("User does not have an avatar")
    }
  }

  const loadResume = async () => {
    try {
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
    catch (error) {
      console.log("User does not have a resume")
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)

      if (selectedFile.type === "application/pdf") {
        const fileURL = URL.createObjectURL(selectedFile)
        setPreviewURL(fileURL)
      } else {
        setPreviewURL(null)
      }
    }
  }

  const handleResumeSubmit = async (e) => {
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
        setUploadSuccessMessage('* Upload Successful')

        setTimeout(() => {
          setUploadSuccessMessage('')
        }, 5000)
      }

      catch (err)
      {
        console.log(err)
      }
    
    }
    else {
      alert("Please select a file first!")
    }
  }

  const handleAvatarSubmit = async (e) => {
    
  }


  return (
    <>
      <div className="upload-resume-container">
        <div className="pfp-container">
          <img
            src="./images-pfps/default-avatar.jpg"
            alt=""
            className="pfp-avatar"
          />
        </div>
        <div>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          <button onClick={handleAvatarSubmit} className="upload-resume-btn">Submit</button>
          {!user && <p className="login-to-view-resume-label"> * Please log in to view your resume</p>}
        </div>
        <p className="upload-resume-title">Upload Your Resume</p>
        <p className="upload-resume-label">Select a PDF or DOCX file to showcase your experience.</p>
        
        <div>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          <button onClick={handleResumeSubmit} className="upload-resume-btn">Submit</button>
          {!user && <p className="login-to-view-resume-label"> * Please log in to view your resume</p>}
        </div>
        <div className="resume-button-container">
          {uploadSuccessMessage && <p className="upload-success-label">{uploadSuccessMessage}</p>}
          {(user && resumeUrl) && <a href={resumeUrl} width="100%" height="500px" title="Resume Preview" className="resume-link">View Current Resume</a>}
          {(user && !resumeUrl) && <p>You currently have no resume uploaded.</p>}
        </div>
      </div>
    </>
  )
}

export default UploadResume