import { useState, useEffect, useRef, useCallback } from "react";
import Chart from "chart.js/auto";

function getQueryParamaters(paramName, defaultValue, min, max) {
  const params = new URLSearchParams(window.location.search);
  const value = parseFloat(params.get(paramName));

  if (!isNaN(value) && value >= min && value <= max) {
    return value;
  }

  return defaultValue;
}

function App() {
  const [principal, setPrincipal] = useState(getQueryParamaters("principal", 10000, 1, 100000000));
  const [interest, setInterest] = useState(getQueryParamaters("interest", 5, 0, 40));
  const [payment, setPayment] = useState(getQueryParamaters("payment", 500, 1, Infinity));
  const [showCumulativeInterest, setShowCumulativeInterest] = useState(false);
  const [loanData, setLoanData] = useState(null);
  const [maxPayment, setMaxPayment] = useState(Math.max(1000000, principal * 3));

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const lastInputSource = useRef("number");

  const handleSliderChange = (setter) => (event) => {
    lastInputSource.current = "slider";
    setter(event.target.value);
  };

  const handleNumberChange = (setter) => (event) => {
    lastInputSource.current = "number";
    setter(event.target.value);
  };

  async function shareURL() {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(baseUrl + `?principal=${principal}&interest=${interest}&payment=${payment}`);
      alert("URL copied to clipboard!");
    } catch (error) {
      console.log("Failed to copy URL: ", error);
    }
  }

  useEffect(() => {
    const thriceMinimum = 3 * (principal * (interest / 100 / 12));
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
    const delayTime = lastInputSource.current === "slider" ? 0 : 300;
    const delay = setTimeout(() => {
      fetchLoanData();
    }, delayTime);

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

      const datasets = [
        {
          label: "Remaining Balance ($)",
          data: loanData.total_remaining_month_to_month,
          tension: 0.1,
          borderColor: "rgba(54, 162, 235, 1)",
        },
      ];

      if (
        showCumulativeInterest &&
        loanData.cumulative_interest_month_to_month
      ) {
        datasets.push({
          label: "Cumulative Interest Paid ($)",
          data: loanData.cumulative_interest_month_to_month,
          tension: 0.1,
          borderColor: "rgba(255, 99, 132, 1)",
        });
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: datasets,
        },
        options: {
          interaction: {
            mode: "index",
            intersect: false,
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [loanData, showCumulativeInterest]);

  let payoffDate = "";
  if (loanData) {
    const date = new Date();
    date.setMonth(date.getMonth() + loanData.months_until_paid_off);
    payoffDate = date.toLocaleDateString();
  }

  return (
    <>
      <h1>Loan$cope</h1>
      <div className="input-container">
        <label htmlFor="principal-number">Principal Amount: ${principal}</label>
        <input
          type="range"
          min="1"
          max="100000000"
          name="principal"
          id="principal-slider"
          value={principal}
          onChange={handleSliderChange(setPrincipal)}
        />
        <input
          type="number"
          min="1"
          max="100000000"
          name="principal"
          id="principal-number"
          value={principal}
          onChange={handleNumberChange(setPrincipal)}
        />

        <label htmlFor="interest-number">
          Interest Percentage: {interest}%
        </label>
        <input
          type="range"
          min="0"
          max="40"
          step=".01"
          name="interest"
          id="interest-slider"
          value={interest}
          onChange={handleSliderChange(setInterest)}
        />
        <input
          type="number"
          min="0"
          max="40"
          step=".01"
          name="interest"
          id="interest-number"
          value={interest}
          onChange={handleNumberChange(setInterest)}
        />

        <label htmlFor="payment-number">Payment Amount: ${payment}</label>
        <input
          type="range"
          min="1"
          max={maxPayment}
          name="payment"
          id="payment-slider"
          value={payment}
          onChange={handleSliderChange(setPayment)}
        />
        <input
          type="number"
          min="1"
          max={maxPayment}
          name="payment"
          id="payment-number"
          value={payment}
          onChange={handleNumberChange(setPayment)}
        />
      </div>
      <button onClick={shareURL}>Share</button>

      {loanData && !loanData.detail && (
        <div className="summary-container">
          <h3>Payoff Date: {payoffDate}</h3>
          <h3>
            Total Term: {Math.floor(loanData.months_until_paid_off / 12)} years
            and {loanData.months_until_paid_off % 12} months
          </h3>
          <h3>Total Interest Paid: ${loanData.totalInterestPaid}</h3>

          {loanData.warning && (
            <div
              style={{ color: "orange", fontWeight: "bold", marginTop: "10px" }}
            >
              {loanData.warning}
            </div>
          )}
        </div>
      )}

      {loanData && loanData.detail && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong> {loanData.detail}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={showCumulativeInterest}
            onChange={(e) => setShowCumulativeInterest(e.target.checked)}
          />
          Overlay Cumulative Interest Paid
        </label>
      </div>

      <div style={{ maxWidth: "800px", marginTop: "10px" }}>
        <canvas ref={chartRef} id="loanChart" width="400" height="400"></canvas>
      </div>

      <p>
        Disclaimer: This output is an illustrative estimate, not financial
        advice, and may not exactly match a lender's actual amortization terms
        (which can include fees, escrow, or non-monthly compounding).
      </p>
    </>
  );
}

export default App;
