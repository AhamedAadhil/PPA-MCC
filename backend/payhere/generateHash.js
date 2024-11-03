import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const MERCHANT_SECRET = process.env.MERCHANT_SECRET;
const MERCHANT_ID = process.env.MERCHANT_ID;

export const generateHash = (order_id, amount, currency) => {
  const hash = crypto
    .createHash("md5")
    .update(
      MERCHANT_ID +
        order_id +
        amount +
        currency +
        crypto
          .createHash("md5")
          .update(MERCHANT_SECRET)
          .digest("hex")
          .toLowerCase()
    )
    .digest("hex")
    .toUpperCase();

  return hash;
};
