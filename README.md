# Zero-Knowledge-Panagram

A blockchain-based Panagram (anagram puzzle) game that leverages zero-knowledge proofs (ZKPs) for privacy and fairness. The smart contracts are written in Solidity, while zero-knowledge circuits and proof generation are handled using Noir and Barretenberg. This setup allows users to prove they have solved a puzzle without revealing the solution, ensuring both transparency and privacy on-chain.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Solidity](https://docs.soliditylang.org/)
- [Noir](https://noir-lang.org/getting_started/installing_noir/)
- [Barretenberg](https://github.com/AztecProtocol/barretenberg)
- [Hardhat](https://hardhat.org/) or [Foundry](https://book.getfoundry.sh/) (for Solidity development)
- [Rust](https://www.rust-lang.org/tools/install) (for some ZKP tooling)

### Install Dependencies

```bash
# For Solidity contracts (example with Hardhat)
cd contract
npm install

# For Noir circuits
cd ../
nargo install
```

### Build and Test Contracts

```bash
# Compile Solidity contracts
cd contract
npx hardhat compile

# Compile Noir circuits
cd ../
nargo build
```

### Generate and Verify Proofs

- Use Noir and Barretenberg to generate proofs and verification keys for your ZKP circuits.
- Integrate the verification key into your Solidity contract for on-chain verification.

### Run the Application

```bash
cd src
# Add your backend/frontend run instructions here
# e.g., npm start, cargo run, etc.
```

## How It Works

1. **User submits a solution to the Panagram puzzle.**
2. **A ZKP is generated off-chain** (using Noir/Barretenberg) to prove the solution is correct without revealing it.
3. **The proof is sent to the smart contract,** which verifies it using the embedded verification key.
4. **If valid,** the contract updates the game state and rewards the user.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

---

**References:**
- [Noir Documentation](https://noir-lang.org/docs/)
- [Barretenberg](https://github.com/AztecProtocol/barretenberg)
- [Solidity](https://docs.soliditylang.org/)
