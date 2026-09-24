import { useState, useEffect, useRef, useCallback } from "react";
import Chart from "chart.js/auto";

function App() {
  const [principal, setPrincipal] = useState(10000);
  const [interest, setInterest] = useState(5);
  const [payment, setPayment] = useState(500);
  const [loanData, setLoanData] = useState(null);
  const [maxPayment, setMaxPayment] = useState(Math.max(1000000, principal * 3))

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const thriceMinimum = 3 * (principal * ((interest / 100) / 12));
    setMaxPayment(Math.max(1000000, thriceMinimum));
  }, [principal, interest]);

  const fetchLoanData = useCallback(async () => {
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
  }, [principal, interest, payment]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLoanData();
    }, 300);

    return () => clearTimeout(delay);
  }, [fetchLoanData]);

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
              tension: 0.1,
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
        <label htmlFor="principal">Principal Amount: ${principal}</label>
        <input type="range" min="1" max="100000000" name="principal" id="principal" value={principal} onChange={(event) => setPrincipal(event.target.value)}/>
        <input type="number" min="1" max="10000000" name="principal" id="principal" value={principal} onChange={(event) => setPrincipal(event.target.value)}/>
        <label htmlFor="interest">Interest Percentage: {interest}%</label>
        <input type="range" min="0" max="40" step=".01" name="interest" id="interest" value={interest} onChange={(event) => setInterest(event.target.value)}/>
        <input type="number" min="0" max="40" step=".01" name="interest" id="interest" value={interest} onChange={(event) => setInterest(event.target.value)}/>
        <label htmlFor="payment">Payment Amount: ${payment}</label>
        <input type="range" min="1" max={maxPayment} name="payment" id="payment" value={payment} onChange={(event) => setPayment(event.target.value)}/>
        <input type="number" min="1" max={maxPayment} name="payment" id="payment" value={payment} onChange={(event) => setPayment(event.target.value)}/>
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
