import React, { useState } from "react";
import Select from "react-select";
import "./AdvancedSearch.css";

const companyOptions = [
  { value: "lensa", label: "Lensa" },
  { value: "google", label: "Google" },
  { value: "microsoft", label: "Microsoft" },
  { value: "amazon", label: "Amazon" }
];

const jobTitleOptions = [
  { value: "data engineer", label: "Data Engineer" },
  { value: "software engineer", label: "Software Engineer" },
  { value: "data scientist", label: "Data Scientist" }
];

const workModelOptions = [
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "CONTRACTOR", label: "Contractor" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" }
];

const locationOptions = [
  { value: "new york", label: "New York" },
  { value: "california", label: "California" },
  { value: "remote", label: "Remote" },
  { value: "texas", label: "Texas" }
];

const datePostedOptions = [
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "all-time", label: "All Time" }
];

const AdvancedSearch = ({ onSearch }) => {
  const [company, setCompany] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [workModel, setWorkModel] = useState(null);
  const [location, setLocation] = useState(null);
  const [datePosted, setDatePosted] = useState(null);

  const handleSearch = () => {
    const filters = {
      company: company?.value || "",
      jobTitle: jobTitle?.value || "",
      workModel: workModel?.value || "",
      location: location?.value || "",
      datePosted: datePosted?.value || ""
    };

    onSearch(filters);
  };

  return (
    <div className="advanced-search-container">
      <div className="search-fields">
        <Select options={companyOptions} placeholder="Select Company" value={company} onChange={setCompany} />
        <Select options={jobTitleOptions} placeholder="Select Job Title" value={jobTitle} onChange={setJobTitle} />
        <Select options={workModelOptions} placeholder="Select Work Model" value={workModel} onChange={setWorkModel} />
        <Select options={locationOptions} placeholder="Select Location" value={location} onChange={setLocation} />
        <Select options={datePostedOptions} placeholder="Date Posted" value={datePosted} onChange={setDatePosted} />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
