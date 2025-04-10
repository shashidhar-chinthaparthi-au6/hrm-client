import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
// import './AttendanceSummary.css';

const AttendanceSummary = ({
  presentCount = 0,
  absentCount = 0,
  lateCount = 0,
  leaveCount = 0,
  wfhCount = 0,
  totalEmployees = 0,
  date = new Date(),
  loading = false,
  className = '',
}) => {
  // Calculate percentages for the progress bars
  const calculatePercentage = (value) => {
    if (totalEmployees === 0) return 0;
    return Math.round((value / totalEmployees) * 100);
  };

  const presentPercentage = calculatePercentage(presentCount);
  const absentPercentage = calculatePercentage(absentCount);
  const latePercentage = calculatePercentage(lateCount);
  const leavePercentage = calculatePercentage(leaveCount);
  const wfhPercentage = calculatePercentage(wfhCount);

  // Format date as a readable string
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`attendance-summary-container ${className}`}>
      <div className="attendance-summary-header">
        <h3 className="attendance-title">Attendance Summary</h3>
        <div className="attendance-date">{formatDate(date)}</div>
      </div>

      {loading ? (
        <div className="attendance-loading">
          <div className="loading-spinner"></div>
          <p>Loading attendance data...</p>
        </div>
      ) : (
        <>
          <div className="attendance-stats">
            <div className="attendance-overview">
              <div className="attendance-stat">
                <div className="stat-circle present">
                  <span className="stat-value">{presentPercentage}%</span>
                </div>
                <div className="stat-label">Present</div>
                <div className="stat-count">{presentCount} employees</div>
              </div>
              
              <div className="attendance-stat">
                <div className="stat-circle absent">
                  <span className="stat-value">{absentPercentage}%</span>
                </div>
                <div className="stat-label">Absent</div>
                <div className="stat-count">{absentCount} employees</div>
              </div>
              
              <div className="attendance-stat">
                <div className="stat-circle late">
                  <span className="stat-value">{latePercentage}%</span>
                </div>
                <div className="stat-label">Late</div>
                <div className="stat-count">{lateCount} employees</div>
              </div>
              
              <div className="attendance-stat">
                <div className="stat-circle leave">
                  <span className="stat-value">{leavePercentage}%</span>
                </div>
                <div className="stat-label">On Leave</div>
                <div className="stat-count">{leaveCount} employees</div>
              </div>
              
              <div className="attendance-stat">
                <div className="stat-circle wfh">
                  <span className="stat-value">{wfhPercentage}%</span>
                </div>
                <div className="stat-label">WFH</div>
                <div className="stat-count">{wfhCount} employees</div>
              </div>
            </div>

            <div className="attendance-bars">
              <div className="attendance-bar-item">
                <div className="bar-label">
                  <span className="status-dot present"></span>
                  <span>Present</span>
                  <span className="bar-value">{presentCount}/{totalEmployees}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar present" 
                    style={{ width: `${presentPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="attendance-bar-item">
                <div className="bar-label">
                  <span className="status-dot absent"></span>
                  <span>Absent</span>
                  <span className="bar-value">{absentCount}/{totalEmployees}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar absent" 
                    style={{ width: `${absentPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="attendance-bar-item">
                <div className="bar-label">
                  <span className="status-dot late"></span>
                  <span>Late</span>
                  <span className="bar-value">{lateCount}/{totalEmployees}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar late" 
                    style={{ width: `${latePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="attendance-bar-item">
                <div className="bar-label">
                  <span className="status-dot leave"></span>
                  <span>On Leave</span>
                  <span className="bar-value">{leaveCount}/{totalEmployees}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar leave" 
                    style={{ width: `${leavePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="attendance-bar-item">
                <div className="bar-label">
                  <span className="status-dot wfh"></span>
                  <span>Work From Home</span>
                  <span className="bar-value">{wfhCount}/{totalEmployees}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar wfh" 
                    style={{ width: `${wfhPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="attendance-summary-footer">
            <button className="view-details-button">
              View Full Attendance Report
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

AttendanceSummary.propTypes = {
  presentCount: PropTypes.number,
  absentCount: PropTypes.number,
  lateCount: PropTypes.number,
  leaveCount: PropTypes.number,
  wfhCount: PropTypes.number,
  totalEmployees: PropTypes.number,
  date: PropTypes.instanceOf(Date),
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default AttendanceSummary;