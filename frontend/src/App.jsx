import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function App() {
  const [principal, setPrincipal] = useState(null);
  const [interest, setInterest] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loanData, setLoanData] = useState(null);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (principal && interest && payment) {
      fetchLoanData();
    }
  }, [principal, interest, payment]);

  useEffect(() => {
    if (loanData && !loanData.detail && chartRef.current) {

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const monthLabels = Array.from(
        { length: loanData.months_until_paid_off },
        (_, i) => `Month ${i + 1}`,
      );

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: "Remaining Balance ($)",
              data: loanData.total_remaining_month_to_month,
            },
          ],
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [loanData]); 

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

      {loanData && loanData.detail && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong> {loanData.detail}
        </div>
      )}
      
      <div style={{ maxWidth: "800px", marginTop: "30px" }}>
        <canvas ref={chartRef} id="loanChart" width="400" height="400"></canvas>
      </div>
    </>
  );
}

export default App;
