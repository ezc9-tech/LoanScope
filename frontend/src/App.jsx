import { useState, useEffect, useRef, useCallback } from "react";
import { getQueryParameters } from "./utils/helpers";
import LoanControls from "./components/LoanControls";
import LoanSummary from "./components/LoanSummary";
import LoanChart from "./components/LoanChart";
import AmortizationTable from "./components/AmortizationTable"; // <-- 1. ADD THIS IMPORT

function App() {
  const [principal, setPrincipal] = useState(getQueryParameters("principal", 10000, 1, 100000000));
  const [interest, setInterest] = useState(getQueryParameters("interest", 5, 0, 40));
  const [payment, setPayment] = useState(getQueryParameters("payment", 500, 1, Infinity));
  const [showCumulativeInterest, setShowCumulativeInterest] = useState(false);
  const [loanData, setLoanData] = useState(null);
  const [maxPayment, setMaxPayment] = useState(Math.max(1000000, principal * 3));

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
        headers: { "Content-type": "application/json" },
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

  let payoffDate = "";
  if (loanData && !loanData.detail) {
    const date = new Date();
    date.setMonth(date.getMonth() + loanData.months_until_paid_off);
    payoffDate = date.toLocaleDateString();
  }

  return (
    <>
      <h1>Loan$cope</h1>
      <LoanControls
        principal={principal}
        setPrincipal={setPrincipal}
        interest={interest}
        setInterest={setInterest}
        payment={payment}
        setPayment={setPayment}
        maxPayment={maxPayment}
        handleSliderChange={handleSliderChange}
        handleNumberChange={handleNumberChange}
      />

      <LoanSummary
        loanData={loanData}
        payoffDate={payoffDate}
        shareURL={shareURL}
      />

      {loanData && !loanData.detail && (
        <>
          <LoanChart
            loanData={loanData}
            showCumulativeInterest={showCumulativeInterest}
            setShowCumulativeInterest={setShowCumulativeInterest}
          />
          <AmortizationTable loanData={loanData} />
        </>
      )}

      <p>
        Disclaimer: This output is an illustrative estimate, not financial
        advice, and may not exactly match a lender's actual amortization terms
        (which can include fees, escrow, or non-monthly compounding).
      </p>
    </>
  );
}

export default App;
