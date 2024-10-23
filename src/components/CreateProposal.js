// src/components/CreateProposal.js
import React, { useState } from 'react';

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
    <div>
      <h2>Create Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Duration (in seconds):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>
      {message && <p>{message}</p>} {/* Display message to the user */}
    </div>
  );
};

export default CreateProposal;
