// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IVerifier} from "./PanagramBerifier.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Panagram is ERC1155, Ownable {
    IVerifier public verifier;
    uint256 public constant MINIMUM_DURATION = 1;
    uint256 public constant MAXIMUM_DURATION = 3 days;
    uint256 public RoundStartTime;
    bytes32 public s_answer; // Hash of the Answer
    address public CurrentroundWinner;
    uint256 public RoundNumber = 0;
    mapping(address => uint256) public LastGuessRound;

    event VerifierUpdated(address newVerifier);
    event RoundStarted(bytes32 answer);
    event Panagram__WinnerCrowned(address winner, uint256 roundNumber);
    event Panagram__RunnerUpCrowned(address winner, uint256 indexed roundNumber);

    error MinimumTimenotPassed(uint256 minimumDuration, uint256 roundStartTime);
    error NoRoundWinner();
    error InvalidGuess();
    error PanagramRoundHasntStarted();
    error GuessAlreadyMade(address player, uint256 roundNumber);
    error InvalidProof();

    constructor(IVerifier _verifier)
        Ownable(msg.sender)
        ERC1155(
            "https://lavender-solid-muskox-330.mypinata.cloud/ipfs/bafybeih3rysglzxswoj4cztgafbgt6fxq2ahwyphljt57fmbyaywpnwquu/{id}.json"
        )
    {
        verifier = _verifier;
    }

    function setURI(string memory newuri) external {
        _setURI(newuri);
    }

    function startRound(bytes32 _answer) external onlyOwner {
        if (RoundStartTime == 0) {
            RoundStartTime = block.timestamp;
            s_answer = _answer;
        } else {
            if (block.timestamp < RoundStartTime + MINIMUM_DURATION) {
                revert MinimumTimenotPassed(MINIMUM_DURATION, RoundStartTime + MINIMUM_DURATION);
            }
            if (CurrentroundWinner == address(0)) {
                revert NoRoundWinner();
            } else {
                RoundStartTime = block.timestamp;
                CurrentroundWinner = address(0);
                s_answer = _answer;
            }
        }

        RoundNumber++;
        emit RoundStarted(_answer);
    }

    function makeGuess(bytes calldata proof) external returns (bool) {
        if (RoundNumber == 0) {
            revert PanagramRoundHasntStarted();
        }
        if (LastGuessRound[msg.sender] == RoundNumber) {
            revert GuessAlreadyMade(msg.sender, RoundNumber);
        }

        bytes32[] memory PublicInputs = new bytes32[](2);
        PublicInputs[0] = s_answer;
        PublicInputs[1] = bytes32(uint256(uint160(msg.sender)));
        bool isValid = verifier.verify(proof, PublicInputs);
        if (!isValid) {
            revert InvalidProof();
        }
        LastGuessRound[msg.sender] = RoundNumber;
        if (CurrentroundWinner != address(0)) {
            _mint(msg.sender, 1, 1, "");
            emit Panagram__RunnerUpCrowned(CurrentroundWinner, RoundNumber);
            return true;
        } else {
            CurrentroundWinner = msg.sender;
            _mint(msg.sender, 0, 1, "");
            emit Panagram__WinnerCrowned(msg.sender, RoundNumber);
            return true;
        }
    }

    function updateVerifier(IVerifier newVerifier) external {
        require(address(newVerifier) != address(0), "New verifier cannot be zero address");
        emit VerifierUpdated(address(newVerifier));
        verifier = newVerifier;
    }
}
