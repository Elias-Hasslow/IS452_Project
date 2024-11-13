import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { voteOnProposal } from "../axios/proposal";
import { getUserProposals } from "../axios/users";


const IndividualProposal = ({account, contract}) => {
    const { id } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [hasEnded, setHasEnded] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    
    const role = sessionStorage.getItem('role');
    const uid = sessionStorage.getItem('uid');
    let proposaldata = {
      pid: id,
      uid: uid,
      vote: 0
    }
    useEffect(() => {
      const fetchProposal = async () => {
        if (!contract) {
          setError('Contract is not initialized');
          setLoading(false);
          return;
        }
  
        try {
          const proposal = await contract.methods.proposals(id).call();
          const { name, description, deadline, yesVotes, noVotes } = proposal;
          const totalVotes = Number(yesVotes) + Number(noVotes);
          const yesPercentage = totalVotes > 0 ? (Number(yesVotes) / totalVotes) * 100 : 0;
          const noPercentage = totalVotes > 0 ? (Number(noVotes) / totalVotes) * 100 : 0;
          
          const deadlineDate = new Date(Number(deadline) * 1000);
          const currentDate = new Date();

          setProposal({
            name: name,
            description,
            deadline: deadlineDate.toLocaleString(),
            yesVotes: yesVotes.toString(),
            noVotes: noVotes.toString(),
            yesPercentage: yesPercentage.toFixed(2),
            noPercentage: noPercentage.toFixed(2),
            isVotingEnded: deadlineDate < currentDate
          });
          if (proposal.isVotingEnded){
            setHasEnded(true);
          }
        } catch (err) {
          setError(`Error fetching proposal: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProposal();
    }, [contract, id]);

    useEffect(() => {
      const fetchUserProposal = async () => {
        const userProposal = await getUserProposals(uid, id);
    
        if (userProposal) {
          setHasVoted(true);
        }
      };
      console.log("this is id", id);
      fetchUserProposal();
    }, [uid, id]);

    const vote = async (vote) => {
        try { 
          if (vote === "yes") {
            proposaldata.vote = 1;
            const response = await voteOnProposal(JSON.stringify(proposaldata));
            console.log(response);
            await contract.methods.vote(id, true)
            .send({ from: account });
          }

          else {
            const response = await voteOnProposal(JSON.stringify(proposaldata));
            console.log(response);
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
            <Typography variant="h4" gutterBottom>{proposal.name}</Typography>
            <Typography variant="body1" color="textSecondary">Deadline: {proposal.deadline}</Typography>
            <Typography variant="body1">{proposal.description}</Typography>
            {(role === "admin" || hasEnded === true) ? (
                  <>
                      <Typography variant="body1">Yes Votes: {proposal.yesVotes} ({proposal.yesPercentage}%)</Typography>
                      <Typography variant="body1">No Votes: {proposal.noVotes} ({proposal.noPercentage}%)</Typography>
                      <Typography variant="body1">Total Votes: {Number(proposal.yesVotes) + Number(proposal.noVotes)}</Typography> 
                  </>
              ) : null}
          </Box>
          <Box sx={{ mt: 2 }}>
            {proposal.isVotingEnded ? (
              <Typography variant="body1" color="textSecondary">
                Voting has ended. Results are displayed above.
              </Typography>
            ) : hasVoted ? (
              <Typography variant="body1" color="textSecondary">
                You have voted already
              </Typography>
            ) : (
              <>
                <Button variant="contained" color="primary" onClick={() => vote("yes")}>
                  Vote Yes
                </Button>
                <Button variant="contained" color="warning" sx={{ ml: 2 }} onClick={() => vote("no")}>
                  Vote No
                </Button>
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