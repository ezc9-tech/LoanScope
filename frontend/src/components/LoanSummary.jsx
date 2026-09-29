import { formatCurrency } from "../utils/helpers";

export default function LoanSummary({ loanData, payoffDate, shareURL }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}>
        <button onClick={shareURL}>Share Scenario</button>
      </div>

      {loanData && !loanData.detail && (
        <div className="summary-container">
          <h3>Payoff Date: {payoffDate}</h3>
          <h3>
            Total Term: {Math.floor(loanData.months_until_paid_off / 12)} years
            and {loanData.months_until_paid_off % 12} months
          </h3>
          <h3>
            Total Interest Paid: {formatCurrency(loanData.totalInterestPaid)}
          </h3>

          {loanData.warning && <div>{loanData.warning}</div>}
        </div>
      )}

      {loanData && loanData.detail && (
        <div>
          <strong>Error:</strong> {loanData.detail}
        </div>
      )}
    </>
  );
}
