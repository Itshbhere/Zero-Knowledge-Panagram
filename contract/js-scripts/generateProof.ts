import { Noir } from "@noir-lang/noir_js";
import {ethers} from "ethers";
import {UltraHonkBackend} from "@aztec/bb.js";

//////--------------Steps to generate a proof------------------//////
// 1. Get The Circuit File
// 2. Initialize Noir with the Circuit File
// 3. Initialize the Backend using the circuit bytecode
// 4. Create The Inputs
// 5. Execute the circuit with the inputs to create the witness
// 6. Generate the proof(Using Backend) via witness
// 7. Return the proof