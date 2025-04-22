import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import "./JobListingDashoard.css";

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

  // ✅ Fetch jobs from API or use mock data
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          limit: "25",
          offset: "0",
          title_filter: "Data Engineer",
          location_filter: "United States"
        }).toString();

        const res = await fetch(`https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h?${query}`, {
          method: "GET",
          headers: {
            "x-rapidapi-key": "1db3b570dfmsh7b6ece564aa6dc2p17f771jsnf5c2e26b7c14",
            "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com"
          }
        });

        if (!res.ok) throw new Error("API quota exceeded");
        const json = await res.json();

        const jobList = Array.isArray(json) ? json : json?.data || [];

        const uniqueJobs = [];
        const seen = new Set();
        for (const job of jobList) {
          const key = `${job.title}-${job.organization}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
          }
        }

        setAllJobs(uniqueJobs);
        setJobs(uniqueJobs);
      } catch (error) {
        console.warn("Falling back to mock data:", error.message);
        setAllJobs(mockJobs);
        setJobs(mockJobs);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

