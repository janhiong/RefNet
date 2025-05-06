import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import AdvancedSearch from "./AdvancedSearch";
import JobListingDashboard from "./JobListingDashboard";

const JobListingPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [filters, setFilters] = useState({});

  return (
    <div>
      <JobListingDashboard filter={filters} />
    </div>
  );
};

export default JobListingPage;
