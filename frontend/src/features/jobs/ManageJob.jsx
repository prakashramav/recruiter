import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useUpdateJob } from '../../hooks/useJobs';
import { useJobApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, FileText, Download, Lock, Unlock, Calendar, Activity } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import toast from 'react-hot-toast';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const ManageJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [shortlistAppId, setShortlistAppId] = useState(null);
  const [interviewLink, setInterviewLink] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const { data: jobData, isLoading: isLoadingJob } = useJob(jobId);
  const { mutate: updateJob } = useUpdateJob();
  const { data: applicationsData, isLoading: isLoadingApps } = useJobApplications(jobId);
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  if (isLoadingJob || isLoadingApps) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const job = jobData?.data;
  const applications = applicationsData?.data || [];

  if (!job) {
    return <div className="p-8 text-center text-destructive">Job not found</div>;
  }

  const handleStatusChange = (applicationId, status, link = undefined, date = undefined) => {
    updateStatus(
      { applicationId, status, interviewLink: link, interviewDate: date },
      {
        onSuccess: () => {
          toast.success(`Application marked as ${status}`);
          setShortlistAppId(null);
          setInterviewLink('');
          setInterviewDate('');
        },
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const handleToggleJobStatus = () => {
    const newStatus = job.status === 'Closed' ? 'Published' : 'Closed';
    updateJob(
      { id: jobId, jobData: { status: newStatus } },
      {
        onSuccess: () => toast.success(`Job marked as ${newStatus}`),
        onError: () => toast.error('Failed to update job status'),
      }
    );
  };

  const handleShortlistClick = (app) => {
    setShortlistAppId(app._id);
    setInterviewLink(app.interviewLink || '');
    
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    if (app.interviewDate) {
      const date = new Date(app.interviewDate);
      const formatted = date.toISOString().slice(0, 16);
      setInterviewDate(formatted);
    } else {
      setInterviewDate('');
    }
  };

  const submitShortlist = () => {
    handleStatusChange(shortlistAppId, 'Shortlisted', interviewLink, interviewDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Reviewed': return 'bg-blue-100 text-blue-800';
      case 'No Show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getFullResumeUrl = (path) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    return baseUrl + path;
  };

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" className="mb-6" onClick={() => navigate('/recruiter/jobs')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
      </Button>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            {job.status === 'Closed' && (
              <Badge variant="destructive">Closed</Badge>
            )}
          </div>
          <div className="flex gap-4 items-center text-muted-foreground">
            <span>{job.company}</span>
            <span>&bull;</span>
            <span>{job.location}</span>
            <span>&bull;</span>
            <Badge variant="secondary">{job.employmentType || job.jobType}</Badge>
          </div>
        </div>
        
        <Button 
          variant={job.status === 'Closed' ? 'outline' : 'destructive'} 
          onClick={handleToggleJobStatus}
        >
          {job.status === 'Closed' ? (
            <><Unlock className="h-4 w-4 mr-2" /> Reopen Job</>
          ) : (
            <><Lock className="h-4 w-4 mr-2" /> Close Job</>
          )}
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Applicants ({applications.length})</h2>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
          No one has applied to this job yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{app.applicant?.name || 'Unknown Applicant'}</h3>
                  <p className="text-sm text-muted-foreground">{app.applicant?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {app.atsScore !== null && app.atsScore !== undefined && (
                    <div className="mt-2 text-sm font-medium text-emerald-600 flex items-center gap-1">
                      <Activity className="h-4 w-4" /> 
                      ATS Match: {app.atsScore}%
                    </div>
                  )}
                  {app.interviewDate && app.status === 'Shortlisted' && (
                    <div className="mt-2 text-sm font-medium text-primary flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> 
                      Interview: {new Date(app.interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {app.resume ? (
                    <button 
                      onClick={() => setSelectedResumeUrl(getFullResumeUrl(app.resume))}
                      className="flex items-center text-sm text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4 mr-1" /> View Resume
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Resume</span>
                  )}
                  
                  <Badge className={`capitalize ${getStatusColor(app.status)}`} variant="outline">
                    {app.status}
                  </Badge>

                  <div className="flex flex-wrap gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleShortlistClick(app)}
                    >
                      {app.status === 'Shortlisted' ? 'Update Schedule' : 'Shortlist'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                      disabled={app.status === 'Rejected'}
                    >
                      Reject
                    </Button>
                    {app.status === 'Shortlisted' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleStatusChange(app._id, 'No Show')}
                      >
                        No Show
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resume Preview Modal */}
      <Modal 
        isOpen={!!selectedResumeUrl} 
        onClose={() => setSelectedResumeUrl(null)} 
        title="Resume Preview"
        className="max-w-4xl"
      >
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-end mb-2">
            <a 
              href={selectedResumeUrl} 
              download 
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </a>
          </div>
          <div className="w-full h-[70vh] overflow-y-auto border rounded-md bg-muted/20 flex justify-center p-4">
            {selectedResumeUrl && (
              <Document 
                file={selectedResumeUrl} 
                loading="Loading resume..."
                error={<div className="text-destructive p-4">Failed to load PDF. Please ensure the backend is running.</div>}
              >
                <Page pageNumber={1} renderTextLayer={true} renderAnnotationLayer={true} scale={1.2} />
              </Document>
            )}
          </div>
        </div>
      </Modal>
      {/* Shortlist Prompt Modal */}
      <Modal 
        isOpen={!!shortlistAppId} 
        onClose={() => { setShortlistAppId(null); setInterviewLink(''); setInterviewDate(''); }} 
        title="Schedule Interview"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can optionally provide an interview meeting link and schedule a date/time. This will be shown to the candidate on their dashboard.
          </p>
          <div className="space-y-2">
            <Label htmlFor="interviewLink">Interview Link (e.g., Calendly, Google Meet)</Label>
            <Input 
              id="interviewLink" 
              placeholder="https://..."
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interviewDate">Interview Date & Time</Label>
            <Input 
              id="interviewDate" 
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => { setShortlistAppId(null); setInterviewLink(''); setInterviewDate(''); }}>
              Cancel
            </Button>
            <Button onClick={submitShortlist}>
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
