import React from "react";

const JobCard = ({
  title,
  organization,
  url,
  organization_logo,
  locations_derived,
  employment_type,
  date_posted
}) => {
  const location = locations_derived?.[0] || "N/A";
  const employment = employment_type?.join(", ") || "N/A";
  const postedDate = new Date(date_posted).toLocaleDateString();

  return (
    <div className="job-card">
      <div className="logo-title">
        {organization_logo && (
          <img src={organization_logo} alt={`${organization} logo`} width="50" height="50" />
        )}
        <div>
          <h3><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></h3>
          <p><strong>{organization}</strong></p>
        </div>
      </div>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Type:</strong> {employment}</p>
      <p><strong>Posted:</strong> {postedDate}</p>
    </div>
  );
};

export default JobCard;
