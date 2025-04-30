import { useState, useEffect } from "react"
import "./UploadResume.css"

const UploadResume = () => {
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarPreviewURL, setAvatarPreviewURL] = useState(null)

  const [file, setFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)

  const [user, setUser] = useState(null)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
  const [avatarUploadSuccessMessage, setAvatarUploadSuccessMessage] = useState('')

  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
  }, [])

  useEffect(() => {
    loadResume()
    loadAvatar()
  })

  const loadAvatar = async () => {
    try {
      const userToken = localStorage.getItem("token")
      if (userToken) {
        const res = await fetch('http://localhost:4000/api/avatar', {
          method: 'GET',
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
        const res = await fetch('http://localhost:4000/api/resume', {
          method: 'GET',
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

  const handleResumeChange = (event) => {
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

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setAvatarFile(selectedFile)

      const fileUrl = URL.createObjectURL(selectedFile)
      setPreviewURL(fileUrl)
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
        
        const res = await fetch('http://localhost:4000/api/resume', {
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
    e.preventDefault()

    if (avatarFile) {
      const userToken = localStorage.getItem("token")
      if (!userToken) {
        alert("You are not logged in!")
        return
      }
      try {
        const data = new FormData()
        data.append('image', avatarFile)
        
        const res = await fetch('http://localhost:4000/api/avatar', {
          method: 'POST',
          body: data,
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })

        const result = await res.json()
        const url = result.path
        
        setAvatarUrl(`./${url}`)
        setAvatarUploadSuccessMessage('* Upload Successful')

        setTimeout(() => {
          setAvatarUploadSuccessMessage('')
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

  return (
    <>
      <div className="upload-resume-container">
        <div className="pfp-container">
          <img
            src={avatarUrl ? avatarUrl : "./images/default-avatar.jpg"}
            alt="User Avatar"
            className="pfp-avatar"
          />
        </div>
        <div>
          <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatarChange} />
          <button onClick={handleAvatarSubmit} className="upload-resume-btn">Submit</button>
          {avatarUploadSuccessMessage && (
            <p className="upload-success-label">{avatarUploadSuccessMessage}</p>
          )}
          {!user && <p className="login-to-view-resume-label"> * Please log in to view your resume</p>}
        </div>

        <p className="upload-resume-title">Upload Your Resume</p>
        <p className="upload-resume-label">Select a PDF or DOCX file to showcase your experience.</p>
        
        <div>
          <input type="file" accept=".pdf,.docx" onChange={handleResumeChange} />
          <button onClick={handleResumeSubmit} className="upload-resume-btn">Submit</button>
          {uploadSuccessMessage && (
            <p className="upload-success-label">{uploadSuccessMessage}</p>
          )}
          {!user && <p className="login-to-view-resume-label"> * Please log in to view your resume</p>}
        </div>

        <div className="resume-button-container">
          {(user && resumeUrl) && <a href={resumeUrl} width="100%" height="500px" title="Resume Preview" className="resume-link">View Current Resume</a>}
          {(user && !resumeUrl) && <p>You currently have no resume uploaded.</p>}
        </div>
      </div>
    </>
  )
}

export default UploadResume
