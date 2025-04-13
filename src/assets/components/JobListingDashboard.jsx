import React, {useState, useEffect } from "react";
import JobCard from "./JobCard";
import "/Users/janhiong/Downloads/referral/referral/src/assets/components/JobListingDashoard.css";

const JobListingDashboard = ({ filter }) => {
    const [jobs, setJobs ] = useState([]);

    //Mock Job Data
    const allJobs = [
        { id: 1, company: "Seagate", title: "Data Science Intern", location: "Longmont, CO", salary: "$20/hr - $30/hr", experience: "Internship", workModel: "Onsite" },
        { id: 1, company: "Seagate", title: "Data Science Intern", location: "Longmont, CO", salary: "$20/hr - $30/hr", experience: "Internship", workModel: "Onsite" },
        { id: 1, company: "Seagate", title: "Data Science Intern", location: "Longmont, CO", salary: "$20/hr - $30/hr", experience: "Internship", workModel: "Onsite" }
    ];

    useEffect(() => {
        let filteredJobs = allJobs;
        if (filter.company) {
            filteredJobs = filteredJobs.filter(job => job.company.toLowerCase().includes(filter.company.toLowerCase()));
        } 
        if (filter.jobTitle) {
            filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(filter.jobTitle.toLowerCase()));
        }
        if (filter.location) {
            filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(filter.location.toLowerCase()));
        }
        if (filter.experienceLevel) {
            filteredJobs = filteredJobs.filter(job => job.experience.toLowerCase().includes(filter.experienceLevel.toLowerCase()));
        }
          if (filter.salaryRange) {
            filteredJobs = filteredJobs.filter(job => job.salary.toLowerCase().includes(filter.salaryRange.toLowerCase()));
        }

        setJobs(filteredJobs);
    }, [filter]);

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Job Listings</h1>
            <div className="mt-4">
                {jobs.length === 0 ? (
                    <p>No jobs found based on your filteres.</p>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
};

export default JobListingDashboard;