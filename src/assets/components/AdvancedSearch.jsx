import React, { useState } from "react";
import Select from "react-select";
import "./AdvancedSearch.css"; // Ensure CSS is imported

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
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [jobTitle, setJobTitle] = useState(null);
  const [availability, setAvailability] = useState(null);

  const handleSearch = () => {
    onSearch({ name, date, jobTitle, availability, company });
  };

  return (
    <div className="advanced-search-container">
      <div className="search-container">

        <div className="search-fields">
          <input
            type="text"
            placeholder="Type to search..."
            value={name}
            onChange={(e) => setName(e.target.value)}
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