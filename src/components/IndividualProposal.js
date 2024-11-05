import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

import { Box, Typography, CircularProgress, Button } from "@mui/material";

const IndividualProposal = ({account, contract}) => {
    const { id } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchProposal = async () => {
        if (!contract) {
          setError('Contract is not initialized');
          setLoading(false);
          return;
        }
  
        try {
          const proposal = await contract.methods.proposals(id).call();
          const { description, deadline, yesVotes, noVotes } = proposal;
          const totalVotes = Number(yesVotes) + Number(noVotes);
          const yesPercentage = totalVotes > 0 ? (Number(yesVotes) / totalVotes) * 100 : 0;
          const noPercentage = totalVotes > 0 ? (Number(noVotes) / totalVotes) * 100 : 0;
          
          const deadlineDate = new Date(Number(deadline) * 1000);
          const currentDate = new Date();

          setProposal({
            description,
            deadline: deadlineDate.toLocaleString(),
            yesVotes: yesVotes.toString(),
            noVotes: noVotes.toString(),
            yesPercentage: yesPercentage.toFixed(2),
            noPercentage: noPercentage.toFixed(2),
            isVotingEnded: deadlineDate < currentDate
          });
        } catch (err) {
          setError(`Error fetching proposal: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProposal();
    }, [contract, id]);

    const vote = async (vote) => {
        try { 
          if (vote === "yes") {
            await contract.methods.vote(id, true)
            .send({ from: account });
          }

          else {
            await contract.methods.vote(id, false)
            .send({ from: account });
          }
        } catch (error) {
          console.error('Error voting:', error);
          setError('An error occurred while voting. Check the console for details.');
        }
    };
  
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    //if (error) return <Typography color="error">{error}</Typography>;
  
    return (
      <Box sx={{ padding: 4 }}>
        {proposal && (
        <Box>
          <Box>
            <Typography variant="h4" gutterBottom>{proposal.description}</Typography>
            <Typography variant="body1" color="textSecondary">Deadline: {proposal.deadline}</Typography>
            <Typography variant="body1">Yes Votes: {proposal.yesVotes} ({proposal.yesPercentage}%)</Typography>
            <Typography variant="body1">No Votes: {proposal.noVotes} ({proposal.noPercentage}%)</Typography>
            <Typography variant="body1">Total Votes: {Number(proposal.yesVotes) + Number(proposal.noVotes)}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
              {proposal.isVotingEnded ? (
                  <Typography variant="body1" color="textSecondary">Voting has ended. Results are displayed above.</Typography>
              ) : (
                  <>
                      <Button variant="contained" color="primary" onClick={() => vote("yes")}>Vote Yes</Button>
                      <Button variant="contained" color="warning" sx={{ ml: 2 }} onClick={() => vote("no")}>Vote No</Button>
                  </>
              )}
          </Box>
          <Box>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
        )}
      </Box>
    );
  };
  

export default IndividualProposal;