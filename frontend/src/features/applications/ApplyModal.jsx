import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { useApplyForJob, useCheckAtsScore } from '../../hooks/useApplications';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const ApplyModal = ({ jobId, isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { mutate: applyForJob, isPending: isApplying, error: applyError, isSuccess } = useApplyForJob();
  const { mutate: checkAtsScore, isPending: isChecking, error: checkError } = useCheckAtsScore();
  
  const [filePreview, setFilePreview] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCurrentFile(file);
    setAtsScore(null); // Reset score when file changes
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleClose = () => {
    setAtsScore(null);
    setCurrentFile(null);
    setFilePreview(null);
    reset();
    onClose();
  };

  const onCheckAts = (data) => {
    if (!data.resume[0]) return;
    const formData = new FormData();
    formData.append('resume', data.resume[0]);
    
    checkAtsScore({ jobId, formData }, {
      onSuccess: (res) => {
        setAtsScore(res.data.score);
      }
    });
  };

  const onFinalSubmit = () => {
    if (!currentFile) return;
    
    const formData = new FormData();
    formData.append('resume', currentFile);
    if (atsScore !== null) {
      formData.append('atsScore', atsScore);
    }
    
    applyForJob({ jobId, formData });
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Success!">
        <div className="py-6 text-center">
          <p className="text-green-600 mb-4 font-medium">Your application has been submitted successfully!</p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Apply for Job" 
      description={atsScore !== null ? "Review your ATS match score before applying." : "Upload your resume to check your ATS match score."}
    >
      <div className="space-y-6 pt-4">
        {atsScore === null ? (
          <form onSubmit={handleSubmit(onCheckAts)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF only)</Label>
              <input 
                type="file" 
                id="resume"
                accept="application/pdf"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-1 file:rounded-md file:mr-4 file:text-sm file:font-medium hover:file:bg-primary/90 cursor-pointer"
                {...register('resume', { 
                  required: 'Resume is required',
                  onChange: handleFileChange
                })} 
              />
              {errors.resume && <p className="text-sm text-destructive">{errors.resume.message}</p>}
            </div>

            {filePreview && (
              <div className="border rounded-md p-2 h-64 overflow-y-auto bg-muted/20 flex justify-center">
                <Document file={filePreview} loading="Loading preview...">
                  <Page pageNumber={1} width={300} />
                </Document>
              </div>
            )}

            {checkError && <p className="text-sm text-destructive">{checkError.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isChecking}>
                {isChecking ? 'Checking Score...' : 'Check ATS Score'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/30 border rounded-xl p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Your ATS Match Score</h3>
              <div className="text-5xl font-bold text-primary mb-2">
                {atsScore}%
              </div>
              <p className="text-sm text-muted-foreground">
                {atsScore >= 70 ? 'Great match! Your resume aligns well with this job.' : 
                 atsScore >= 40 ? 'Fair match. You might want to include more relevant keywords.' : 
                 'Low match. Consider tailoring your resume more closely to the job description.'}
              </p>
            </div>

            {applyError && <p className="text-sm text-destructive">{applyError.message}</p>}

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAtsScore(null)}>
                Upload Different Resume
              </Button>
              <Button onClick={onFinalSubmit} disabled={isApplying}>
                {isApplying ? 'Submitting...' : 'Continue & Apply'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
