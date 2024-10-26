// src/components/Home.js
import React from 'react';
import { useEffect } from 'react';

const Home = () => {

   // Test connection to the DB
   const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data:", data);
    } catch (err) {
    } finally {
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div>
      <h2>Welcome to the Voting System</h2>
      <p>This platform allows shareholders to create proposals and vote.</p>
    </div>
  );
};

export default Home;
