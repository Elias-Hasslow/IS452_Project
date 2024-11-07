import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home'; // Create this component
import CreateProposal from './components/CreateProposal'; // Create this component
import Vote from './components/Vote'; // Create this component
import ViewProposals from './components/ViewProposals'; // Create this component
import Results from './components/Results'; // Create this component
import VotingSystem from './VotingSystem.json'; // Import your contract ABI
import IndividualProposal from './components/IndividualProposal';
import LoginPage from './components/LoginPage'; 

import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

const App = () => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  function NavButton({ to, label }) {
    return (
      <Button
        component={Link}
        to={to}
        sx={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 20px',
          borderRadius: '10px',
          transition: 'background-color 0.3s, transform 0.3s',
          '&:hover': {
            backgroundColor: '#4CAF50', 
            transform: 'scale(1.05)', // Slight zoom-in on hover
          },
          fontWeight: '600',
          letterSpacing: '0.5px', // Modern look with letter spacing
        }}
      >
        {label}
      </Button>
    );
  }

  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(async (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]); // Set the first account as the active account

              // Initialize contract
              const networkId = await web3Instance.eth.net.getId();
              const deployedNetwork = VotingSystem.networks[networkId];
              const contractInstance = new web3Instance.eth.Contract(
                VotingSystem.abi,
                deployedNetwork && deployedNetwork.address,
              );

              setWeb3(web3Instance);
              setContract(contractInstance);
            } else {
              alert('Please connect to MetaMask.');
            }
          })
          .catch((error) => {
            if (error.code === 4001) {
              // User denied account access
              alert('Please allow access to your accounts in MetaMask.');
            } else {
              console.error('Error requesting accounts:', error);
            }
          });
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('An error occurred while connecting to MetaMask. Check console for details.');
    }
  };

  useEffect(() => {
    initWeb3();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('walletAddress');
    setIsAuthenticated(false);
  }

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        {/* <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Proposal</Link></li>
            <li><Link to="/vote">Vote</Link></li>
            <li><Link to="/proposals">View Proposals</Link></li>
            <li><Link to="/results">Results</Link></li>
          </ul>
        </nav> */}

        <Typography variant="h4" align="center" sx={{ color: '#333', mt: 4, fontWeight:'bold' }}>Voting DApp</Typography>

        <AppBar position="static" sx={{ 
            bgcolor: '#388E3C', 
            mt: 3, 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
            borderRadius: 0, 
            mx: 'auto',
        }}>
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <NavButton to="/homepage" label="Home" />
              <NavButton to="/create" label="Create Proposal" />
              {/* <NavButton to="/vote" label="Vote" /> */}
              <NavButton to="/proposals" label="View Proposals" />
              {/* <NavButton to="/results" label="Results" /> */}
              {isAuthenticated ? <NavButton onClick={handleLogout} to="/" label="Logout" />: null}

            </Box>
          </Toolbar>
        </AppBar>
  
        {/* Content Container */}
        <Container maxWidth="md">
          <Box sx={{bgcolor: 'white', p: 2, mt: 2, borderRadius: 1, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Box>
              {/* Pass account and contract to components */}
              <Routes>
                <Route path="/" element={<LoginPage setAuth={setIsAuthenticated}/>} />
                <Route path="/homepage" element={<Home account={account} />} />
                <Route path="/create" element={isAuthenticated ? <CreateProposal account={account} contract={contract} />: <Navigate to="/" />} />
                {/* <Route path="/vote" element={<Vote account={account} contract={contract} />} /> */}
                <Route path="/proposals" element={isAuthenticated ? <ViewProposals account={account} contract={contract} /> : <Navigate to="/" />} />
                <Route path="/proposals/:id" element={isAuthenticated ? <IndividualProposal account={account} contract={contract} /> : <Navigate to="/" />} />
                {/* <Route path="/results" element={<Results account={account} contract={contract} />} /> */}
              </Routes>
            </Box>
          </Box>
        </Container>
      </div>
    </Router>
  );  
};

export default App;
