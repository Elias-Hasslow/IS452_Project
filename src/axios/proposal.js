import axios from "./axios";

export const getProposals = async () => {
  try {
    const response = await axios.get('/proposals');
    return response.data;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
};

export const getUniqueProposal = async (proposalId) => {
    try {
        const response = await axios.get(`/proposals/${proposalId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching proposal:", error);
        return null;
    }
}

export const postProposal = async (proposal) => {
    try {
        const response = await axios.post('/proposals', proposal, {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error posting proposal:", error);
        return null;
    }
};