import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const ViewTokens = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from your API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 5, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
        Users and Their Token Balances
      </Typography>

      {users.length === 0 ? (
        <Typography sx={{ textAlign: 'center' }}>No users available.</Typography>
      ) : (
        users
          .filter(user => user.token > 0)
          .map((user, index) => (
            <Card key={index} sx={{ mb: 2, mx: 'auto', maxWidth: 600 }}>
              <CardContent>
                <Typography variant="h6">User ID: {user.id}</Typography>
                <Typography variant="body1">Username: {user.username}</Typography>
                <Typography variant="body2">Tokens: {user.token}</Typography>
              </CardContent>
            </Card>
          ))
      )}
    </Box>
  );
};

export default ViewTokens;