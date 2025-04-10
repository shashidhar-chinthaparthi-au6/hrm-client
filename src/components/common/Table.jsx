import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
// import './Table.css';

const Table = ({
  columns,
  data,
  pagination = true,
  pageSize = 10,
  sortable = true,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  rowKey = 'id',
  selectable = false,
  onSelectionChange,
}) => {
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);

  // Sort the data if sortable
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, sortable]);

  // Handle sorting click
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        const newDirection = prevConfig.direction === 'asc' ? 'desc' : 'asc';
        return { key, direction: newDirection };
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle selection
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const allIds = sortedData.map(item => item[rowKey]);
      setSelectedRows(allIds);
      onSelectionChange && onSelectionChange(allIds);
    } else {
      setSelectedRows([]);
      onSelectionChange && onSelectionChange([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedRows((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      onSelectionChange && onSelectionChange(newSelection);
      return newSelection;
    });
  };

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, page, pageSize]);

  const totalPages = useMemo(() => {
    return pagination ? Math.ceil(data.length / pageSize) : 1;
  }, [data.length, pageSize, pagination]);

  // Render data cell based on column render function or direct data
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.dataIndex], row);
    }
    return row[column.dataIndex];
  };

  return (
    <div className={`table-wrapper ${className}`}>
      {loading && <div className="table-loading">Loading...</div>}
      
      <table className="table">
        <thead>
          <tr>
            {selectable && (
              <th className="table__checkbox-header">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length > 0 && selectedRows.length === data.length}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.key || column.dataIndex}
                onClick={() => column.sortable !== false && handleSort(column.dataIndex)}
                className={`
                  ${column.sortable !== false && sortable ? 'table__header--sortable' : ''}
                  ${sortConfig.key === column.dataIndex ? `table__header--${sortConfig.direction}` : ''}
                  ${column.width ? 'table__header--fixed-width' : ''}
                `}
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
                {column.sortable !== false && sortable && sortConfig.key === column.dataIndex && (
                  <span className="table__sort-icon">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="table__empty-message">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'table__row--clickable' : ''}
              >
                {selectable && (
                  <td className="table__checkbox-cell" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row[rowKey])}
                      onChange={(e) => handleSelectRow(row[rowKey], e)}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td
                    key={`${row[rowKey]}-${column.key || column.dataIndex}`}
                    className={column.className}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && data.length > 0 && (
        <div className="table__pagination">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={data.length}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      sortable: PropTypes.bool,
      className: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  sortable: PropTypes.bool,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  className: PropTypes.string,
  onRowClick: PropTypes.func,
  rowKey: PropTypes.string,
  selectable: PropTypes.bool,
  onSelectionChange: PropTypes.func,
};

export default Table;