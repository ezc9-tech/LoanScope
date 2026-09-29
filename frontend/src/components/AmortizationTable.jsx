import { useState } from "react";
import { formatCurrency } from "../utils/helpers";

export default function AmortizationTable({ loanData }) {
  const [selectedYear, setSelectedYear] = useState(1);

  if (!loanData || !loanData.schedule) return null;

  const totalYears = Math.ceil(loanData.months_until_paid_off / 12);

  const startMonthIndex = (selectedYear - 1) * 12;
  const endMonthIndex = selectedYear * 12;
  const visibleRows = loanData.schedule.slice(startMonthIndex, endMonthIndex);

  const handleExportCSV = () => {
    let csvContent =
      "Month,Payment Amount,Principal Portion,Interest Portion,Remaining Balance\n";

    loanData.schedule.forEach((row) => {
      csvContent += `${row.month},${row.payment},${row.principal_portion},${row.interest_portion},${row.remaining_balance}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Amortization Schedule</h2>

      <div>
        <div>
          <label htmlFor="year-filter">Filter by Year: </label>
          <input
            id="year-filter"
            type="number"
            min="1"
            max={totalYears}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
          <span>
            {" "}
            (Total Years: {totalYears})
          </span>
        </div>

        <button onClick={handleExportCSV}>Export CSV</button>
      </div>

      <table
        border="1"
        cellPadding="8"
        >
        <thead>
          <tr>
            <th>Month</th>
            <th>Payment</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{formatCurrency(row.payment)}</td>
              <td>{formatCurrency(row.principal_portion)}</td>
              <td>{formatCurrency(row.interest_portion)}</td>
              <td>{formatCurrency(row.remaining_balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
