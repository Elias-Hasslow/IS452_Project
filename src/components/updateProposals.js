import { getProposals, postProposal } from '../axios/proposal';
import { addSecondsToCurrentDate } from './datetimeHelper';

async function updateProposals(contract) {
    if (!contract) {
        console.error("Contract is not initialized");
        return;
    }

    // Fetch proposals from the database
    let DbProposals = [];
    try {
        DbProposals = await getProposals();
        console.log("this is db proposal", DbProposals);
    } catch (error) {
        console.error("Error fetching proposals:", error);
    }


    // Function to convert Unix timestamp to "YYYY-MM-DD HH:MM:SS" format
    const formatTimestamp = (timestamp) => {
        // Ensure the timestamp is in seconds, then convert to milliseconds
        const date = new Date(Math.floor(Number(timestamp)) * 1000);  // Convert to milliseconds
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        console.log("seconds", typeof(seconds));
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Fetch proposals from the smart contract
    const fetchSmartContractProposals = async () => {
        try {
            const proposalCount = await contract.methods.proposalCount().call();
            const proposals = [];

            for (let i = 0; i < proposalCount; i++) {
                const proposal = await contract.methods.proposals(i).call();
                proposals.push({
                    pid: i,
                    name: proposal.name,
                    description: proposal.description,
                    deadline: proposal.deadline,
                    yesVotes: Number(proposal.yesVotes),
                    noVotes: Number(proposal.noVotes),
                });
            }
            return proposals;
        } catch (error) {
            console.error("Error fetching proposals from contract:", error);
        }
    };

    const contractProposals = await fetchSmartContractProposals();

    const newProposals = contractProposals?.filter(
        (contractProposal) =>
            !DbProposals.some((dbProposal) => dbProposal.pid === contractProposal.pid)
    );

    console.log("this is contract proposal", contractProposals);
    ///console.log("this is db proposal", DbProposals);

    // Add each new proposal to the database
    for (const proposal of newProposals) {
        try {
            const proposalNew = {
                pid : proposal.pid,
                name: proposal.name,
                description: proposal.description,
                deadline: formatTimestamp(proposal.deadline), 
                total_yes_votes: proposal.yesVotes,
                total_no_votes: proposal.noVotes,
                total_votes: proposal.yesVotes + proposal.noVotes,
            };
            await postProposal(proposalNew);
            DbProposals.push(proposalNew); // Update DbProposals array
        } catch (error) {
            console.error("Error posting proposal:", error);
        }
    }

    console.log("New Proposals Added:", newProposals);
    console.log("DB proposal after push", DbProposals);
    return newProposals;
}

export default updateProposals;
