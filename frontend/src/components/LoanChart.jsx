import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LoanChart({
  loanData,
  showCumulativeInterest,
  setShowCumulativeInterest,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Payment/Interest Graph</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <label>
          <input
              type="checkbox"
              checked={showCumulativeInterest}
              onChange={(e) => setShowCumulativeInterest(e.target.checked)}
            />
            Overlay Cumulative Interest Paid
          </label>
        </div>
      <div>
        <canvas ref={chartRef} id="loanChart" width="400" height="400"></canvas>
      </div>
    </>
  );
}
