import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState("");

  const [blockInput, setBlockInput] = useState("")
  const [blockResult, setBlockResult] = useState("")
  const [blockError, setBlockError] = useState("")

  const handleBlockInputChange = (event) => {
    setBlockInput(event.target.value);
  };

  const handleBlockButtonClick = async () => {
    try {
      const result = await getBlockResult(blockInput);
      setBlockResult(JSON.stringify(result));
      setBlockError("")
    } catch {
      setBlockResult("")
      setBlockError("Block does not exist")
    }
  };

  const handleTransactionButtonClick = async (transaction_number) => {
    const result = await alchemy.core.getTransaction(`${transaction_number}`)
    setCurrentTransaction(JSON.stringify(result))
  }

  async function getBlockResult(block_number) {
    const response = await alchemy.core.getBlock(Number(block_number));
    setTransactions(response.transactions)

    return response;
  }

  function generateTransactionsButtons() {
    return transactions.map((transaction, index) => (
      <div key={index}>
        <button onClick={() => handleTransactionButtonClick(transaction)}>Get {transaction} info</button>
        <br />
      </div>
    ));
  }

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

  return (
    <>
      <div><strong>Current block Number: {blockNumber}</strong></div>

      <div>
        <input type="text" value={blockInput} onChange={handleBlockInputChange} />
        <button onClick={handleBlockButtonClick}>Get Block Info</button>
        <br/>
        { blockResult ? (
          <div>
            <div className="row">
              <div className="col-md-4">
                <p>
                  <strong>
                    Block info:
                  </strong>
                </p>
                <br/>
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {blockResult}
                </pre>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>
                    Transactions in block number: {blockInput}
                  </strong>
                </p>
                <div>
                  {generateTransactionsButtons()}
                </div>
              </div>

              { currentTransaction ? (<div className="col-md-4">
                <p>
                  <strong>
                    Transaction info:
                  </strong>
                </p>
                <br/>
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {currentTransaction}
                </pre>
              </div>) : (<div></div>) }
            </div>
          </div>
        ) : (<div>{blockError}</div>) }
      </div>
    </>
  )
}

export default App;
