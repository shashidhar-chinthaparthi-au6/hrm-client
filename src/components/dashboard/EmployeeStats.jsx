import React from 'react';
import PropTypes from 'prop-types';
// import './EmployeeStats.css';

const EmployeeStats = ({
  totalEmployees,
  activeDepartments,
  newHires,
  attrition,
  genderDistribution,
  averageAge,
  averageTenure,
  loading = false,
  timeframe = 'This month',
  className = '',
}) => {
  // Function to render progress bars for gender distribution
  const renderGenderDistribution = () => {
    if (!genderDistribution) return null;
    
    return (
      <div className="gender-distribution">
        <h4 className="stats-subtitle">Gender Distribution</h4>
        
        {Object.entries(genderDistribution).map(([gender, percentage]) => (
          <div key={gender} className="gender-bar">
            <div className="gender-label">
              <span>{gender}</span>
              <span>{percentage}%</span>
            </div>
            <div className="progress-container">
              <div 
                className={`progress-bar ${gender.toLowerCase()}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`employee-stats-card ${className}`}>
      <div className="stats-header">
        <h3 className="stats-title">Employee Statistics</h3>
        <div className="stats-period">{timeframe}</div>
      </div>
      
      {loading ? (
        <div className="stats-skeleton">
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
        </div>
      ) : (
        <div className="stats-content">
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-value">{totalEmployees}</div>
              <div className="stats-label">Total Employees</div>
            </div>
            
            <div className="stats-item">
              <div className="stats-value">{activeDepartments}</div>
              <div className="stats-label">Departments</div>
            </div>
          </div>
          
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-value">
                {newHires.count}
                <span className="stats-change positive">+{newHires.percentage}%</span>
              </div>
              <div className="stats-label">New Hires</div>
            </div>
            
            <div className="stats-item">
              <div className="stats-value">
                {attrition.rate}%
                <span className={`stats-change ${attrition.change < 0 ? 'positive' : 'negative'}`}>
                  {attrition.change > 0 ? '+' : ''}{attrition.change}%
                </span>
              </div>
              <div className="stats-label">Attrition Rate</div>
            </div>
          </div>
          
          <div className="stats-divider"></div>
          
          {renderGenderDistribution()}
          
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-value">{averageAge}</div>
              <div className="stats-label">Average Age</div>
            </div>
            
            <div className="stats-item">
              <div className="stats-value">{averageTenure}</div>
              <div className="stats-label">Avg. Tenure (years)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EmployeeStats.propTypes = {
  totalEmployees: PropTypes.number,
  activeDepartments: PropTypes.number,
  newHires: PropTypes.shape({
    count: PropTypes.number,
    percentage: PropTypes.number,
  }),
  attrition: PropTypes.shape({
    rate: PropTypes.number,
    change: PropTypes.number,
  }),
  genderDistribution: PropTypes.object,
  averageAge: PropTypes.number,
  averageTenure: PropTypes.number,
  loading: PropTypes.bool,
  timeframe: PropTypes.string,
  className: PropTypes.string,
};

export default EmployeeStats;