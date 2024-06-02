import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import IntroCard from 'src/components/shared/IntroCard';

const IntroductionPage = () => {
  return (
    <PageContainer variant="h2" title="Chatbot Introduction Page" description="this is Sample page">
      <IntroCard>
        <Typography>
          <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
            Hi there! I'm your AI-driven shopping buddy, ready to assist with all your shopping needs.
          </Typography>
          <Box mt={4}> {/* Adding spacing */}
            <Typography variant="h5" component="div">
              <ul>
                <li><Typography variant="h5">Browse the hottest deals and discounted products across hundreds of stores.</Typography></li>
                <li><Typography variant="h5">Find the perfect product for your needs.</Typography></li>
                <li><Typography variant="h5">Get expert and user recommendations to guide your decision.</Typography></li>
              </ul>
            </Typography>
          </Box>
        </Typography>
      </IntroCard>
    </PageContainer>
  );
};

export default IntroductionPage;
