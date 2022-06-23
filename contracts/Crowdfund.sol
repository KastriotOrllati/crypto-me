// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

struct Funder {
    address addr;
    uint256 amount;
}

contract Crowdfund {
    struct Campaign {
        address payable beneficiary;
        uint256 fundingGoal;
        uint256 numFunders;
        uint256 amount;
        string title;
        string description;
        string imageURL;
        Funder[] funders;

        // mapping(uint256 => Funder) funders;
    }

    uint256 numCampaigns;
    mapping(uint256 => Campaign) public campaigns;

    function newCampaign(
        address payable beneficiary,
        uint256 goal,
        string memory title,
        string memory description,
        string memory imageURL
    ) public returns (uint256 campaignID) {
        campaignID = numCampaigns++; // campaignID is return variable
        // We cannot use "campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0)"
        // because the right hand side creates a memory-struct "Campaign" that contains a mapping.
        Campaign storage c = campaigns[campaignID];
        c.beneficiary = beneficiary;
        c.fundingGoal = goal;
        c.title = title;
        c.description = description;
        c.imageURL = imageURL;
    }

    function contribute(uint256 campaignID) public payable {
        Campaign storage c = campaigns[campaignID];
        // Creates a new temporary memory struct, initialised with the given values
        // and copies it over to storage.
        // Note that you can also use Funder(msg.sender, msg.value) to initialise.
        // c.funders[c.numFunders++] = Funder({
        //     addr: msg.sender,
        //     amount: msg.value
        // });
        // if (c.amount >= c.fundingGoal) {
        //     revert();
        // }
        c.funders.push(Funder({addr: msg.sender, amount: msg.value}));
        c.numFunders++;
        c.amount += msg.value;
    }

    function checkGoalReached(uint256 campaignID)
        public
        returns (bool reached)
    {
        Campaign storage c = campaigns[campaignID];
        if (c.amount < c.fundingGoal) return false;
        uint256 amount = c.amount;
        c.amount = 0;
        c.beneficiary.transfer(amount);
        return true;
    }

    function getTotalCampaigns() public view returns (uint256) {
        return numCampaigns;
    }

    function getSpecificFunder(uint256 indexOfCampaign, uint256 indexOfFunder)
        public
        view
        returns (Funder memory)
    {
        return campaigns[indexOfCampaign].funders[indexOfFunder];
    }

    function getTotalFunders(uint256 index) public view returns (uint256) {
        return campaigns[index].numFunders;
    }

    function getAllCampaign() public view returns (Campaign[] memory) {
        Campaign[] memory items = new Campaign[](numCampaigns);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numCampaigns; i++) {
            items[currentIndex] = campaigns[i];
            currentIndex += 1;
        }
        return items;
    }

    function getAllFunders(uint256 index)
        public
        view
        returns (Funder[] memory)
    {
        uint256 nrFunders = campaigns[index].numFunders;
        Funder[] memory funders = new Funder[](nrFunders);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < nrFunders; i++) {
            funders[currentIndex] = campaigns[index].funders[i];
            currentIndex += 1;
        }
        return funders;
    }
}

// pragma solidity >=0.7.0 <0.9.0;

// struct Funder {
//     address addr;
//     uint256 amount;
// }

// contract Crowdfund {
//     struct Campaign {
//         address payable beneficiary;
//         uint256 fundingGoal;
//         uint256 numFunders;
//         uint256 amount;
//         mapping(uint256 => Funder) funders;
//     }

//     uint256 numCampaigns;
//     mapping(uint256 => Campaign) public campaigns;

//     function newCampaign(address payable beneficiary, uint256 goal)
//         public
//         returns (uint256 campaignID)
//     {
//         campaignID = numCampaigns++; // campaignID is return variable
//         // We cannot use "campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0)"
//         // because the right hand side creates a memory-struct "Campaign" that contains a mapping.
//         Campaign storage c = campaigns[campaignID];
//         c.beneficiary = beneficiary;
//         c.fundingGoal = goal;
//     }

//     function contribute(uint256 campaignID) public payable {
//         Campaign storage c = campaigns[campaignID];
//         // Creates a new temporary memory struct, initialised with the given values
//         // and copies it over to storage.
//         // Note that you can also use Funder(msg.sender, msg.value) to initialise.
//         c.funders[c.numFunders++] = Funder({
//             addr: msg.sender,
//             amount: msg.value
//         });
//         c.amount += msg.value;
//     }

//     function checkGoalReached(uint256 campaignID)
//         public
//         returns (bool reached)
//     {
//         Campaign storage c = campaigns[campaignID];
//         if (c.amount < c.fundingGoal) return false;
//         uint256 amount = c.amount;
//         c.amount = 0;
//         c.beneficiary.transfer(amount);
//         return true;
//     }

//     function getTotalCampaigns() public view returns (uint256) {
//         return numCampaigns;
//     }

//     function getSpecificFunder(uint256 indexOfCampaign, uint256 indexOfFunder)
//         public
//         view
//         returns (Funder memory)
//     {
//         return campaigns[indexOfCampaign].funders[indexOfFunder];
//     }

//     function getTotalFunders(uint256 index) public view returns (uint256) {
//         return campaigns[index].numFunders;
//     }

//     // function getAllCampaign() public view returns (Campaign[] memory) {
//     //     Campaign[] memory all = new Campaign[](numCampaigns);

//     // }

//     //    function getCampaign(uint256 index) public view returns ( Campaign memory ) {
//     // return  campaigns[index];
//     // }

//     // function getCampaigns(address index) public view returns(Campaign) {
//     //     return campaigns[index];
//     // }
// }
