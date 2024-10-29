import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);

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

  return (
    <div>
      <h1>Proposals</h1>
      {proposals.map((proposal, index) => (
        <div key={index}>
          <h2>{proposal.title}</h2>
          <p>{proposal.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewProposals;
