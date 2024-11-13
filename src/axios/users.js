import axios from "./axios";

// Fetch all users
export const getUsers = async () => {
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// Fetch a single user by UID
export const getUserById = async (uid) => {
    try {
        const response = await axios.get(`/users/${uid}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with UID ${uid}:`, error);
        return null;
    }
};

// Add a new user
export const addUser = async (userData) => {
    try {
        const response = await axios.post('/users', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        return { error: "Failed to add user" };
    }
};

// Update an existing user by UID
export const updateUser = async (uid, userData) => {
    try {
        const response = await axios.put(`/users/${uid}`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with UID ${uid}:`, error);
        return { error: "Failed to update user" };
    }
};

// Delete a user by UID
export const deleteUser = async (uid) => {
    try {
        const response = await axios.delete(`/users/${uid}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with UID ${uid}:`, error);
        return { error: "Failed to delete user" };
    }
};


export const getUserProposals = async (uid, pid) => {
    try {
        const response = await axios.get(`/userproposals/${uid}/${pid}`);
        console.log("Fetched user proposal response:", response);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user proposals with UID ${uid} and PID ${pid}:`, error);
        return null;
    }
}
