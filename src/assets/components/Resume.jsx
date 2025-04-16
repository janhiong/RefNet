import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(null)
  const param = useParams()

  useEffect(() => {
    loadResume()
    console.log(param.id)
  })

  const loadResume = async () => {
    const res = await fetch(`http://localhost:4000/api/resumes/${param.id}`, {
      method: 'GET',
    })
    
    const result = await res.json()
    const url = result.path

    setResumeUrl(`./${url}`)
  }
  
  return (
    <>
      <div className="">
        <iframe src={resumeUrl} width="100%" height="500px" title="Resume Preview"></iframe>
      </div>
    </>
  )
}

export default Resume