import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import "./JobListingDashoard.css";

const JobListingDashboard = ({ filter }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch jobs from API
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

        const json = await res.json();
        console.log("Jobs:", json);

        // ✅ Handle array or object API formats
        const jobList = Array.isArray(json) ? json : json?.data || [];

        // ✅ Optional: remove duplicates by title + organization
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
        console.error("API fetch failed:", error);
        setAllJobs([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Apply filters when `filter` or `allJobs` changes
  useEffect(() => {
    if (!Array.isArray(allJobs)) return;

    let filtered = [...allJobs];

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
      filteredJobs = filteredJobs.filter((job) => {
        const jobDate = new Date(job.date_posted);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return jobDate >= sevenDaysAgo;
      });
    }    

    setJobs(filtered);
  }, [filter, allJobs]);

  return (
    <div className="job-listing-dashboard">
      <h1>Job Listings</h1>
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
