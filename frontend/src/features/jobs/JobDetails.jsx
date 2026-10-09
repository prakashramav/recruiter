import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob } from '../../hooks/useJobs';
import { useMyApplications } from '../../hooks/useApplications';
import { useAuthContext } from '../../context/AuthContext';
import { ApplyModal } from '../applications/ApplyModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MapPin, Building, DollarSign, Clock, Briefcase, Calendar, GraduationCap, CheckCircle2, ArrowLeft } from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: jobData, isLoading: isLoadingJob, error } = useJob(id);
  
  // Fetch applied jobs for the current user to check if they've already applied
  const { data: myApplications } = useMyApplications(user?.role === 'applicant');
  const hasApplied = useMemo(() => {
    if (!myApplications?.data) return false;
    return myApplications.data.some(app => (app.job?._id || app.job) === id);
  }, [myApplications, id]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsApplyModalOpen(true);
  };

  if (isLoadingJob) {
    return <div className="container mx-auto py-12 text-center">Loading job details...</div>;
  }

  if (error || !jobData?.data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Job not found</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const job = jobData.data;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate('/jobs')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
      </Button>

      {/* Header Section */}
      <div className="bg-card border rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
            <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-4 mb-4">
              <span className="flex items-center gap-1 font-medium text-foreground"><Building className="h-4 w-4" /> {job.company}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location || 'Location not specified'}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.workMode || 'Work mode not specified'}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.experienceLevel || 'Experience not specified'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">{job.employmentType || job.jobType}</Badge>
              {job.salaryMin && (
                <Badge variant="outline" className="text-sm px-3 py-1 border-primary/20 text-primary bg-primary/5">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {job.salaryMin.toLocaleString()}{job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ''} {job.salaryCurrency || 'INR'} /yr
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {user?.role === 'recruiter' ? (
              <Button onClick={() => navigate(`/recruiter/jobs/${job._id}`)} className="w-full">
                Manage Applicants
              </Button>
            ) : hasApplied ? (
              <Button disabled variant="outline" className="w-full text-green-600 border-green-600 bg-green-50/50 opacity-100 font-medium py-6">
                <CheckCircle2 className="h-5 w-5 mr-2" /> You have applied
              </Button>
            ) : job.status === 'Closed' ? (
              <Button disabled variant="outline" className="w-full text-red-600 border-red-600 bg-red-50/50 opacity-100 font-medium py-6">
                <CheckCircle2 className="h-5 w-5 mr-2" /> Applications Closed
              </Button>
            ) : (
              <Button onClick={handleApplyClick} className="w-full py-6 text-lg font-medium shadow-md">
                Apply Now
              </Button>
            )}
            {job.applicationDeadline && (
              <p className="text-xs text-center text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                Apply before {new Date(job.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">About the Role</h2>
            <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Key Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                {job.responsibilities.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-muted/30 border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Job Overview</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Experience Required</p>
                <p className="font-medium">
                  {job.minExperience !== undefined ? `${job.minExperience}${job.maxExperience ? ` - ${job.maxExperience}` : '+'} Years` : 'Not specified'}
                </p>
              </div>
              
              {job.education && job.education.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Education</p>
                  <p className="font-medium flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {job.education.join(', ')}
                  </p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground mb-1">Openings</p>
                <p className="font-medium">{job.openings || 1} vacancy</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Posted On</p>
                <p className="font-medium">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-muted/30 border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="font-normal">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-muted/30 border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2 text-sm">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ApplyModal 
        jobId={id} 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
      />
    </div>
  );
};
