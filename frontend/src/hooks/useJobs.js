import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api.get('/jobs', { params: filters }),
  });
};

export const useJob = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get(`/jobs/${id}`),
    enabled: !!id,
  });
};

export const useRecruiterJobs = () => {
  return useQuery({
    queryKey: ['recruiter-jobs'],
    queryFn: () => api.get('/jobs/me/jobs'),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData) => api.post('/jobs', jobData),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruiter-jobs']);
      queryClient.invalidateQueries(['jobs']);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, jobData }) => api.put(`/jobs/${id}`, jobData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['recruiter-jobs']);
      queryClient.invalidateQueries(['job', variables.id]);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruiter-jobs']);
    },
  });
};
