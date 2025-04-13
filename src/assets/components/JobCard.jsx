import React from "react";

const JobCard = ({ job }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <p className="text-gray-500">Company: {job.company}</p>
        <p className="text-gray-500">Location: {job.location}</p>
        <p className="text-gray-500">Salary: {job.salary}</p>
        <p className="text-gray-500">Work Model: {job.workModel}</p>
        <a href="#" className="text-blue-500 mt-2 inline-block">Apply Now</a>
    </div>
    );
};

export default JobCard;