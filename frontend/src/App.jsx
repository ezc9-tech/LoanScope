import { useState, useEffect } from "react";

function App() {
  const [principal, setPrincipal] = useState(null);
  const [interest, setInterest] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loanData, setLoanData] = useState(null);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/calculate", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            principal: parseFloat(principal),
            interest: parseFloat(interest),
            payment: parseFloat(payment),
          }),
        });
        const data = await response.json();
        setLoanData(data);
        console.log("Calculated Data:", data);
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (principal && interest && payment) {
      fetchLoanData();
    }
  }, [principal, interest, payment]);

  return (
    <>
      <h1>Loan$cope</h1>
      <div className="input-container">
        <label htmlFor="principal">Principal Amount: $</label>
        <input type="number" name="principal" id="principal" value={principal} onChange={(event) => setPrincipal(event.target.value)}/>
        <label htmlFor="interest">Interest Percentage: </label>
        <span>
          <input type="number" name="interest" id="interest" value={interest} onChange={(event) => setInterest(event.target.value)}/>%
        </span>
        <label htmlFor="payment">Payment Amount: $</label>
        <input type="number" name="payment" id="payment" value={payment} onChange={(event) => setPayment(event.target.value)}/>
      </div>
    </>
  );
}

export default App;
