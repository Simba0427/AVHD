const presentValue = (value: number, decimal: number, multiplier: number) => {
  return (value * multiplier).toFixed(decimal);
};


export { presentValue };
