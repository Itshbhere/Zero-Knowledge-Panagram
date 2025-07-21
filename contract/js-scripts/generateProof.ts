import { Noir } from "@noir-lang/noir_js";
import { ethers } from "ethers";
import { UltraHonkBackend } from "@aztec/bb.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

//////--------------Steps to generate a proof------------------//////
// 1. Get The Circuit File
const CircuitPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../Circuits/target/ZK_Panagram.json"
);

const Circuit = JSON.parse(fs.readFileSync(CircuitPath, "utf-8"));

export default async function generateProof() {
  const inputArray = process.argv.slice(2);
  try {
    // 2. Initialize Noir with the circuit
    const noir = new Noir(Circuit);
    // 3. Initialize the Backend using the circuit bytecode
    const bb = new UltraHonkBackend(Circuit.bytecode, { threads: 1 });
    // 4. Create The Inputs
    const inputs = {
      answer_hash: inputArray[0],
      guess_hash: inputArray[1],
    };
    // 5. Execute the circuit with the inputs to create the witness
    const { witness } = await noir.execute(inputs);
    // 6. Generate the proof(Using Backend) via witness
    const OrigCons = console.log;
    console.log = () => {}; // Suppress output from the backend
    const { proof } = await bb.generateProof(witness, { keccak: true });
    console.log = OrigCons; // Restore original console output
    // 7. ABI Encode the proof for use in smart contracts
    const abiEncodedProof = ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes"],
      [proof]
    );
    // 8. Return the proof
    return abiEncodedProof;
  } catch (error) {
    console.error("Error generating proof:", error);
    throw error;
  }
}

(async () => {
  generateProof()
    .then((proof) => {
      process.stdout.write(proof);
    })
    .catch((error) => {
      console.error("Error in proof generation:", error);
    });
})();
