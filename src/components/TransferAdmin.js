import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransferAdmin = ({ account, contract }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [message, setMessage] = useState('');

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleTransferAdmin = async () => {
    if (!selectedUsername) {
      setMessage('Please select a user.');
      return;
    }

    // Find the selected user using the username
    const selectedUser = users.find(
      (user) => user.username === selectedUsername
    );

    if (!selectedUser) {
      setMessage('Selected user not found.');
      return;
    }

    const newAdminAddress = selectedUser.wallet_address;

    try {
      // Transfer admin privileges in the smart contract
      await contract.methods
        .transferAdmin(newAdminAddress)
        .send({ from: account });

      // Get fresh list of all users
      const response = await axios.get('http://127.0.0.1:5000/users');
      const allUsers = response.data;

      // Set all users to 'User' role
      for (const user of allUsers) {
        await axios.put(`http://127.0.0.1:5000/users/${user.uid}`, {
          role: 'User'
        });
      }

      // Set new admin's role
      await axios.put(`http://127.0.0.1:5000/users/${selectedUser.uid}`, {
        role: 'Admin'
      });

      setMessage(`Admin privileges transferred to ${selectedUser.username}`);
    } catch (error) {
      console.error('Error transferring admin privileges:', error);
      setMessage('An error occurred while transferring admin privileges.');
    }
  };

  return (
    <div>
      <h2>Transfer Admin Privileges</h2>
      <p>Select the new admin from the list below:</p>
      <select
        value={selectedUsername}
        onChange={(e) => setSelectedUsername(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="">-- Select User --</option>
        {users
          .filter((user) => user.role !== 'Admin') // Exclude admin users
          .map((user) => (
            <option key={user.username} value={user.username}>
              {user.username}
            </option>
          ))}
      </select>
      <button onClick={handleTransferAdmin}>Transfer Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TransferAdmin;