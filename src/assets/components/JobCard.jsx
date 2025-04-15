import React from "react";

const JobCard = ({ job }) => {
    return (
      <div className="job-card">
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Work Model:</strong> {job.workModel}</p>
        <a href="#" style={{ color: "#6a0dad", fontWeight: "bold" }}>Apply Now</a>
      </div>
    );
};  

export default JobCard;