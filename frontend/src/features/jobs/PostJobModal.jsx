import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateJob } from '../../hooks/useJobs';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import toast from 'react-hot-toast';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  requiredSkills: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
  location: z.string().optional(),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead']),
  minExperience: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
  maxExperience: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
  salaryMin: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
  salaryMax: z.preprocess((val) => (val ? Number(val) : undefined), z.number().min(0).optional()),
  salaryCurrency: z.string().default('INR'),
  openings: z.preprocess((val) => (val ? Number(val) : 1), z.number().min(1)),
  applicationDeadline: z.string().min(1, 'Application deadline is required'),
  education: z.string().optional(),
  benefits: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Paused', 'Closed']).default('Published'),
}).refine(data => {
  if (data.minExperience !== undefined && data.maxExperience !== undefined) {
    return data.minExperience <= data.maxExperience;
  }
  return true;
}, {
  message: "Min experience cannot be > max experience",
  path: ["maxExperience"]
}).refine(data => {
  if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
    return data.salaryMin <= data.salaryMax;
  }
  return true;
}, {
  message: "Min salary cannot be > max salary",
  path: ["salaryMax"]
});

export const PostJobModal = ({ isOpen, onClose }) => {
  const { mutate: createJob, isPending } = useCreateJob();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      employmentType: 'Full-time',
      workMode: 'On-site',
      experienceLevel: 'Mid-level',
      salaryCurrency: 'INR',
      openings: 1,
      status: 'Published'
    },
  });

  const onSubmit = (data) => {
    // Convert comma separated strings to arrays
    const formattedData = {
      ...data,
      responsibilities: data.responsibilities ? data.responsibilities.split(',').map(s => s.trim()) : [],
      requirements: data.requirements ? data.requirements.split(',').map(s => s.trim()) : [],
      requiredSkills: data.requiredSkills ? data.requiredSkills.split(',').map(s => s.trim()) : [],
      education: data.education ? data.education.split(',').map(s => s.trim()) : [],
      benefits: data.benefits ? data.benefits.split(',').map(s => s.trim()) : [],
    };

    createJob(formattedData, {
      onSuccess: () => {
        toast.success('Job posted successfully!');
        reset();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to post job');
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Post New Job" 
      description="Fill in the details to create a new job posting."
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" placeholder="Software Engineer" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" placeholder="Acme Corp" {...register('company')} />
            {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description *</Label>
          <textarea 
            id="description" 
            placeholder="We are looking for..." 
            {...register('description')} 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <select 
              id="employmentType" 
              {...register('employmentType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
            {errors.employmentType && <p className="text-sm text-destructive">{errors.employmentType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workMode">Work Mode *</Label>
            <select 
              id="workMode" 
              {...register('workMode')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
            {errors.workMode && <p className="text-sm text-destructive">{errors.workMode.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level *</Label>
            <select 
              id="experienceLevel" 
              {...register('experienceLevel')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
            {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Remote / NY" {...register('location')} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minExperience">Min Experience (Years)</Label>
            <Input id="minExperience" type="number" {...register('minExperience')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxExperience">Max Experience (Years)</Label>
            <Input id="maxExperience" type="number" {...register('maxExperience')} />
            {errors.maxExperience && <p className="text-sm text-destructive">{errors.maxExperience.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryCurrency">Currency</Label>
            <Input id="salaryCurrency" placeholder="INR" {...register('salaryCurrency')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Min Salary</Label>
            <Input id="salaryMin" type="number" {...register('salaryMin')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMax">Max Salary</Label>
            <Input id="salaryMax" type="number" {...register('salaryMax')} />
            {errors.salaryMax && <p className="text-sm text-destructive">{errors.salaryMax.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openings">No. of Openings *</Label>
            <Input id="openings" type="number" min="1" {...register('openings')} />
            {errors.openings && <p className="text-sm text-destructive">{errors.openings.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline *</Label>
            <Input id="applicationDeadline" type="date" {...register('applicationDeadline')} />
            {errors.applicationDeadline && <p className="text-sm text-destructive">{errors.applicationDeadline.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requiredSkills">Required Skills (comma separated)</Label>
          <Input id="requiredSkills" placeholder="React, Node.js, MongoDB" {...register('requiredSkills')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsibilities">Responsibilities (comma separated)</Label>
          <Input id="responsibilities" placeholder="Build APIs, Code reviews" {...register('responsibilities')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements (comma separated)</Label>
          <Input id="requirements" placeholder="B.Tech, 2 yrs experience" {...register('requirements')} />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
