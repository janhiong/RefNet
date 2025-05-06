import { useState, useEffect } from "react"
import "./UploadResume.css"

const UploadResume = () => {
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)

  const [file, setFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
  const [avatarUploadSuccessMessage, setAvatarUploadSuccessMessage] = useState('')

  const [user, setUser] = useState(null)
  const [name, setName] = useState('Insert Name')
  const [role, setRole] = useState('Position @ Organization')
  const [bio, setBio] = useState('Insert Description Here')

  const [nameInput, setNameInput] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [bioInput, setBioInput] = useState('')

  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [showResumeUpload, setShowResumeUpload] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
    loadResume()
    loadAvatar()
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const userToken = localStorage.getItem("token")
      if (userToken) {
        const res = await fetch('http://localhost:4000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        })
        const result = await res.json()
        if (result) {
          setName(result.name)
          setRole(result.role)
          setBio(result.bio)
        }
      }
    } catch (error) {
      console.log("Error loading profile:", error.message)
    }
  }

  const saveProfile = async () => {
    if (!nameInput || !roleInput || !bioInput) {
      setShowEditProfile(false)
      return
    }

    try {
      const userToken = localStorage.getItem("token")
      if (userToken) {
        const res = await fetch('http://localhost:4000/api/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput,
            role: roleInput,
            bio: bioInput
          })
        })

        const result = await res.json()
        setName(result.name)
        setRole(result.role)
        setBio(result.bio)
        setShowEditProfile(false)
        setNameInput('')
        setRoleInput('')
        setBioInput('')
      }
    } catch (error) {
      console.log("Error saving profile:", error.message)
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
        if (result.path) {
          setResumeUrl(`./${result.path}`)
        } else {
          setResumeUrl(null)
          console.log('User has no resume')
        }
      } else {
        console.log('User is not logged in')
      }
    } catch (error) {
      console.log("Error loading resume:", error.message)
      setResumeUrl(null)
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
        data.append('image', file)

        const res = await fetch('http://localhost:4000/api/resume', {
          method: 'POST',
          body: data,
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })

        if (!res.ok) {
          throw new Error('Resume upload failed')
        }

        const result = await res.json()
        const url = result.path
        setResumeUrl(`./${url}`)
        setUploadSuccessMessage('* Upload Successful')

        setTimeout(() => {
          setUploadSuccessMessage('')
        }, 5000)
      } catch (err) {
        console.log(err)
        alert('Failed to upload resume. Please try again.')
      }
    } else {
      setShowResumeUpload(false)
      alert('No file selected for upload')
    }
  }

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
        if (result.path) {
          setAvatarUrl(`./${result.path}`)
        } else {
          setAvatarUrl(null)
          console.log('No avatar found')
        }
      }
    } catch (error) {
      console.log("Error loading avatar:", error.message)
      setAvatarUrl(null)
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

        if (!res.ok) {
          throw new Error('Avatar upload failed')
        }

        const result = await res.json()
        const url = result.path
        setAvatarUrl(`./${url}`)
        setAvatarUploadSuccessMessage('* Upload Successful')

        setTimeout(() => {
          setAvatarUploadSuccessMessage('')
        }, 5000)
      } catch (err) {
        console.log(err)
        alert('Failed to upload avatar. Please try again.')
      }
    } else {
      setShowAvatarUpload(false)
      alert('No file selected for upload')
    }
  }

  return (
    <>
      <div className="upload-resume-container">
        <div onClick={() => setShowEditProfile(!showEditProfile)} className="pencil-icon">
          {showEditProfile
            ? <i className="fa-solid fa-xmark fa-lg fa-icon"></i>
            : <i className="fa-solid fa-pencil fa-sm fa-icon"></i>}
        </div>
        {!showEditProfile &&
        <>
          <div className="profile-info-container">
            <p className="profile-name">{name}</p>
            <p className="profile-title">{role}</p>
            <p className="profile-bio">{bio}</p>
          </div>
        </>
        }
        {showEditProfile && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              className="name-input-box"
              placeholder="Name"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
            />
            <input
              className="title-input-box"
              placeholder="Title/Role"
              value={roleInput}
              onChange={e => setRoleInput(e.target.value)}
            />
            <input
              className="bio-input-box"
              placeholder="Bio"
              value={bioInput}
              onChange={e => setBioInput(e.target.value)}
            />
            <div style={{ marginTop: '10px' }}>
              <button className="save-profile-btn" onClick={saveProfile}>Save</button>
            </div>
          </div>
        )}
        <hr style={{ width: '100%', border: 'none', height: '1px', backgroundColor: '#ccc' }} />
        <div className="pfp-container">
          <img
            src={avatarUrl ? avatarUrl : "./images/default-avatar.jpg"}
            alt="User Avatar"
            className="pfp-avatar"
          />
        </div>

        <div onClick={() => setShowAvatarUpload(!showAvatarUpload)} className="pencil-icon">
          {showAvatarUpload
            ? <i className="fa-solid fa-xmark fa-lg fa-icon"></i>
            : <i className="fa-solid fa-pencil fa-lg fa-icon"></i>}
        </div>

        {showAvatarUpload && (
          <div>
            <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatarChange} />
            <button onClick={handleAvatarSubmit} className="upload-resume-btn">Submit</button>
            {avatarUploadSuccessMessage && <p className="upload-success-label">{avatarUploadSuccessMessage}</p>}
            {!user && <p className="login-to-view-resume-label"> * Please log in to view your avatar</p>}
          </div>
        )}

        <p className="upload-resume-title">Upload Your Resume</p>
        <p className="upload-resume-label">Select a PDF or DOCX file to showcase your experience.</p>

        <div onClick={() => setShowResumeUpload(!showResumeUpload)} className="pencil-icon">
          {showResumeUpload
            ? <i className="fa-solid fa-xmark fa-lg fa-icon"></i>
            : <i className="fa-solid fa-pencil fa-lg fa-icon"></i>}
        </div>

        {showResumeUpload && (
          <div>
            <input type="file" accept=".pdf,.docx" onChange={handleResumeChange} />
            <button onClick={handleResumeSubmit} className="upload-resume-btn">Submit</button>
            {uploadSuccessMessage && <p className="upload-success-label">{uploadSuccessMessage}</p>}
            {!user && <p className="login-to-view-resume-label"> * Please log in to view your resume</p>}
          </div>
        )}

        <div className="resume-button-container">
          {(user && resumeUrl) && <a href={resumeUrl} width="100%" height="500px" title="Resume Preview" className="resume-link">View Current Resume</a>}
          {(user && !resumeUrl) && <p>You currently have no resume uploaded.</p>}
        </div>
      </div>
    </>
  )
}

export default UploadResume
