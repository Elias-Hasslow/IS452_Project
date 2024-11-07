import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Box, Typography, Select, MenuItem, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';

const ViewProposals = ({ contract }) => {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', or 'past'
  // const [proposals, setProposals] = useState([]);
  const [expanded, setExpanded] = useState(null); // Initialize the expanded state

  const navigate = useNavigate();

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
  
  useEffect(() => { 
    if (activeProposals.length > 0){
      console.log("Active Proposals: ", activeProposals);
    }
    else if (pastProposals.length > 0){
      console.log("Past Proposals: ", pastProposals);
    }
    const walletAddress = sessionStorage.getItem('walletAddress');
    //console.log(walletAddress); // Use this value as needed

  }, [activeProposals]);

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
        const { name, description, deadline, yesVotes, noVotes } = proposal;
        console.log("proposal", proposal);
        //console.log("current fetching proposal id: ", i);

        // Convert BigInt to Number
        const deadlineDate = new Date(Number(deadline) * 1000);
        const totalVotes = Number(yesVotes) + Number(noVotes); // Explicit conversion here
        const yesPercentage = totalVotes > 0 ? (Number(yesVotes) / totalVotes) * 100 : 0;
        const noPercentage = totalVotes > 0 ? (Number(noVotes) / totalVotes) * 100 : 0;

        const proposalData = {
          id: i,
          name: name,
          description,
          deadline: deadlineDate.toLocaleString(), // Convert deadline to Number
          yesPercentage: yesPercentage.toFixed(2),
        };
        // console.log(proposalData);
        
        if (Date.now() > deadlineDate.getTime()) {
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
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

  
  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <Box>
      <Box sx={{textAlign:"center"}}>
        <Typography variant="h4">{getTitle()}</Typography>
      </Box>

      <Box sx={{mt:2, mb:2, mr:2}}>
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
          <Card key={proposal.id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{proposal.name}</Typography>
              <Typography variant="body2" color="textSecondary">Deadline: {proposal.deadline}</Typography>
              <Typography variant="body2">Description: {proposal.description}</Typography>
              <Typography variant="body2">Yes Votes: {proposal.yesPercentage}%</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate(`/proposals/${proposal.id}`)}>
                View Details
              </Button>
            </CardActions>
          </Card>
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


