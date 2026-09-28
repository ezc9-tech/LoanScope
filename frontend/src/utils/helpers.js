export function getQueryParameters(paramName, defaultValue, min, max) {
  const params = new URLSearchParams(window.location.search);
  const value = parseFloat(params.get(paramName));
  if (!isNaN(value) && value >= min && value <= max) {
    return value;
  }
  return defaultValue;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}
