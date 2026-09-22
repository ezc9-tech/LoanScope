// import { useState } from 'react'

function App() {

  // const [principal, setPrincipal] = useState(null)
  // const [interest, setInterest] = useState(null)
  // const [payment, setPayment] = useState(null)

  return (
    <>
      <h1>Loan$cope</h1>
      <div class="input-container">
        <label htmlFor="principal">Principal Amount: $</label>
        <input type="number" name="principal" id="principal" />
        <label htmlFor="interest">Interest Percentage: </label>
        <span>
          <input type="number" name="interest" id="interest" /> %
        </span>
        <label htmlFor="payment">Principal Amount: $</label>
        <input type="number" name="payment" id="payment" />
      </div>
    </>
  );
}

export default App
