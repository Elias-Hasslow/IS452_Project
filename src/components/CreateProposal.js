// src/components/CreateProposal.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios'


const CreateProposal = ({ account, contract }) => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Call the smart contract function to create a proposal
      const result = await contract.methods.createProposal(description, duration)
        .send({ from: account });

          // Transaction was successful, add proposal to backend database
    await axios.post('http://localhost:5000/proposals', {
      proposal_address: result.transactionHash,
      description,
      duration,
    });

      // Update message on success
      setMessage(`Proposal created successfully! Transaction hash: ${result.transactionHash}`);
    } catch (error) {
      console.error('Error creating proposal:', error);
      setMessage('An error occurred while creating the proposal. Check the console for details.');
    } finally {
      setLoading(false);
      // Clear inputs
      setDescription('');
      setDuration(0);
    }
  };

  return (
    <Box>
      <Box sx={{pt:2, mb:3}}> 
        <Typography variant="h4">Create Proposal</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{mb:3}}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {/* <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          /> */}
        </Box>
        <Box sx={{mb:3}}>
          <TextField
            fullWidth
            label="Duration (in seconds)"
            variant="outlined"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          {/* <label>Duration (in seconds):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          /> */}
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'left', mt:2}}>
          <Button type="submit" variant="contained" color="success" disabled={loading} sx={{minWidth:150}}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Proposal'}
          </Button>
        </Box>
      </form>
      {message && <Typography variant="body1">{message}</Typography>} {/* Display message to the user */}
    </Box>
  );
};

export default CreateProposal;
