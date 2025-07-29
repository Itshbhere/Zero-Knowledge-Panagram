import React, { useContext } from "react";
import { WalletContext } from "../WalletConnection/WalletContext";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css"; // For Excalifont and custom styles
import Panagram from "../../assets/Panagram_Landing_Page.jpg"; // Adjust path as needed

const HeroSection = () => {
  const { account, setAccount } = useContext(WalletContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        navigate("/panagram"); // Navigate to Panagram page after connecting
      } catch (error) {
        alert("Connection rejected.");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  return (
    <section
      className="text-white min-h-[90vh] flex flex-col xl:flex-row items-center justify-center px-8 xl:px-28 py-12 gap-y-10 xl:gap-x-40
      
      "
      style={{ fontFamily: "Excalifont, sans-serif" }}
    >
      {/* Left Side - Text */}
      <div className="max-w-2xl flex flex-col items-center xl:items-start text-center xl:text-left">
        <h1 className="text-5xl font-bold leading-tight mb-5">
          <span>Every letter counts in </span>
          <br />a perfect Panagram
        </h1>

        <p className="text-lg font-medium py-2 mb-6 max-w-md">
          A linguistic puzzle where each letter <br />
          of the alphabet makes a single, clever appearance
        </p>

        <button
          className="bg-black text-white px-6 py-3 uppercase text-sm hover:bg-white hover:text-black transition"
          onClick={connectWallet}
        >
          {account ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* Right Side - Image as Card */}
      <div className="flex justify-center items-center w-full xl:w-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center max-w-xs xl:max-w-sm">
          <img
            src={Panagram}
            alt="Hero Plant"
            className="rounded-lg object-cover w-[300px] h-[250px] xl:w-[350px] xl:h-[300px] mb-4"
          />
          <h2 className="text-black text-lg font-semibold mt-2">Panagram</h2>
          <p className="text-gray-600 text-sm text-center mt-1">
            Discover the beauty of a perfect panagram.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
