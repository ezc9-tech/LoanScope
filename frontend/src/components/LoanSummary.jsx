import { formatCurrency } from "../utils/helpers";

export default function LoanSummary({ loanData, payoffDate, shareURL }) {
  return (
    <>
      <button onClick={shareURL} style={{ marginTop: "10px" }}>
        Share Scenario
      </button>

      {loanData && !loanData.detail && (
        <div className="summary-container" style={{ marginTop: "20px" }}>
          <h3>Payoff Date: {payoffDate}</h3>
          <h3>
            Total Term: {Math.floor(loanData.months_until_paid_off / 12)} years
            and {loanData.months_until_paid_off % 12} months
          </h3>
          <h3>
            Total Interest Paid: {formatCurrency(loanData.totalInterestPaid)}
          </h3>

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
    </>
  );
}
