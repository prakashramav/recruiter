import React, { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { Input } from '../../components/ui/Input';
import { Search, MapPin } from 'lucide-react';
import { ApplyModal } from '../applications/ApplyModal';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMyApplications } from '../../hooks/useApplications';

export const JobsList = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  // Basic search filter; could be debounced or expanded
  const { data, isLoading, error } = useJobs({ search, location, employmentType });
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Fetch applied jobs for the current user (only if they are an applicant)
  const { data: myApplications } = useMyApplications(user?.role === 'applicant');
  const appliedJobIds = React.useMemo(() => {
    if (!myApplications?.data) return new Set();
    return new Set(myApplications.data.map(app => app.job?._id || app.job));
  }, [myApplications]);

  const handleApplyClick = (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedJobId(jobId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col mb-8 gap-4 bg-muted/30 p-6 rounded-xl border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find your next job</h1>
          <p className="text-muted-foreground mt-1">Browse thousands of job openings.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by role or title..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Location (e.g. Remote, City)" 
              className="pl-9 bg-background"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex-1 md:max-w-xs">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>}
      
      {error && <p className="text-destructive text-center py-8">Error loading jobs: {error.message}</p>}
      
      {data?.data?.jobs && (
        <>
          {data.data.jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No jobs found matching your criteria.
            </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.jobs.map(job => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    onApply={handleApplyClick} 
                    hasApplied={appliedJobIds.has(job._id)}
                  />
                ))}
              </div>
          )}
        </>
      )}

      {selectedJobId && (
        <ApplyModal 
          jobId={selectedJobId} 
          isOpen={!!selectedJobId} 
          onClose={() => setSelectedJobId(null)} 
        />
      )}
    </div>
  );
};
