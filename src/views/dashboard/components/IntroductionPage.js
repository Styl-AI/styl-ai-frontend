import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import IntroCard from 'src/components/shared/IntroCard';
import { INTRO_BULLET_POINTS, INTRO_HEADING } from 'src/constants/text.constant';

const IntroductionPage = () => {
  return (
    <PageContainer variant="h2" title="Chatbot Introduction Page" description="this is Sample page">
      <IntroCard>
        <Typography>
          <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
            {INTRO_HEADING}
          </Typography>
          <Box mt={4}> {/* Adding spacing */}
            <Typography variant="h5" component="div">
              <ul>
                {INTRO_BULLET_POINTS.map((item, index) => (
                  <li key={index}>
                    <Typography variant="h5" dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </Typography>
          </Box>
        </Typography>
      </IntroCard>
    </PageContainer>
  );
};

export default IntroductionPage;
