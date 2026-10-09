import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MapPin, Building, DollarSign, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JobCard = ({ job, isRecruiter = false, onApply, hasApplied = false }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/20"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{job.title}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm gap-4">
              <span className="flex items-center gap-1"><Building className="h-4 w-4" /> {job.company}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
            </div>
          </div>
          <Badge variant="secondary">{job.employmentType || job.jobType}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 line-clamp-3">
          {job.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-medium flex items-center gap-1">
          {job.salaryMin ? (
            <><DollarSign className="h-4 w-4 text-primary" /> 
              {job.salaryMin.toLocaleString()}{job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ''} {job.salaryCurrency || ''} /yr
            </>
          ) : job.salary ? (
            <><DollarSign className="h-4 w-4 text-primary" /> {job.salary.toLocaleString()}/yr</>
          ) : (
            'Salary not specified'
          )}
        </div>
        <div className="flex gap-2">
          {isRecruiter ? (
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/jobs/${job._id}`); }}>
              Manage
            </Button>
          ) : hasApplied ? (
            <Button disabled variant="outline" className="text-green-600 border-green-600 bg-green-50/50 opacity-100 font-medium">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Applied
            </Button>
          ) : job.status === 'Closed' ? (
            <Button disabled variant="outline" className="text-red-600 border-red-600 bg-red-50/50 opacity-100 font-medium">
              Closed
            </Button>
          ) : (
            <Button onClick={(e) => { e.stopPropagation(); onApply(job._id); }}>
              Apply Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
