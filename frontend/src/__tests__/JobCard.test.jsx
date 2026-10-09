import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobCard } from '../features/jobs/JobCard';
import '@testing-library/jest-dom';

const mockJob = {
  _id: '1',
  title: 'Software Engineer',
  company: 'Tech Corp',
  location: 'Remote',
  jobType: 'Full-time',
  description: 'A great job building great things.',
  salary: 120000,
};

describe('JobCard Component', () => {
  it('renders job details correctly', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} />
      </BrowserRouter>
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText(/120,000/)).toBeInTheDocument();
  });

  it('shows Apply button for applicant', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} isRecruiter={false} />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });

  it('shows Manage button for recruiter', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} isRecruiter={true} />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument();
  });
});
