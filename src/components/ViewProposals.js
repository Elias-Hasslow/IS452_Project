import React, { useState, useEffect, useCallback} from 'react';
// import axios from 'axios';
import { Box, Typography, Select, MenuItem } from '@mui/material'; // Assuming you're using Material-UI

const ViewProposals = ({ contract }) => {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', or 'past'
  // const [proposals, setProposals] = useState([]);
  const [expanded, setExpanded] = useState(null); // Initialize the expanded state


  // Get filter option
  const getFilteredProposals = () => {
    switch (filter) {
      case 'active':
        return activeProposals; // Display only active proposals
      case 'past':
        return pastProposals; // Display only past proposals
      case 'all':
      default:
        return [...activeProposals, ...pastProposals]; // Display all proposals
    }
  };

  // Change the title according to selected filter option
  const getTitle = () => {
    switch (filter) {
      case 'active':
        return 'Active Proposals';
      case 'past':
        return 'Past Proposals';
      case 'all':
      default:
        return 'Proposals';
    }
  };
  

  const fetchProposals = useCallback(async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/proposals'); // Flask endpoint
    //     // console.log(response.data);
    //     setProposals(response.data);
    //   } catch (error) {
    //     console.error("Error fetching proposals:", error);
    //   }
    // };
    // fetchProposals();
    if (!contract) {
      setError('Contract is not initialized');
      setLoading(false);
      return;
    }

    try {
      const proposalCount = await contract.methods.proposalCount().call();
      const active = [];
      const past = [];

      for (let i = 0; i < proposalCount; i++) {
        const proposal = await contract.methods.proposals(i).call();
        const { description, deadline, yesVotes, noVotes, votingEnded } = proposal;
        console.log(proposal);
        // console.log("current fetching proposal id: ", i);

        // Convert BigInt to Number
        const totalVotes = Number(yesVotes) + Number(noVotes); // Explicit conversion here
        const yesPercentage = totalVotes > 0 ? (Number(yesVotes) / totalVotes) * 100 : 0;
        const noPercentage = totalVotes > 0 ? (Number(noVotes) / totalVotes) * 100 : 0;

        const proposalData = {
          id: i,
          description,
          deadline: new Date(Number(deadline) * 1000).toLocaleString(), // Convert deadline to Number
          yesPercentage: yesPercentage.toFixed(2),
        };
        // console.log(proposalData);

        if (votingEnded) {
          past.push(proposalData);
        } else {
          active.push(proposalData);
        }
      }

      setActiveProposals(active);
      setPastProposals(past);
    } catch (err) {
      setError(`Error fetching proposals: ${err.message}`);
      // res.status(500).json({ message: 'Error retrieving data from contract', error: error.message });
    } finally {
      setLoading(false);
    }
  }, [contract]);
  
  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

  
  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <Box>
      <Typography variant="h4">{getTitle()}</Typography>
      <Box>
        <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">All Proposals</MenuItem>
            <MenuItem value="active">Active Proposals</MenuItem>
            <MenuItem value="past">Past Proposals</MenuItem>
          </Select>
      </Box>

    {/* Render filtered proposals */}
    {getFilteredProposals().length === 0 ? (
        <Typography>No proposals available.</Typography>
      ) : (
        getFilteredProposals().map((proposal) => (
          <Box key={proposal.id} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
            <Typography variant="h6">{proposal.description}</Typography>
            <Typography variant="body1">Deadline: {proposal.deadline}</Typography>
            <Typography variant="body1">Yes Votes: {proposal.yesPercentage}%</Typography>
          </Box>
        ))
      )}
      {/* <Typography variant="h4">Active Proposals</Typography>
    {activeProposals.map((proposal) => (
      <Box key={proposal.id} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
        <Typography variant="h6">{proposal.description}</Typography>
        <Typography variant="body1">Deadline: {proposal.deadline}</Typography>
        <Typography variant="body1">Yes Votes: {proposal.yesPercentage}%</Typography>
      </Box>
    ))}
    
    <Typography variant="h4">Past Proposals</Typography>
    {pastProposals.length === 0 ? (
      <Typography>No past proposals available.</Typography>
    ) : (
      pastProposals.map((proposal) => (
        <Box key={proposal.id} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
          <Typography variant="h6">{proposal.description}</Typography>
          <Typography variant="body1">Deadline: {proposal.deadline}</Typography>
          <Typography variant="body1">Yes Votes: {proposal.yesPercentage}%</Typography>
        </Box>
      ))
    )} */}
      {/* {pastProposals.map((proposal, index) => {
        const proposalTimestamp = new Date(proposal.timestamp).getTime() / 1000; // Convert to Unix timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const duration = Math.max(0, currentTimestamp - proposalTimestamp); */}

          {/* <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }} style={{ cursor: 'pointer' }} onClick={() => handleToggle(index)}>
            <Typography>
              {proposal.title}
            </Typography>
            <Typography variant="body1">{proposal.description}</Typography>
            {expanded === index && (
              <Box sx={{ mt: 1 }}> */}
                {/* <Typography variant="body2">Time left: {duration} seconds</Typography> */}
                {/* <Typography variant="body2">Address: {proposal.proposal_address}</Typography> */}
                {/* Add more details as needed */}
              {/* </Box> */}
            {/* )} */}
          {/* </Box> */}
        
      {/* })} */}
    </Box>
  );
};

export default ViewProposals;
