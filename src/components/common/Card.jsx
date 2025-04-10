import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
// import './Card.css';

const Card = ({
  children,
  title,
  subtitle,
  action,
  cover,
  actions,
  bordered = true,
  hoverable = false,
  loading = false,
  className = '',
  bodyStyle = {},
  ...rest
}) => {
  return (
    <Paper 
      elevation={bordered ? 3 : 0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': hoverable ? {
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transform: 'translateY(-4px)'
        } : {},
        position: 'relative',
        ...bodyStyle
      }}
      className={className}
      {...rest}
    >
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 1,
          borderRadius: '8px'
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {cover && (
        <Box sx={{ mb: 2 }}>
          {cover}
        </Box>
      )}
      
      {(title || action) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Box>
            {title && <Typography variant="h6">{title}</Typography>}
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      
      <Box sx={bodyStyle}>
        {children}
      </Box>
      
      {actions && actions.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          pt: 2, 
          mt: 2,
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          {actions.map((action, index) => (
            <Box key={index} sx={{ mr: 1 }}>
              {action}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  cover: PropTypes.node,
  actions: PropTypes.array,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  bodyStyle: PropTypes.object,
};

export default Card;