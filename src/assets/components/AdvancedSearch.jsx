import React, { useState } from "react";
import Select from "react-select";
import "./AdvancedSearch.css"; // Ensure CSS is imported

const companyOptions = [
  { value: "google", label: "Google" },
  { value: "microsoft", label: "Microsoft" },
  { value: "amazon", label: "Amazon" },
  { value: "facebook", label: "Facebook" },
  { value: "apple", label: "Apple" },
  { value: "netflix", label: "Netflix" },
];

const jobOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "full-stack developer", label: "Full-stack Developer" },
  { value: "software engineer", label: "Software Engineer" },
  { value: "data analyst", label: "Data Analyst" },
  { value: "data scientist", label: "Data Scientist" },
];

const availabilityOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "internship", label: "Internship" },
];

const AdvancedSearch = ({ onSearch }) => {
  const [company, setCompany] = useState(null);
  const [date, setDate] = useState("");
  const [jobTitle, setJobTitle] = useState(null);
  const [availability, setAvailability] = useState(null);

  const handleSearch = () => {
    onSearch({ company, date, jobTitle, availability });
  };

  return (
    <div className="advanced-search-container">
      <div className="search-container">
        <div className="search-fields">
          <Select
            className="react-select-container"
            options={companyOptions}
            placeholder="Select Company"
            value={company}
            onChange={setCompany}
          />

          <input
            type="date"
            placeholder="Select Availability"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select
            className="react-select-container"
            options={jobOptions}
            placeholder="Select Job Title"
            value={jobTitle}
            onChange={setJobTitle}
          />

          <Select
            className="react-select-container"
            options={availabilityOptions}
            placeholder="Select Type of Job"
            value={availability}
            onChange={setAvailability}
          />
        </div>

        <div className="search-button-container">
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
