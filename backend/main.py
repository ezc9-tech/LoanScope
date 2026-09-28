from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class LoanData(BaseModel):
    principal: float
    interest: float
    payment: float

@app.post("/api/calculate")
def calculate_loan_data(loan: LoanData):
    
    monthly_interest_rate = (loan.interest / 100) / 12
    
    if loan.principal * monthly_interest_rate >= loan.payment:
        raise HTTPException(
            status_code = 400,
            detail = "Payment is too low to cover the interest. Please increase your payment amount."
        )
    
    current_principal = int(round(loan.principal * 100))
    payment_cents = int(round(loan.payment * 100))
    total_interest_paid = 0
    total_remaining_month_to_month = []
    cumulative_interest_month_to_month = [] 
    schedule = [] 
    months_until_paid_off = 0
    warning_message = None
    
    while current_principal > 0:
        if months_until_paid_off >= 1200:
            warning_message = "Payoff date exceeds 100 years. Schedule capped at 1,200 months."
            break
        
        monthly_interest = int(round(current_principal * monthly_interest_rate))
        
        actual_payment = payment_cents
        if current_principal + monthly_interest < payment_cents:
            actual_payment = current_principal + monthly_interest
            
        principal_portion = actual_payment - monthly_interest
        
        total_interest_paid += monthly_interest
        current_principal -= principal_portion
        
        if current_principal < 0:
            current_principal = 0
            
        months_until_paid_off += 1
        
        rem_dollars = current_principal / 100.0
        int_dollars = total_interest_paid / 100.0
        
        total_remaining_month_to_month.append(rem_dollars)
        cumulative_interest_month_to_month.append(int_dollars)
        
        schedule.append({
            "month": months_until_paid_off,
            "payment": actual_payment / 100.0,
            "principal_portion": principal_portion / 100.0,
            "interest_portion": monthly_interest / 100.0,
            "remaining_balance": rem_dollars,
            "cumulative_interest": int_dollars
        })
    
    return {
        "totalInterestPaid": total_interest_paid / 100.0, 
        "total_remaining_month_to_month": total_remaining_month_to_month,
        "cumulative_interest_month_to_month": cumulative_interest_month_to_month,
        "months_until_paid_off": months_until_paid_off,
        "schedule": schedule,
        "warning": warning_message
    }