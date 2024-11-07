import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { getUsers } from '../axios/users';


// const xorHash = (input, key) => {
//   return input
//     .split('')
//     .map((char) => String.fromCharCode(char.charCodeAt(0) ^ key))
//     .join('');
// };

const LoginPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState({});

  const navigate = useNavigate();

  const correctHashedPassword = "password"; // Store this securely
  const xorKey = 11111111;

  useEffect(() => {
    getUsers().then((response) => {
      let walletArray = []
      response.forEach((user) => {
        walletArray[user.username] = user.wallet_address;
      });
      setUsers(walletArray);
      console.log(walletArray);
    });
  }, []);

  const handleLogin = () => {
    //const hashedInput = xorHash(password, xorKey);
    if (users) {   
      if (password === correctHashedPassword && users[username])  {
        
        const walletAddress = users[username];
        sessionStorage.setItem('walletAddress', walletAddress);

        setAuth(true); // Set authentication to true
        navigate('/homepage'); // Redirect to home page
      } else {
        alert('Incorrect password');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
