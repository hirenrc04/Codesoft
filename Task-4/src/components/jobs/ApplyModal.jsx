// src/components/jobs/ApplyModal.jsx
import { useState } from 'react';
import api from '../../services/api';

const ApplyModal = ({ jobId, onClose }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);
      
      await api.post(`/api/applications/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onClose(true); // Pass success status
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Apply for this job</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Cover Letter</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="5"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a good fit for this role?"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Resume (PDF only)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;