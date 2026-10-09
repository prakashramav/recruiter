import React, { useState, useEffect } from 'react';
import { useMyApplications } from '../../hooks/useApplications';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MapPin, Building, Calendar, Video, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    New: 'default',
    Reviewed: 'warning',
    Shortlisted: 'success',
    Rejected: 'destructive',
    'No Show': 'outline',
  };
  return <Badge variant={statusColors[status] || 'default'}>{status}</Badge>;
};

const InterviewButton = ({ link, dateString }) => {
  const [canJoin, setCanJoin] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!dateString) {
      setCanJoin(true);
      return;
    }
    
    const checkTime = () => {
      const interviewTime = new Date(dateString).getTime();
      const now = Date.now();
      const diffMinutes = (interviewTime - now) / (1000 * 60);
      
      // Expire if it's been more than 2 hours (120 mins) since start time
      if (diffMinutes < -120) {
        setIsExpired(true);
        setCanJoin(false);
      } else {
        setIsExpired(false);
        // Allow joining if it's within 10 minutes before the interview or any time after up to 2 hrs
        setCanJoin(diffMinutes <= 10);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dateString]);

  if (isExpired) {
    return (
      <Button 
        size="sm" 
        variant="outline"
        disabled
        className="border-red-200 text-red-500 bg-red-50/50 cursor-not-allowed"
      >
        <Clock className="h-4 w-4 mr-2" /> Interview Expired
      </Button>
    );
  }

  if (!canJoin) {
    return (
      <Button 
        size="sm" 
        variant="outline"
        disabled
        className="border-muted hover:bg-transparent cursor-not-allowed"
      >
        <Clock className="h-4 w-4 mr-2" /> Opens 10 min before
      </Button>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline"
      className="border-primary/50 hover:bg-primary/5"
      onClick={() => window.open(link, '_blank')}
    >
      <Video className="h-4 w-4 mr-2 text-primary" /> Join Interview
    </Button>
  );
};

export const MyApplicationsList = () => {
  const { data, isLoading, error } = useMyApplications();

  if (isLoading) return <div className="p-8 text-center">Loading applications...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error loading applications</div>;

  const applications = data?.data || [];

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      
      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You haven't applied to any jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{app.job.title}</h3>
                  <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mt-2">
                    <span className="flex items-center gap-1"><Building className="h-4 w-4"/> {app.job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {app.job.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.status === 'Shortlisted' && (
                    <div className="flex flex-col items-end mt-2">
                      {app.interviewDate && (
                        <p className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> 
                          {new Date(app.interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      )}
                      {app.interviewLink && (
                        <InterviewButton link={app.interviewLink} dateString={app.interviewDate} />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
