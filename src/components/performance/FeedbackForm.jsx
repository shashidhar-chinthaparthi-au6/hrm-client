import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { useToast } from '../../hooks/useToast';

const FeedbackForm = ({ 
  employeeId, 
  reviewerId, 
  reviewCycleId, 
  feedbackType = 'performance', 
  isManager,
  onSubmit,
  onCancel 
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [feedback, setFeedback] = useState({
    strengths: '',
    improvements: '',
    goals: '',
    rating: 3,
    comments: '',
    isAnonymous: false,
    status: 'draft'
  });
  const [existingFeedback, setExistingFeedback] = useState(null);
  const { showToast } = useToast();

  const feedbackTypes = [
    { value: 'performance', label: 'Performance Review' },
    { value: 'peer', label: 'Peer Feedback' },
    { value: '360', label: '360° Feedback' },
    { value: 'project', label: 'Project Feedback' },
    { value: 'training', label: 'Training Feedback' }
  ];

  const ratingOptions = [
    { value: 1, label: 'Needs Significant Improvement' },
    { value: 2, label: 'Needs Improvement' },
    { value: 3, label: 'Meets Expectations' },
    { value: 4, label: 'Exceeds Expectations' },
    { value: 5, label: 'Outstanding Performance' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee data
        const employeeResponse = await fetch(`/api/employees/${employeeId}`);
        const employeeData = await employeeResponse.json();
        setEmployee(employeeData);
        
        // Check for existing feedback
        if (reviewCycleId) {
          const feedbackResponse = await fetch(`/api/feedback?employeeId=${employeeId}&reviewerId=${reviewerId}&reviewCycleId=${reviewCycleId}&type=${feedbackType}`);
          
          if (feedbackResponse.ok) {
            const feedbackData = await feedbackResponse.json();
            if (feedbackData && feedbackData.length > 0) {
              setExistingFeedback(feedbackData[0]);
              setFeedback({
                strengths: feedbackData[0].strengths || '',
                improvements: feedbackData[0].improvements || '',
                goals: feedbackData[0].goals || '',
                rating: feedbackData[0].rating || 3,
                comments: feedbackData[0].comments || '',
                isAnonymous: feedbackData[0].isAnonymous || false,
                status: feedbackData[0].status || 'draft'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load feedback data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId, reviewerId, reviewCycleId, feedbackType, showToast]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitFeedback = async (e, saveAsDraft = false) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const feedbackData = {
        ...feedback,
        employeeId,
        reviewerId,
        reviewCycleId,
        type: feedbackType,
        status: saveAsDraft ? 'draft' : 'submitted',
        submittedAt: saveAsDraft ? null : new Date().toISOString()
      };
      
      const url = existingFeedback 
        ? `/api/feedback/${existingFeedback.id}` 
        : '/api/feedback';
      
      const method = existingFeedback ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast(
          saveAsDraft 
            ? 'Feedback saved as draft' 
            : 'Feedback submitted successfully', 
          'success'
        );
        
        if (onSubmit) {
          onSubmit(data);
        }
      } else {
        showToast(data.message || 'Failed to submit feedback', 'error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast('Failed to submit feedback', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading feedback form...</div>;
  }

  if (!employee) {
    return <div className="text-center py-8 text-red-500">Employee data not found</div>;
  }

  const isPeerFeedback = feedbackType === 'peer' || feedbackType === '360';
  const isSubmitted = existingFeedback && existingFeedback.status === 'submitted';
  const canEdit = !isSubmitted || isManager;

  const getFeedbackTitle = () => {
    const typeLabel = feedbackTypes.find(t => t.value === feedbackType)?.label || 'Feedback';
    
    if (isSubmitted) {
      return `${typeLabel} (Submitted)`;
    }
    
    if (existingFeedback) {
      return `${typeLabel} (Draft)`;
    }
    
    return typeLabel;
  };

  return (
    <div className="feedback-form-container">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold">{getFeedbackTitle()}</h2>
          
          {employee && (
            <div className="flex items-center mt-2 md:mt-0">
              <Avatar 
                src={employee.profileImage} 
                name={`${employee.firstName} ${employee.lastName}`} 
                size="md" 
              />
              <div className="ml-3">
                <h3 className="font-medium">{`${employee.firstName} ${employee.lastName}`}</h3>
                <p className="text-sm text-gray-500">{employee.designation}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={(e) => handleSubmitFeedback(e, false)}>
          {feedbackType === 'performance' && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Overall Rating</h3>
              <Select
                name="rating"
                value={feedback.rating}
                onChange={(value) => handleSelectChange('rating', parseInt(value))}
                options={ratingOptions}
                disabled={!canEdit}
                className="mb-2"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Needs Improvement</span>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 rounded-full h-2 relative">
                    <div 
                      className={`h-2 rounded-full ${
                        feedback.rating <= 2 ? 'bg-red-400' :
                        feedback.rating === 3 ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} 
                      style={{ width: `${(feedback.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500">Outstanding</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-3">Strengths</h3>
            <Input
              name="strengths"
              value={feedback.strengths}
              onChange={handleInputChange}
              placeholder="What are the employee's key strengths and accomplishments?"
              multiline
              rows={4}
              disabled={!canEdit}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Areas for Improvement</h3>
            <Input
              name="improvements"
              value={feedback.improvements}
              onChange={handleInputChange}
              placeholder="What areas could the employee improve upon?"
              multiline
              rows={4}
              disabled={!canEdit}
            />
          </div>

          {feedbackType === 'performance' && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Goals and Development</h3>
              <Input
                name="goals"
                value={feedback.goals}
                onChange={handleInputChange}
                placeholder="Suggestions for future goals and professional development"
                multiline
                rows={4}
                disabled={!canEdit}
              />
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-3">Additional Comments</h3>
            <Input
              name="comments"
              value={feedback.comments}
              onChange={handleInputChange}
              placeholder="Any other feedback or comments"
              multiline
              rows={4}
              disabled={!canEdit}
            />
          </div>

          {isPeerFeedback && (
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={feedback.isAnonymous}
                onChange={handleInputChange}
                className="mr-2"
                disabled={!canEdit || isSubmitted}
              />
              <label htmlFor="isAnonymous" className="text-sm">
                Submit this feedback anonymously
              </label>
            </div>
          )}

          {canEdit && (
            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              
              <Button 
                variant="secondary" 
                type="button" 
                onClick={(e) => handleSubmitFeedback(e, true)}
                disabled={submitting}
              >
                Save as Draft
              </Button>
              
              <Button 
                variant="primary" 
                type="submit" 
                loading={submitting}
              >
                {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
              </Button>
            </div>
          )}

          {isSubmitted && !isManager && (
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-gray-600">
                This feedback has been submitted and cannot be edited.
              </p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

FeedbackForm.propTypes = {
  employeeId: PropTypes.string.isRequired,
  reviewerId: PropTypes.string.isRequired,
  reviewCycleId: PropTypes.string,
  feedbackType: PropTypes.oneOf(['performance', 'peer', '360', 'project', 'training']),
  isManager: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

FeedbackForm.defaultProps = {
  feedbackType: 'performance',
  isManager: false
};

export default FeedbackForm;