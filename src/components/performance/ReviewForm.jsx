import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const ReviewForm = ({ employeeId, reviewCycle, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [reviewTemplates, setReviewTemplates] = useState([]);
  const [managers, setManagers] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch review templates
        const templatesResponse = await fetch('/api/performance/templates');
        const templatesData = await templatesResponse.json();
        setReviewTemplates(templatesData.map(template => ({
          value: template.id,
          label: template.name
        })));

        // Fetch managers
        const managersResponse = await fetch('/api/employees/managers');
        const managersData = await managersResponse.json();
        setManagers(managersData.map(manager => ({
          value: manager.id,
          label: `${manager.firstName} ${manager.lastName}`
        })));

        // If review cycle and employee id are provided, fetch existing review
        if (employeeId && reviewCycle) {
          const reviewResponse = await fetch(`/api/performance/reviews/${employeeId}/${reviewCycle}`);
          if (reviewResponse.ok) {
            const reviewDataResponse = await reviewResponse.json();
            setReviewData(reviewDataResponse);
            
            // Set form values based on existing review
            formik.setValues({
              templateId: reviewDataResponse.templateId,
              reviewerId: reviewDataResponse.reviewerId,
              cycleId: reviewDataResponse.cycleId,
              startDate: reviewDataResponse.startDate,
              endDate: reviewDataResponse.endDate,
              status: reviewDataResponse.status,
              criteria: reviewDataResponse.criteria.map(c => ({
                criteriaId: c.criteriaId,
                rating: c.rating,
                comments: c.comments
              })),
              strengths: reviewDataResponse.strengths,
              improvements: reviewDataResponse.improvements,
              overallComments: reviewDataResponse.overallComments,
              overallRating: reviewDataResponse.overallRating,
            });

            if (reviewDataResponse.templateId) {
              await loadTemplate(reviewDataResponse.templateId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId, reviewCycle]);

  const loadTemplate = async (templateId) => {
    try {
      const criteriaResponse = await fetch(`/api/performance/templates/${templateId}/criteria`);
      const criteriaData = await criteriaResponse.json();
      setCriteriaList(criteriaData);
      
      // Initialize criteria in formik if not already set
      if (!formik.values.criteria || formik.values.criteria.length === 0) {
        formik.setFieldValue('criteria', criteriaData.map(criteria => ({
          criteriaId: criteria.id,
          name: criteria.name,
          description: criteria.description,
          rating: 0,
          comments: ''
        })));
      }
      
      setSelectedTemplate(templateId);
    } catch (error) {
      console.error('Error loading template criteria:', error);
    }
  };

  const validationSchema = Yup.object({
    templateId: Yup.string().required('Review template is required'),
    reviewerId: Yup.string().required('Reviewer is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date cannot be before start date'),
    criteria: Yup.array().of(
      Yup.object().shape({
        rating: Yup.number()
          .min(1, 'Rating must be at least 1')
          .max(5, 'Rating cannot exceed 5')
          .required('Rating is required'),
        comments: Yup.string()
          .min(10, 'Comments must be at least 10 characters')
          .required('Comments are required')
      })
    ),
    strengths: Yup.string()
      .min(10, 'Please provide at least 10 characters')
      .required('Strengths are required'),
    improvements: Yup.string()
      .min(10, 'Please provide at least 10 characters')
      .required('Areas for improvement are required'),
    overallComments: Yup.string()
      .min(20, 'Overall comments must be at least 20 characters')
      .required('Overall comments are required'),
    overallRating: Yup.number()
      .min(1, 'Overall rating must be at least 1')
      .max(5, 'Overall rating cannot exceed 5')
      .required('Overall rating is required')
  });

  const formik = useFormik({
    initialValues: {
      templateId: '',
      reviewerId: '',
      cycleId: reviewCycle || '',
      startDate: '',
      endDate: '',
      status: 'draft', // draft, in_progress, completed
      criteria: [],
      strengths: '',
      improvements: '',
      overallComments: '',
      overallRating: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const url = reviewData 
          ? `/api/performance/reviews/${reviewData.id}` 
          : `/api/performance/reviews`;
        
        const method = reviewData ? 'PUT' : 'POST';
        
        // Calculate overall rating if not explicitly set
        if (!values.overallRating && values.criteria.length > 0) {
          const sum = values.criteria.reduce((acc, curr) => acc + curr.rating, 0);
          values.overallRating = Math.round((sum / values.criteria.length) * 10) / 10;
        }
        
        // Add employee ID if creating new review
        if (!reviewData) {
          values.employeeId = employeeId;
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save review');
        }
        
        const data = await response.json();
        onSubmit(data);
      } catch (error) {
        console.error('Error saving review:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleTemplateChange = async (selected) => {
    formik.setFieldValue('templateId', selected.value);
    await loadTemplate(selected.value);
  };

  const handleRatingChange = (index, value) => {
    const newCriteria = [...formik.values.criteria];
    newCriteria[index].rating = parseInt(value);
    formik.setFieldValue('criteria', newCriteria);
  };

  const handleCriteriaCommentChange = (index, value) => {
    const newCriteria = [...formik.values.criteria];
    newCriteria[index].comments = value;
    formik.setFieldValue('criteria', newCriteria);
  };
  
  // Calculate average rating from criteria
  const calculateAverageRating = () => {
    if (!formik.values.criteria.length) return 0;
    
    const sum = formik.values.criteria.reduce((acc, curr) => {
      return acc + (curr.rating || 0);
    }, 0);
    
    return Math.round((sum / formik.values.criteria.length) * 10) / 10;
  };

  const averageRating = calculateAverageRating();

  const ratingLabels = {
    1: 'Poor',
    2: 'Needs Improvement',
    3: 'Meets Expectations',
    4: 'Exceeds Expectations',
    5: 'Outstanding'
  };

  return (
    <Card title={reviewData ? 'Edit Performance Review' : 'New Performance Review'} isLoading={isLoading}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Review Template"
            id="templateId"
            name="templateId"
            options={reviewTemplates}
            value={formik.values.templateId}
            onChange={handleTemplateChange}
            onBlur={formik.handleBlur}
            error={formik.touched.templateId && formik.errors.templateId}
            disabled={!!reviewData}
            required
          />
          
          <Select
            label="Reviewer"
            id="reviewerId"
            name="reviewerId"
            options={managers}
            value={formik.values.reviewerId}
            onChange={(selected) => formik.setFieldValue('reviewerId', selected.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.reviewerId && formik.errors.reviewerId}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            id="startDate"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && formik.errors.startDate}
            required
          />
          
          <Input
            label="End Date"
            id="endDate"
            name="endDate"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && formik.errors.endDate}
            required
          />
        </div>
        
        {selectedTemplate && (
          <>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Criteria</h3>
              
              {formik.values.criteria.map((criterion, index) => (
                <div key={criterion.criteriaId} className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{criteriaList[index]?.name}</h4>
                      <p className="text-sm text-gray-500">{criteriaList[index]?.description}</p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(index, rating)}
                          className={`w-10 h-10 rounded-full mx-1 flex items-center justify-center text-sm font-medium focus:outline-none ${
                            criterion.rating === rating
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {criterion.rating > 0 && (
                    <div className="text-sm text-gray-600 mb-2">
                      Rating: <span className="font-medium">{criterion.rating}</span> - {ratingLabels[criterion.rating]}
                    </div>
                  )}
                  
                  <Input
                    label="Comments"
                    id={`criteria[${index}].comments`}
                    name={`criteria[${index}].comments`}
                    value={criterion.comments}
                    onChange={(e) => handleCriteriaCommentChange(index, e.target.value)}
                    placeholder="Provide specific examples and feedback"
                    multiline
                    rows={3}
                    error={
                      formik.touched.criteria && 
                      formik.touched.criteria[index] && 
                      formik.errors.criteria && 
                      formik.errors.criteria[index] && 
                      formik.errors.criteria[index].comments
                    }
                  />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Key Strengths"
                id="strengths"
                name="strengths"
                value={formik.values.strengths}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.strengths && formik.errors.strengths}
                placeholder="List key strengths demonstrated during this review period"
                multiline
                rows={4}
              />
              
              <Input
                label="Areas for Improvement"
                id="improvements"
                name="improvements"
                value={formik.values.improvements}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.improvements && formik.errors.improvements}
                placeholder="List specific areas where improvement is needed"
                multiline
                rows={4}
              />
            </div>
            
            <Input
              label="Overall Comments"
              id="overallComments"
              name="overallComments"
              value={formik.values.overallComments}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.overallComments && formik.errors.overallComments}
              placeholder="Provide a summary of the employee's overall performance during this review period"
              multiline
              rows={4}
            />
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">Overall Rating</h4>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => formik.setFieldValue('overallRating', rating)}
                      className={`w-12 h-12 rounded-full mx-1 flex items-center justify-center text-lg font-medium focus:outline-none ${
                        formik.values.overallRating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              
              {formik.values.overallRating > 0 ? (
                <div className="text-sm text-gray-600 mb-2">
                  Rating: <span className="font-medium">{formik.values.overallRating}</span> - {ratingLabels[formik.values.overallRating]}
                </div>
              ) : (
                <div className="text-sm text-blue-600 mb-2">
                  Suggested rating based on criteria: <span className="font-medium">{averageRating}</span>
                </div>
              )}
              
              {formik.touched.overallRating && formik.errors.overallRating && (
                <div className="text-sm text-red-600">{formik.errors.overallRating}</div>
              )}
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {reviewData ? 'Update' : 'Submit'} Review
          </Button>
          {formik.values.status !== 'draft' && (
            <Button
              type="button"
              variant="success"
              onClick={() => {
                formik.setFieldValue('status', 'completed');
                formik.handleSubmit();
              }}
            >
              Finalize Review
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;