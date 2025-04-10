import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

const PerformanceChart = ({ employeeId, isManager, period = 'year', compareMode = false }) => {
  const [chartType, setChartType] = useState('radar');
  const [performanceData, setPerformanceData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('individual');
  const [timePeriod, setTimePeriod] = useState(period);
  const [compareWith, setCompareWith] = useState('department');
  const [showComparison, setShowComparison] = useState(compareMode);
  const { showToast } = useToast();

  const chartOptions = [
    { value: 'radar', label: 'Radar Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart (Trends)' },
    { value: 'pie', label: 'Pie Chart (Distribution)' }
  ];

  const periodOptions = [
    { value: 'quarter', label: 'Current Quarter' },
    { value: 'halfyear', label: 'Last 6 Months' },
    { value: 'year', label: 'Last 12 Months' },
    { value: 'all', label: 'All Time' }
  ];

  const modeOptions = [
    { value: 'individual', label: 'Individual Performance' },
    { value: 'team', label: 'Team Overview' }
  ];

  const comparisonOptions = [
    { value: 'department', label: 'Department Average' },
    { value: 'company', label: 'Company Average' },
    { value: 'role', label: 'Same Role Average' },
    { value: 'topPerformers', label: 'Top Performers' }
  ];

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#F44236', '#3F51B5', '#9C27B0', '#CDDC39'
  ];

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        
        // Fetch performance data for the employee or team
        const endpoint = viewMode === 'individual' 
          ? `/api/employees/${employeeId}/performance?period=${timePeriod}` 
          : `/api/teams/performance?period=${timePeriod}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        setPerformanceData(data);
        
        // Fetch comparison data if needed
        if (showComparison) {
          const comparisonEndpoint = `/api/performance/comparison?type=${compareWith}&period=${timePeriod}`;
          const comparisonResponse = await fetch(comparisonEndpoint);
          const comparisonData = await comparisonResponse.json();
          
          setComparisonData(comparisonData);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        showToast('Failed to load performance metrics', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerformanceData();
  }, [employeeId, viewMode, timePeriod, showComparison, compareWith, showToast]);

  const handleToggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const renderRadarChart = () => {
    if (!performanceData.radar) return <p>No radar data available</p>;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={150} data={performanceData.radar}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          <Radar
            name={viewMode === 'individual' ? "Employee" : "Team"}
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          {showComparison && comparisonData.radar && (
            <Radar
              name={`${compareWith.charAt(0).toUpperCase() + compareWith.slice(1)} Average`}
              dataKey="benchmarkScore"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          )}
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    if (!performanceData.bar) return <p>No bar chart data available</p>;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={performanceData.bar}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="score" 
            name={viewMode === 'individual' ? "Employee" : "Team"} 
            fill="#8884d8" 
          />
          {showComparison && comparisonData.bar && (
            <Bar 
              dataKey="benchmarkScore" 
              name={`${compareWith.charAt(0).toUpperCase() + compareWith.slice(1)} Average`} 
              fill="#82ca9d" 
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    if (!performanceData.trend) return <p>No trend data available</p>;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={performanceData.trend}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name={viewMode === 'individual' ? "Employee" : "Team"}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          {showComparison && comparisonData.trend && (
            <Line
              type="monotone"
              dataKey="benchmarkScore"
              name={`${compareWith.charAt(0).toUpperCase() + compareWith.slice(1)} Average`}
              stroke="#82ca9d"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    if (!performanceData.distribution) return <p>No distribution data available</p>;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={performanceData.distribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="category"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {performanceData.distribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p>Loading performance metrics...</p>
        </div>
      );
    }

    switch (chartType) {
      case 'radar':
        return renderRadarChart();
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderRadarChart();
    }
  };

  const renderKPICards = () => {
    if (!performanceData.kpi || loading) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {performanceData.kpi.map((kpi, index) => (
          <Card key={`kpi-${index}`} className="text-center">
            <p className="text-gray-500 mb-1">{kpi.name}</p>
            <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
            <div className={`text-sm ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% {kpi.change >= 0 ? 'increase' : 'decrease'}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderPerformanceInsights = () => {
    if (!performanceData.insights || loading) return null;

    return (
      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Performance Insights</h3>
        <ul className="space-y-2">
          {performanceData.insights.map((insight, index) => (
            <li key={`insight-${index}`} className={`flex items-start p-2 rounded ${
              insight.type === 'positive' ? 'bg-green-50' : 
              insight.type === 'negative' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <span className={`inline-block mr-2 rounded-full p-1 ${
                insight.type === 'positive' ? 'bg-green-100 text-green-500' : 
                insight.type === 'negative' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
              }`}>
                {insight.type === 'positive' ? '↑' : 
                 insight.type === 'negative' ? '↓' : 'i'}
              </span>
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    );
  };

  return (
    <div className="performance-chart-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Performance Metrics</h2>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Select
          label="Chart Type"
          value={chartType}
          onChange={setChartType}
          options={chartOptions}
        />
        
        <Select
          label="Time Period"
          value={timePeriod}
          onChange={setTimePeriod}
          options={periodOptions}
        />
        
        {isManager && (
          <Select
            label="View Mode"
            value={viewMode}
            onChange={setViewMode}
            options={modeOptions}
          />
        )}
        
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Compare With</label>
          <div className="flex items-center">
            <Button
              variant={showComparison ? "primary" : "outline"}
              size="sm"
              onClick={handleToggleComparison}
              className="mr-2"
            >
              {showComparison ? "Hide Comparison" : "Show Comparison"}
            </Button>
            
            {showComparison && (
              <Select
                value={compareWith}
                onChange={setCompareWith}
                options={comparisonOptions}
                placeholder="Select comparison"
                className="flex-grow"
              />
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Main Chart */}
      <Card className="mb-6">
        <h3 className="font-semibold mb-4">
          {chartType === 'radar' ? 'Performance Dimensions' :
           chartType === 'line' ? 'Performance Trend' :
           chartType === 'pie' ? 'Performance Distribution' :
           'Performance Metrics'}
        </h3>
        {renderChart()}
      </Card>

      {/* Performance Insights */}
      {renderPerformanceInsights()}

      {/* Performance Summary */}
      {!loading && performanceData.summary && (
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="list-disc pl-5 space-y-1">
                {performanceData.summary.strengths.map((strength, index) => (
                  <li key={`strength-${index}`}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="list-disc pl-5 space-y-1">
                {performanceData.summary.improvements.map((improvement, index) => (
                  <li key={`improvement-${index}`}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
          {performanceData.summary.recommendation && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h4 className="font-medium mb-1">Recommendations</h4>
              <p>{performanceData.summary.recommendation}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

PerformanceChart.propTypes = {
  employeeId: PropTypes.string.isRequired,
  isManager: PropTypes.bool,
  period: PropTypes.oneOf(['quarter', 'halfyear', 'year', 'all']),
  compareMode: PropTypes.bool
};

PerformanceChart.defaultProps = {
  isManager: false,
  period: 'year',
  compareMode: false
};

export default PerformanceChart;