import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useApplyForJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, formData }) => {
      // formData is sent because it contains a file (multipart/form-data)
      return api.post(`/jobs/${jobId}/applications`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
    },
  });
};

export const useCheckAtsScore = () => {
  return useMutation({
    mutationFn: ({ jobId, formData }) => {
      return api.post(`/jobs/${jobId}/applications/check-ats`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  });
};

export const useMyApplications = (isAuthenticated = true) => {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get('/applications/me'),
    enabled: isAuthenticated,
  });
};

export const useJobApplications = (jobId) => {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => api.get(`/jobs/${jobId}/applications`),
    enabled: !!jobId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status, interviewLink, interviewDate }) => 
      api.patch(`/applications/${applicationId}/status`, { status, interviewLink, interviewDate }),
    onSuccess: (_, variables) => {
      // invalidate applications list to reflect the new status
      queryClient.invalidateQueries(['job-applications']);
    },
  });
};

export const useRecruiterStats = () => {
  return useQuery({
    queryKey: ['recruiter-stats'],
    queryFn: () => api.get('/applications/stats'),
  });
};
