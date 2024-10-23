import React, { useCallback, useEffect, useState } from 'react';
import useContract from '../hooks/useContract'; // Ensure this is correct for a default export

const ViewProposals = () => {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { contract, account } = useContract(); // Destructure the returned object to get contract and account

  const fetchProposals = useCallback(async () => {
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

  return (
    <div>
      <h1>Active Proposals</h1>
      {/* Render activeProposals */}
      <h1>Past Proposals</h1>
      {/* Render pastProposals */}
    </div>
  );
};

export default ViewProposals;