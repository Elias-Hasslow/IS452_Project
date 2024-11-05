import axios from "./axios";

export const getUsers = async () => {
    try {
        const response = await axios.get('/users');
        //console.log("API users", response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}