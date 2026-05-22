export function calculateTotalCompensation(
  base_salary: number,
  bonus: number = 0,
  stock_value: number = 0
) {
  return (
    base_salary +
    bonus +
    stock_value
  );
}