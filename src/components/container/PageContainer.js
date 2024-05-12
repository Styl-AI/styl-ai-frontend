import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Typography } from '@mui/material';

const PageContainer = ({ title, description, children }) => (
  <div>
    <Helmet>
    <Typography variant="h2" component="div" style={{ fontWeight: 'bold' }}>
      {title}
    </Typography>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </div>
);

PageContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default PageContainer;
