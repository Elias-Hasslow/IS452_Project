import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material'; // Assuming you're using Material-UI

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [expanded, setExpanded] = useState(null); // Initialize the expanded state

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/proposals'); // Flask endpoint
        setProposals(response.data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals();
  }, []);

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <Box>
      <Typography variant="h4">Proposals</Typography>
      {proposals.map((proposal, index) => (
        <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }} style={{ cursor: 'pointer' }} onClick={() => handleToggle(index)}>
          <Typography>
            {proposal.title}
          </Typography>
          <Typography variant="body1">{proposal.description}</Typography>
          {expanded === index && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Duration: {proposal.duration} seconds</Typography>
              <Typography variant="body2">Address: {proposal.proposal_address}</Typography>
              {/* Add more details as needed */}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ViewProposals;
