import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(null)
  const param = useParams()

  useEffect(() => {
    loadResume()
  })

  const loadResume = async () => {
    const res = await fetch(`http://localhost:4000/api/resumes/${param.id}`, {
      method: 'GET',
    })
    
    const result = await res.json()
    const url = result.path

    console.log(url)

    setResumeUrl(`http://localhost:4000/${url}`)
  }
  
  return (
    <>
      <div className="upload-resume-container">
        {resumeUrl && <a href={resumeUrl} width="100%" height="500px" title="Resume Preview" className="resume-link">View this person's resume</a>}
      </div>
    </>
  )
}

export default Resume