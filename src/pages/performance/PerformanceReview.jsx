import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ReviewForm from '../../components/performance/ReviewForm';
import FeedbackForm from '../../components/performance/FeedbackForm';
import PerformanceChart from '../../components/performance/PerformanceChart';
import { performanceService } from '../../services/performanceService';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import '../../assets/styles/pages/performance.css';

const PerformanceReview = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all reviews for comparison metrics
        const allReviewsData = await performanceService.getAllReviews();
        setReviews(allReviewsData);

        // Fetch specific employee review if employee ID is provided
        if (employeeId) {
          const reviewData = await performanceService.getEmployeeReview(employeeId);
          setCurrentReview(reviewData);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        toast.error('Failed to load performance review data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleSubmitReview = async (reviewData) => {
    try {
      await performanceService.updateReview(employeeId, reviewData);
      toast.success('Performance review updated successfully');
      
      // Refresh the current review data
      const updatedReview = await performanceService.getEmployeeReview(employeeId);
      setCurrentReview(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update performance review');
    }
  };

  const handleAddFeedback = async (feedbackData) => {
    try {
      const updatedReview = {
        ...currentReview,
        feedback: [...(currentReview.feedback || []), feedbackData]
      };
      
      await performanceService.updateReview(employeeId, updatedReview);
      setCurrentReview(updatedReview);
      toast.success('Feedback added successfully');
    } catch (error) {
      console.error('Error adding feedback:', error);
      toast.error('Failed to add feedback');
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading review data...</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Performance', path: '/performance' },
    { label: currentReview?.employeeName || 'Review', path: null }
  ];

  return (
    <div className="performance-review-container">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="page-header">
        <h1>Performance Review</h1>
        <div className="action-buttons">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/performance')}
          >
            Back to Performance
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/performance/review/${employeeId}/edit`)}
          >
            Edit Review
          </Button>
        </div>
      </div>

      {!employeeId && (
        <div className="no-employee-selected">
          <p>Select an employee to view or create a performance review.</p>
        </div>
      )}

      {employeeId && !currentReview && (
        <div className="no-review-data">
          <p>No review found for this employee.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/performance/review/${employeeId}/new`)}
          >
            Create New Review
          </Button>
        </div>
      )}

      {currentReview && (
        <>
          <div className="employee-review-header">
            <div className="employee-info">
              <img 
                src={currentReview.employeeAvatar || '/assets/images/default-avatar.png'} 
                alt={currentReview.employeeName} 
                className="employee-avatar"
              />
              <div className="employee-details">
                <h2>{currentReview.employeeName}</h2>
                <p>{currentReview.position} • {currentReview.department}</p>
                <div className="review-meta">
                  <span>Review Period: {currentReview.reviewPeriod}</span>
                  <span>Status: <span className={`status-badge ${currentReview.status.toLowerCase()}`}>{currentReview.status}</span></span>
                </div>
              </div>
            </div>
            <div className="overall-score">
              <div className={`score-circle ${getScoreClass(currentReview.overallScore)}`}>
                {currentReview.overallScore}/5
              </div>
              <p>Overall Score</p>
            </div>
          </div>

          <div className="review-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Review Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
            <button 
              className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('metrics')}
            >
              Performance Metrics
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="review-summary-cards">
                  <Card className="summary-card">
                    <h3>Strengths</h3>
                    <ul>
                      {currentReview.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="summary-card">
                    <h3>Areas for Improvement</h3>
                    <ul>
                      {currentReview.improvements?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="summary-card">
                    <h3>Goals Progress</h3>
                    <div className="goals-summary">
                      <div className="goal-stat">
                        <span className="stat-value">{currentReview.goalsCompleted || 0}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                      <div className="goal-stat">
                        <span className="stat-value">{currentReview.goalsInProgress || 0}</span>
                        <span className="stat-label">In Progress</span>
                      </div>
                      <div className="goal-stat">
                        <span className="stat-value">{currentReview.goalsMissed || 0}</span>
                        <span className="stat-label">Missed</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="performance-chart-card">
                  <h3>Performance Trends</h3>
                  <PerformanceChart employeeId={employeeId} data={currentReview.performanceHistory} />
                </Card>

                <Card className="manager-comments">
                  <h3>Manager Comments</h3>
                  <div className="comment-content">
                    <p>{currentReview.managerComments || 'No comments provided yet.'}</p>
                  </div>
                  <div className="comment-meta">
                    <span>By: {currentReview.managerName}</span>
                    <span>Date: {new Date(currentReview.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'details' && (
              <ReviewForm 
                reviewData={currentReview} 
                onSubmit={handleSubmitReview} 
                readOnly={true}
              />
            )}

            {activeTab === 'feedback' && (
              <div className="feedback-container">
                <h3>Feedback History</h3>
                {currentReview.feedback && currentReview.feedback.length > 0 ? (
                  <div className="feedback-list">
                    {currentReview.feedback.map((item, index) => (
                      <Card key={index} className="feedback-item">
                        <div className="feedback-header">
                          <div className="feedback-author">
                            <img 
                              src={item.authorAvatar || '/assets/images/default-avatar.png'} 
                              alt={item.authorName} 
                              className="author-avatar"
                            />
                            <div>
                              <h4>{item.authorName}</h4>
                              <p>{item.authorPosition}</p>
                            </div>
                          </div>
                          <div className="feedback-meta">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="feedback-type">{item.type}</span>
                          </div>
                        </div>
                        <div className="feedback-content">
                          <p>{item.content}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No feedback available yet.</p>
                )}

                <div className="add-feedback">
                  <h3>Add New Feedback</h3>
                  <FeedbackForm employeeId={employeeId} onSubmit={handleAddFeedback} />
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="metrics-container">
                <div className="metrics-grid">
                  {currentReview.performanceMetrics?.map((metric, index) => (
                    <Card key={index} className="metric-card">
                      <h3>{metric.name}</h3>
                      <div className="metric-score">
                        <div className={`score-bar ${getScoreClass(metric.score)}`}>
                          <div className="fill" style={{ width: `${(metric.score / 5) * 100}%` }}></div>
                        </div>
                        <span>{metric.score}/5</span>
                      </div>
                      <p>{metric.comments}</p>
                    </Card>
                  ))}
                </div>

                <Card className="comparison-chart">
                  <h3>Comparison with Team Average</h3>
                  <PerformanceChart 
                    employeeId={employeeId} 
                    data={currentReview.performanceMetrics}
                    comparisonData={calculateTeamAverages(reviews)} 
                    type="radar"
                  />
                </Card>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Helper functions
const getScoreClass = (score) => {
  if (score >= 4.5) return 'excellent';
  if (score >= 3.5) return 'good';
  if (score >= 2.5) return 'average';
  if (score >= 1.5) return 'below-average';
  return 'poor';
};

const calculateTeamAverages = (reviews) => {
  if (!reviews || reviews.length === 0) return [];
  
  // Group all metrics by name
  const metricsByName = {};
  
  reviews.forEach(review => {
    if (review.performanceMetrics) {
      review.performanceMetrics.forEach(metric => {
        if (!metricsByName[metric.name]) {
          metricsByName[metric.name] = {
            sum: 0,
            count: 0
          };
        }
        metricsByName[metric.name].sum += metric.score;
        metricsByName[metric.name].count += 1;
      });
    }
  });
  
  // Calculate averages
  return Object.keys(metricsByName).map(name => ({
    name,
    score: metricsByName[name].sum / metricsByName[name].count
  }));
};

export default PerformanceReview;