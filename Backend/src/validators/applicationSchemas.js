import { z } from 'zod';

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['New', 'Reviewed', 'Shortlisted', 'Rejected', 'No Show']),
    interviewLink: z.string().url().optional().or(z.literal('')),
    interviewDate: z.string().optional().or(z.literal('')),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Application ID'),
  }),
});
