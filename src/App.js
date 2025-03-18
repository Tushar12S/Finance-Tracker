import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch Transactions on Load
  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch("http://localhost:4040/api/transactions");
      const data = await response.json();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

  // ✅ Fix price parsing
  function addNewTransaction(ev) {
    ev.preventDefault();

    const priceMatch = name.match(/^[-+]?\d+/); // Extract number at the beginning
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
    const transactionName = name.substring(priceMatch ? priceMatch[0].length + 1 : 0);

    fetch("http://localhost:4040/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: transactionName,
        description,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setName("");
        setDateTime("");
        setDescription("");
        setTransactions([...transactions, json]); // ✅ Append new transaction
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // ✅ Calculate Balance
  let balance = transactions.reduce((acc, transaction) => acc + transaction.price, 0).toFixed(2);
  const [integerPart, fractionPart] = balance.split(".");

  return (
    <main>
      <h1>
        {integerPart}
        <span>.{fractionPart}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200 new samsung tv"
          />
          <input
            value={datetime}
            onChange={(ev) => setDateTime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      {/* ✅ Fixed Transactions List */}
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction._id}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price " + (transaction.price < 0 ? "red" : "green")}>
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
