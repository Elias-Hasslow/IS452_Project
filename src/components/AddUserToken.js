import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, CircularProgress, MenuItem } from '@mui/material';
import { addUser, updateUser } from '../axios/users';

const AddUserToken = (account, contract) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [newUserData, setNewUserData] = useState({
        role: 'admin',
        token: 0,
        username: '',
        wallet_address: ''
    });
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [addUserResponseMessage, setAddUserResponseMessage] = useState('');

    useEffect(() => {
        console.log(loading);
    }, [loading]);

    // Handler for updating existing user token
    const handleUpdateToken = async () => {
        setLoading(true);
        try {
            // Make an axios PUT/POST request for updating token amount
            const updateToken = await updateUser(3, { token: tokenAmount });
            if (updateToken.error) {
                throw new Error("Error updating token.");
            }
            else {
                console.log("Token updated successfully!");
                setResponseMessage("Token updated successfully!");
            }
        } catch (error) {
            setResponseMessage("Error updating token.");
        } finally {
            setLoading(false);
        }
    };

    // Handler for creating a new user
    const handleCreateUser = async () => {
        setLoading(true);
        try {
            // Make an axios POST request for creating a new user
            const createUser = await addUser(newUserData);
            if (createUser.error) {
                throw new Error("Error creating user.");
            }
            else {
                console.log("User created successfully!");
                setAddUserResponseMessage("User created successfully!");
            }
        } catch (error) {
            setAddUserResponseMessage("Error creating user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h6">Update Token for Existing User</Typography>
            <Box display="flex" flexDirection="column" mb={2}>
                <TextField
                    label="Wallet Address"
                    variant="outlined"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Token Amount"
                    variant="outlined"
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateToken}
                    disabled={loading || !walletAddress || !tokenAmount}
                >
                    {loading ? <CircularProgress size={24} /> : "Update Token"}
                </Button>
                {responseMessage && (
                    <Typography color="secondary" variant="body2" mt={2}>
                        {responseMessage}
                    </Typography>
                )}
            </Box>

            <Typography variant="h6">Add New User</Typography>
            <Box display="flex" flexDirection="column">
                <TextField
                    label="Username"
                    variant="outlined"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                
                <TextField
                    label="Role"
                    variant="outlined"
                    select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                </TextField>
                <TextField
                    label="Wallet Address"
                    variant="outlined"
                    value={newUserData.wallet_address}
                    onChange={(e) => setNewUserData({ ...newUserData, wallet_address: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Token Amount"
                    variant="outlined"
                    type="number"
                    value={newUserData.token}
                    onChange={(e) => setNewUserData({ ...newUserData, token: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateUser}
                    disabled={loading || !newUserData.username || !newUserData.wallet_address}
                >
                    {loading ? <CircularProgress size={24} /> : "Create User"}
                </Button>
            </Box>

            {addUserResponseMessage && (
                <Typography color="secondary" variant="body2" mt={2}>
                    {addUserResponseMessage}
                </Typography>
            )}
        </Box>
    );
};

export default AddUserToken;
