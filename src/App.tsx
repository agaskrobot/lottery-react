import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { contractABI, contractAddress } from "./utils/constants";
import "./App.css";
import { ethers } from "ethers";

const { ethereum } = window;

function App() {
  const [count, setCount] = useState(0);
  const [manager, setManager] = useState("");

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const lotteryContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    const getManager = async () => {
      const manager = await lotteryContract.manager();

      setManager(manager);
    };
    getManager();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
