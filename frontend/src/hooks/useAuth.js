import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      navigate(data.data.user.role === 'recruiter' ? '/dashboard' : '/jobs');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData) => api.post('/auth/register', userData),
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      navigate(data.data.user.role === 'recruiter' ? '/dashboard' : '/jobs');
    },
  });
};
