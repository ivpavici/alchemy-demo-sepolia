// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IWinAttempt {
    function attempt() external;
}

contract Player {
    address targetContract;

    constructor(address _targetContract) {
        targetContract = _targetContract;
    }

    function play() public {
        IWinAttempt(targetContract).attempt();
    }
}
