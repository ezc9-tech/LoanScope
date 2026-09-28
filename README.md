# Loan$cope

## What is Loan$cope?
Loan$cope is an interactive loan estimation tool that helps you visualize your loan's lifetime. It calculates:
- Total interest paid on a loan
- The expected payoff date
- Total time until the loan is paid off

These calculations are dynamically generated based on your **principal amount**, **interest rate**, and **monthly payment**.

### Features
* **Interactive Chart:** Visually represents your remaining balance over time, with a toggle to overlay cumulative interest paid.
* **Amortization Table:** A month-by-month breakdown of your payments (split by principal and interest) that can be filtered by year.
* **CSV Export:** Download your complete amortization schedule with the click of a button.
* **Shareable Scenarios:** Easily share your specific loan scenario with friends, family, or a financial advisor using the share button.

---

## How to Run

Loan$cope is composed of a FastAPI backend and a React frontend. You will need to run both locally to use the application.

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (for the frontend)
* Python and the [uv](https://github.com/astral-sh/uv) package manager (for the backend)

### Backend

run `cd backend`

then run `uv run fastapi dev main.py`

### Frontend

run `cd frontend`

then run `npm run dev`