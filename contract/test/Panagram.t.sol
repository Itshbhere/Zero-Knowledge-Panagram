// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Panagram} from "../src/Panagram.sol";
import {HonkVerifier} from "../src/PanagramBerifier.sol";

contract PanagramTest is Test {
    HonkVerifier public verifier;
    Panagram public panagram;
    address public User = makeAddr("User");
    address public SecondUser = makeAddr("SecondUser");
    uint256 public constant FIELD_MODULUS =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    bytes32 answer = bytes32(
        uint256(keccak256(abi.encodePacked(bytes32(uint256(keccak256("DeathGod")) % FIELD_MODULUS)))) % FIELD_MODULUS
    );

    bytes32 public constant GuessAnswer = bytes32(uint256(keccak256("DeathGod")) % FIELD_MODULUS);

    error InvalidProof();

    function setUp() public {
        vm.startPrank(User);
        // Deploy the verifier contract
        verifier = new HonkVerifier();

        // Deploy the Panagram contract with the verifier
        panagram = new Panagram(verifier);

        // Start a new round with a sample answer

        panagram.startRound(answer);

        console.log(panagram.owner());
        console.log(User);
        vm.stopPrank();
    }

    function getProof(bytes32 guess, bytes32 CorrectAnswer, address sender) internal returns (bytes memory proof) {
        uint256 MAX_INPUTS = 6;
        string[] memory inputs = new string[](MAX_INPUTS);
        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/generateProof.ts";
        inputs[3] = vm.toString(guess);
        inputs[4] = vm.toString(CorrectAnswer);
        inputs[5] = vm.toString(sender);

        bytes memory encodedProof = vm.ffi(inputs);
        proof = abi.decode(encodedProof, (bytes));
        console.logBytes(proof);
        return proof;
    }

    function testPanagramGuess() public {
        vm.prank(User);
        bytes memory proof = getProof(GuessAnswer, answer, User);
        panagram.makeGuess(proof);

        vm.assertEq(panagram.balanceOf(User, 0), 1, "User should have 1 token after correct guess");
        vm.assertEq(panagram.balanceOf(User, 1), 0, "User should have 1 token after correct guess");

        vm.prank(User);
        vm.expectRevert();
        panagram.makeGuess(proof);
    }

    function testPanagramSecondGuess() public {
        vm.prank(User);
        bytes memory proof = getProof(GuessAnswer, answer, User);
        panagram.makeGuess(proof);

        vm.assertEq(panagram.balanceOf(User, 0), 1, "User should have 1 token after correct guess");
        vm.assertEq(panagram.balanceOf(User, 1), 0, "User should have 0 token after correct guess");

        vm.prank(SecondUser);
        bytes memory proof2 = getProof(GuessAnswer, answer, SecondUser);
        console.logBytes(proof2);
        panagram.makeGuess(proof2);

        vm.assertEq(panagram.balanceOf(SecondUser, 0), 0, "User should have 0 token after correct guess");
        vm.assertEq(panagram.balanceOf(SecondUser, 1), 1, "User should have 1 token after correct guess");
    }

    function testRoundStart() public {
        vm.startPrank(User);
        bytes memory proof = getProof(GuessAnswer, answer, User);
        panagram.makeGuess(proof);

        vm.assertEq(panagram.balanceOf(User, 0), 1, "User should have 1 token after correct guess");
        vm.assertEq(panagram.balanceOf(User, 1), 0, "User should have 0 token after correct guess");
        vm.stopPrank();

        vm.startPrank(SecondUser);
        bytes memory proof2 = getProof(GuessAnswer, answer, SecondUser);
        panagram.makeGuess(proof2);

        vm.assertEq(panagram.balanceOf(SecondUser, 0), 0, "User should have 0 token after correct guess");
        vm.assertEq(panagram.balanceOf(SecondUser, 1), 1, "User should have 1 token after correct guess");
        vm.stopPrank();

        bytes32 newAnswer = bytes32(
            uint256(keccak256(abi.encodePacked(bytes32(uint256(keccak256("Reborn")) % FIELD_MODULUS)))) % FIELD_MODULUS
        );
        // Start a new round
        vm.startPrank(User);
        vm.warp(panagram.MINIMUM_DURATION() + 1);
        panagram.startRound(newAnswer);

        vm.assertEq(panagram.RoundNumber(), 2, "Round number should be 2");
        vm.assertEq(panagram.s_answer(), newAnswer, "Current answer should be the new answer");
        vm.assertEq(panagram.CurrentroundWinner(), address(0), "Current round winner should be 0");
        vm.stopPrank();
    }

    function testIncorrectGuess() public {
        vm.startPrank(User);
        bytes32 newAnswer = bytes32(
            uint256(keccak256(abi.encodePacked(bytes32(uint256(keccak256("Reborn")) % FIELD_MODULUS)))) % FIELD_MODULUS
        );
        bytes32 GuestAnswer = bytes32(uint256(keccak256("Reborn")) % FIELD_MODULUS);
        bytes memory proof = getProof(GuestAnswer, newAnswer, User);
        vm.expectRevert();
        panagram.makeGuess(proof);
        vm.stopPrank();
    }
}
