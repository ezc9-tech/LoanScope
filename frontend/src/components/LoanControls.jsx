import { formatCurrency } from "../utils/helpers";

export default function LoanControls({
  principal,
  setPrincipal,
  interest,
  setInterest,
  payment,
  setPayment,
  maxPayment,
  handleSliderChange,
  handleNumberChange,
}) {
  return (
    <div className="input-container">
      <label htmlFor="principal-number">
        Principal Amount: {formatCurrency(principal)}
      </label>
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

      <label htmlFor="interest-number">Interest Percentage: {interest}%</label>
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

      <label htmlFor="payment-number">
        Payment Amount: {formatCurrency(payment)}
      </label>
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
  );
}
