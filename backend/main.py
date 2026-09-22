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
    
    total_interest_paid = 0
    total_remaining_month_to_month = []
    months_until_paid_off = 0
    
    current_principal = loan.principal
    
    while current_principal > 0:
        monthly_interest = current_principal * monthly_interest_rate
        
        total_interest_paid += monthly_interest
        current_principal -= (loan.payment - monthly_interest)
        
        if current_principal < 0:
            current_principal = 0
        
        total_remaining_month_to_month.append(round(current_principal, 2))
        months_until_paid_off += 1
    
    return {
        "total_interest_paid": round(total_interest_paid, 2),
        "total_remaining_month_to_month": total_remaining_month_to_month,
        "months_until_paid_off": months_until_paid_off
    }