// src/pages/Jobs.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import SearchFilters from '../components/jobs/SearchFilters';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    q: '',
    location: '',
    type: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/api/jobs', { params: searchParams });
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchParams({
      q: formData.get('query'),
      location: formData.get('location'),
      type: formData.get('type')
    });
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchFilters handleSearch={handleSearch} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onClick={() => navigate(`/jobs/${job._id}`)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-semibold">No jobs found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;