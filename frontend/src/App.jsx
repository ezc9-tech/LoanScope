import { useState, useEffect } from 'react'

function App() {

  const [principal, setPrincipal] = useState(null)
  const [interest, setInterest] = useState(null)
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    if (principal && interest && payment) {
      alert(
        `Principal: ${principal}, Interest: ${interest}, Payment: ${payment}`,
      );
    }
  }, [principal, interest, payment]);

  return (
    <>
      <h1>Loan$cope</h1>
      <div className="input-container">
        <label htmlFor="principal">Principal Amount: $</label>
        <input type="number" name="principal" id="principal" onChange={(event) => {
          setPrincipal(event.target.value)
        }}/>
        <label htmlFor="interest">Interest Percentage: </label>
        <span>
          <input type="number" name="interest" id="interest" onChange={(event) => {
          setInterest(event.target.value)
        }}/> %
        </span>
        <label htmlFor="payment">Payment Amount: $</label>
        <input type="number" name="payment" id="payment" onChange={(event) => {
          setPayment(event.target.value)
        }}/>
      </div>
    </>
  );
}

export default App
