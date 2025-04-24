import React, { useState } from "react";
import Select from "react-select";
import "./AdvancedSearch.css";

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
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [workModel, setWorkModel] = useState(null);
  const [location, setLocation] = useState(null);
  const [datePosted, setDatePosted] = useState(null);

  const handleSearch = () => {
    const filters = {
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      workModel: workModel?.value || "",
      location: location?.value || "",
      datePosted: datePosted?.value || ""
    };

    onSearch(filters);
  };

  return (
    <div className="advanced-search-container">
      <div className="search-fields">
        <input
          type="text"
          placeholder="Enter Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <Select
          options={workModelOptions}
          placeholder="Select Work Model"
          value={workModel}
          onChange={setWorkModel}
        />
        <Select
          options={locationOptions}
          placeholder="Select Location"
          value={location}
          onChange={setLocation}
        />
        <Select
          options={datePostedOptions}
          placeholder="Date Posted"
          value={datePosted}
          onChange={setDatePosted}
        />
      </div>
    </div>
  );
};

export default AdvancedSearch;