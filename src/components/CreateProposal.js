// src/components/CreateProposal.js
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, CircularProgress, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { postProposal } from '../axios/proposal';
import axios from 'axios';
import { getUsers } from '../axios/users';
import { addSecondsToCurrentDate } from './datetimeHelper';

const CreateProposal = ({ account, contract }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // const [users, setUsers] = useState([]);
  // const [userID, setUserID] = useState([]); // Store user IDs and usernames
  // const [selectedUserTokenPairs, setSelectedUserTokenPairs] = useState([{ userId: '', tokens: '0' }]); // Initialize with one pair as string for token
  
  // useEffect(() => {
  //   getUsers().then((response) => {
  //     setUsers(response);
      
  //     // Create an array of user objects with userId and username
  //     const userIdArray = response.map(user => ({
  //       userId: user.uid,   // Map uid to userId
  //       username: user.username // Include username if needed
  //     }));

  //     // Set the userId array to userID state
  //     setUserID(userIdArray);
  //   });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log({
      name,
      description,
      duration,
    });

    try {
      // Call the smart contract function to create a proposal
      const result = await contract.methods.createProposal(name, description, duration)
        .send({ from: account });
      
      let deadline = addSecondsToCurrentDate(duration);
      
      let proposal = JSON.stringify({
        "name": name,
        "description": description,
        "deadline": deadline,
      })

      console.log(proposal)

      const axios_result = await postProposal(proposal);

      if (axios_result) {
        console.log("Proposal submitted successfully:", result);
      } else {
        console.error("Error submitting proposal");
      }

    //   // Update message on success
      //setMessage(`Proposal created successfully! Transaction hash: ${result.transactionHash}`);
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
      <Box sx={{ pt: 2, mb: 3 }}>
        <Typography variant="h4">Create Proposal</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth label="Name" variant="outlined" value={name}
            onChange={(e) => setName(e.target.value)} required
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth label="Description" variant="outlined" value={description}
            onChange={(e) => setDescription(e.target.value)} required
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth label="Duration (in seconds)" variant="outlined"
            type="number" value={duration}
            onChange={(e) => setDuration(e.target.value)} required
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading} sx={{ minWidth: 150 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Proposal'}
          </Button>
        </Box>
      </form>
      {message && <Typography variant="body1">{message}</Typography>} {/* Display message to the user */}
    </Box>
  );
};

export default CreateProposal;
