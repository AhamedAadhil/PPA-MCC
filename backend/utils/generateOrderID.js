export const generateOrderID = () => {
  return `txn-${Date.now() % 100000}-${Math.floor(Math.random() * 1000)}`;
};
