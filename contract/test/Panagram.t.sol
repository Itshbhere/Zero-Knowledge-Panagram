// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Panagram} from "../src/Panagram.sol";
import {HonkVerifier} from "../src/PanagramBerifier.sol";

contract PanagramTest is Test {
    HonkVerifier public verifier;
    Panagram public panagram;
    uint256 public constant FIELD_MODULUS =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    bytes32 answer = bytes32(uint256(keccak256("DeathGod")) % FIELD_MODULUS);

    function setUp() public {
        // Deploy the verifier contract
        verifier = new HonkVerifier();

        // Deploy the Panagram contract with the verifier
        panagram = new Panagram(verifier);

        // Start a new round with a sample answer

        panagram.startRound(answer);
    }

    function getProof(bytes32 guess, bytes32 CorrectAnswer) internal {
        uint256 MAX_INPUTS = 5;
        string[] memory inputs = new string[](MAX_INPUTS);
        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/generateProof.ts";
        inputs[3] = vm.toString(guess);
        inputs[4] = vm.toString(CorrectAnswer);

        bytes memory proof = vm.ffi(inputs);
        // return proof;
    }
}
