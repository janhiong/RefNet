import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import axios from "axios";
import "./JobListingDashoard.css";
import.meta.env.VITE_RAPIDAPI_KEY

// ✅ Mock data in case API fails
const mockJobs = [
  {
    id: 1,
    title: "Data Engineer",
    organization: "Lensa",
    locations_derived: ["New York"],
    employment_type: ["Full-Time"],
    date_posted: "2024-04-10"
  },
  {
    id: 2,
    title: "Software Engineer",
    organization: "Google",
    locations_derived: ["California"],
    employment_type: ["Remote"],
    date_posted: "2024-04-09"
  },
  {
    id: 3,
    title: "Data Scientist",
    organization: "Amazon",
    locations_derived: ["Texas"],
    employment_type: ["Hybrid"],
    date_posted: "2024-04-05"
  }
];

const JobListingDashboard = ({ filter = {} }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryParams = {
          query: filter.jobTitle || "software developer",
          page: "1",
          num_pages: "1",
          country: "us"
        };

        if (filter.datePosted === "last-7-days") {
          queryParams.date_posted = "7days";
        } else if (filter.datePosted === "last-30-days") {
          queryParams.date_posted = "30days";
        }

        if (filter.location && filter.location.toLowerCase() !== "remote") {
          queryParams.query = `${queryParams.query} in ${filter.location}`;
        }

        const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
          params: queryParams,
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
          }
        });

        const jobList = response.data.data || [];

        const uniqueJobs = [];
        const seen = new Set();
        for (const job of jobList) {
          const key = `${job.job_title}-${job.employer_name}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push({
              id: job.job_id,
              title: job.job_title,
              organization: job.employer_name,
              url: job.job_apply_link,
              organization_logo: job.employer_logo,
              locations_derived: [job.job_city || "N/A"],
              employment_type: [job.job_employment_type || "N/A"],
              date_posted: job.job_posted_at_datetime_utc
            });
          }
        }

        setAllJobs(uniqueJobs);
        setJobs(uniqueJobs);
        setApiError(false);
      } catch (error) {
        console.warn("API error:", error.message);
        setAllJobs(mockJobs);
        setJobs(mockJobs);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filter]);

  // ✅ Apply filters
  useEffect(() => {
    if (!Array.isArray(allJobs)) return;

    let filteredJobs = [...allJobs];

    if (filter.company) {
      filteredJobs = filteredJobs.filter((job) =>
        job.organization?.toLowerCase().includes(filter.company.toLowerCase())
      );
    }
    if (filter.jobTitle) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title?.toLowerCase().includes(filter.jobTitle.toLowerCase())
      );
    }
    if (filter.location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.locations_derived?.[0]?.toLowerCase().includes(filter.location.toLowerCase())
      );
    }
    if (filter.workModel) {
      filteredJobs = filteredJobs.filter((job) =>
        job.employment_type?.[0]?.toLowerCase().includes(filter.workModel.toLowerCase())
      );
    }
    if (filter.datePosted === "last-7-days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filteredJobs = filteredJobs.filter((job) => {
        const jobDate = new Date(job.date_posted);
        return jobDate >= sevenDaysAgo;
      });
    }

    setJobs(filteredJobs);
  }, [filter, allJobs]);

  return (
    <div className="job-listing-dashboard">
      <h1>Job Listings</h1>
      {apiError && (
        <p className="notice">⚠️ Showing mock job data due to API limit.</p>
      )}
      {loading ? (
        <p className="loading">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="no-results">No jobs found based on your filters.</p>
      ) : (
        <div className="results-container">
          {jobs.map((job) => (
            <JobCard key={`${job.id}-${job.locations_derived?.[0]}`} {...job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListingDashboard;

