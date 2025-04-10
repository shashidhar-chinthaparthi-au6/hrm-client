import React from 'react';
import PropTypes from 'prop-types';
// import './Pagination.css';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageRangeDisplayed = 5,
  marginPagesDisplayed = 1,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  breakLabel = '...',
  disableInitialCallback = false,
  className = '',
}) => {
  const handleClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let leftSide = pageRangeDisplayed / 2;
    let rightSide = pageRangeDisplayed - leftSide;

    // If current page is less than range to be displayed + 1
    if (currentPage - leftSide < 1) {
      leftSide = currentPage - 1;
    }

    // If current page is greater than total pages - range to be displayed
    if (currentPage + rightSide > totalPages) {
      rightSide = totalPages - currentPage;
    }

    // Recalculate left side if right side is less than expected
    if (rightSide < pageRangeDisplayed / 2) {
      leftSide = Math.min(pageRangeDisplayed - rightSide, currentPage - 1);
    }

    // Recalculate right side if left side is less than expected
    if (leftSide < pageRangeDisplayed / 2) {
      rightSide = Math.min(pageRangeDisplayed - leftSide, totalPages - currentPage);
    }

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - leftSide);
    let endPage = Math.min(totalPages, currentPage + rightSide);

    // Add first page(s)
    if (startPage > 1) {
      for (let i = 1; i <= Math.min(marginPagesDisplayed, startPage - 1); i++) {
        pages.push(i);
      }
      if (startPage > marginPagesDisplayed + 1) {
        pages.push('break-left');
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page(s)
    if (endPage < totalPages) {
      if (endPage < totalPages - marginPagesDisplayed) {
        pages.push('break-right');
      }
      for (let i = Math.max(totalPages - marginPagesDisplayed + 1, endPage + 1); i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className={`pagination-container ${className}`}>
      <button
        className={`pagination-button previous ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        {previousLabel}
      </button>
      
      <div className="pagination-numbers">
        {pages.map((page, index) => {
          if (page === 'break-left' || page === 'break-right') {
            return (
              <span key={`${page}-${index}`} className="pagination-break">
                {breakLabel}
              </span>
            );
          }
          
          return (
            <button
              key={`page-${page}`}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => handleClick(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button
        className={`pagination-button next ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        {nextLabel}
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pageRangeDisplayed: PropTypes.number,
  marginPagesDisplayed: PropTypes.number,
  previousLabel: PropTypes.node,
  nextLabel: PropTypes.node,
  breakLabel: PropTypes.node,
  disableInitialCallback: PropTypes.bool,
  className: PropTypes.string,
};

export default Pagination;