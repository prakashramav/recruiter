import { z } from 'zod';

const baseJobBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
  location: z.string().optional(),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead']),
  minExperience: z.number().min(0).optional(),
  maxExperience: z.number().min(0).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  salaryCurrency: z.string().optional(),
  openings: z.number().min(1).optional(),
  applicationDeadline: z.string().or(z.date()),
  education: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  status: z.enum(['Draft', 'Published', 'Paused', 'Closed']).optional(),
});

const applyRefinements = (schema) => {
  return schema.refine(data => {
    if (data.minExperience !== undefined && data.maxExperience !== undefined) {
      return data.minExperience <= data.maxExperience;
    }
    return true;
  }, {
    message: "Min experience cannot be greater than max experience",
    path: ["maxExperience"]
  }).refine(data => {
    if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
      return data.salaryMin <= data.salaryMax;
    }
    return true;
  }, {
    message: "Min salary cannot be greater than max salary",
    path: ["salaryMax"]
  });
};

export const createJobSchema = z.object({
  body: applyRefinements(baseJobBodySchema),
});

export const updateJobSchema = z.object({
  body: applyRefinements(baseJobBodySchema.partial()),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
  }),
});
