import React, { useCallback, useEffect, useState } from 'react';
import useContract from '../hooks/useContract'; // Ensure this is correct for a default export

const ViewProposals = () => {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contract = useContract(); // Assuming you have a hook to get the contract instance

  const fetchProposals = useCallback(async () => {
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
          noPercentage: noPercentage.toFixed(2),
          votingEnded,
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
      console.error('Error fetching proposals:', err);
      setError('Failed to fetch proposals. Check console for details.');
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Active Proposals</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Deadline</th>
            <th>Yes Votes (%)</th>
            <th>No Votes (%)</th>
          </tr>
        </thead>
        <tbody>
          {activeProposals.map((proposal) => (
            <tr key={proposal.id}>
              <td>{proposal.description}</td>
              <td>{proposal.deadline}</td>
              <td>{proposal.yesPercentage}</td>
              <td>{proposal.noPercentage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Past Proposals</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Deadline</th>
            <th>Yes Votes (%)</th>
            <th>No Votes (%)</th>
          </tr>
        </thead>
        <tbody>
          {pastProposals.map((proposal) => (
            <tr key={proposal.id}>
              <td>{proposal.description}</td>
              <td>{proposal.deadline}</td>
              <td>{proposal.yesPercentage}</td>
              <td>{proposal.noPercentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProposals;
