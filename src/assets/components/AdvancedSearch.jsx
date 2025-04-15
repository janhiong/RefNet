import React, { useState } from "react";
import Select from "react-select";
import "./AdvancedSearch.css"; // Ensure CSS is imported

// Options for the filters
const companyOptions = [
  { value: "google", label: "Google" },
  { value: "microsoft", label: "Microsoft" },
  { value: "amazon", label: "Amazon" },
  { value: "facebook", label: "Facebook" },
  { value: "apple", label: "Apple" },
  { value: "netflix", label: "Netflix" },
];

const jobFunctionOptions = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
];

const jobTitleOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "full-stack developer", label: "Full-stack Developer" },
  { value: "software engineer", label: "Software Engineer" },
  { value: "data analyst", label: "Data Analyst" },
  { value: "data scientist", label: "Data Scientist" },
];

const workModelOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
];

const locationOptions = [
  { value: "new-york", label: "New York" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "boston", label: "Boston" },
  { value: "remote", label: "Remote" },
];

const experienceLevelOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "director", label: "Director" },
];

const salaryRangeOptions = [
  { value: "0-50000", label: "$0 - $50,000" },
  { value: "50000-100000", label: "$50,000 - $100,000" },
  { value: "100000-150000", label: "$100,000 - $150,000" },
  { value: "150000-200000", label: "$150,000 - $200,000" },
  { value: "200000+", label: "$200,000+" },
];

const datePostedOptions = [
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "all-time", label: "All Time" },
];

const AdvancedSearch = ({ onSearch }) => {
  const [company, setCompany] = useState(null);
  const [jobFunction, setJobFunction] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [workModel, setWorkModel] = useState(null);
  const [location, setLocation] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [salaryRange, setSalaryRange] = useState(null);
  const [datePosted, setDatePosted] = useState(null);

  const handleSearch = () => {
    // Pass all the selected filter options to the parent
    onSearch({
      company,
      jobFunction,
      jobTitle,
      workModel,
      location,
      experienceLevel,
      salaryRange,
      datePosted,
    });
  };

  return (
    <div className="advanced-search-container">
      <div className="search-container">
        <div className="search-fields">
          {/* Company Filter */}
          <Select
            className="react-select-container"
            options={companyOptions}
            placeholder="Select Company"
            value={company}
            onChange={setCompany}
          />

          {/* Job Function Filter */}
          <Select
            className="react-select-container"
            options={jobFunctionOptions}
            placeholder="Select Job Function"
            value={jobFunction}
            onChange={setJobFunction}
          />

          {/* Job Title Filter */}
          <Select
            className="react-select-container"
            options={jobTitleOptions}
            placeholder="Select Job Title"
            value={jobTitle}
            onChange={setJobTitle}
          />

          {/* Work Model Filter */}
          <Select
            className="react-select-container"
            options={workModelOptions}
            placeholder="Select Work Model"
            value={workModel}
            onChange={setWorkModel}
          />

          {/* Location Filter */}
          <Select
            className="react-select-container"
            options={locationOptions}
            placeholder="Select Location"
            value={location}
            onChange={setLocation}
          />

          {/* Experience Level Filter */}
          <Select
            className="react-select-container"
            options={experienceLevelOptions}
            placeholder="Select Experience Level"
            value={experienceLevel}
            onChange={setExperienceLevel}
          />

          {/* Salary Range Filter */}
          <Select
            className="react-select-container"
            options={salaryRangeOptions}
            placeholder="Select Salary Range"
            value={salaryRange}
            onChange={setSalaryRange}
          />

          {/* Date Posted Filter */}
          <Select
            className="react-select-container"
            options={datePostedOptions}
            placeholder="Select Date Posted"
            value={datePosted}
            onChange={setDatePosted}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
