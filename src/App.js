import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home'; // Create this component
import CreateProposal from './components/CreateProposal'; // Create this component
import Vote from './components/Vote'; // Create this component
import ViewProposals from './components/ViewProposals'; // Create this component
import Results from './components/Results'; // Create this component
import VotingSystem from './VotingSystem.json'; // Import your contract ABI

const App = () => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

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

  return (
    <Router>
      <div>
        <h1>Voting DApp</h1>  
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Proposal</Link></li>
            <li><Link to="/vote">Vote</Link></li>
            <li><Link to="/proposals">View Proposals</Link></li>
            <li><Link to="/results">Results</Link></li>
          </ul>
        </nav>
  
        {/* Content Container */}
        <div className="container">
          {/* Pass account and contract to components */}
          <Routes>
            <Route path="/" element={<Home account={account} />} />
            <Route path="/create" element={<CreateProposal account={account} contract={contract} />} />
            <Route path="/vote" element={<Vote account={account} contract={contract} />} />
            <Route path="/proposals" element={<ViewProposals account={account} contract={contract} />} />
            <Route path="/results" element={<Results account={account} contract={contract} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );  
};

export default App;
