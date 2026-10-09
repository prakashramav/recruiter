import React, { useState } from 'react';
import { useRecruiterJobs } from '../../hooks/useJobs';
import { JobCard } from '../jobs/JobCard';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { PostJobModal } from './PostJobModal';

export const RecruiterJobsList = () => {
  const { data, isLoading, error } = useRecruiterJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center">Loading jobs...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error loading jobs</div>;

  const jobs = data?.data || [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          You haven't posted any jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} isRecruiter={true} />
          ))}
        </div>
      )}

      <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
