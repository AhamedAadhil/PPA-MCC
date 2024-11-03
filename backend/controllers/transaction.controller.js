import dotenv from "dotenv";
import crypto from "crypto";

import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { generateHash } from "../payhere/generateHash.js";
import { generateOrderID } from "../utils/generateOrderID.js";

dotenv.config();

export const createTransaction = async (req, res) => {
  const { userId, donorName, amount, purpose, message } = req.body;
  const merchant_id = process.env.MERCHANT_ID;
  // generate order_Id
  const order_id = generateOrderID();
  // generate hash
  const hash = generateHash(order_id, amount, "LKR");
  // generate initial transcation record with pending status
  const transaction = new Transaction({
    orderId: order_id,
    userId,
    donorName,
    amount,
    currency: "LKR",
    paymentMethod: "CARD",
    transactionDate: new Date(),
    status: "PENDING",
    purpose,
    message,
  });

  await transaction.save();

  res
    .status(200)
    .json({ message: { merchant_id, order_id, hash }, success: true });
};

export const notify = async (req, res) => {
  const merchant_secret = process.env.MERCHANT_SECRET;
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code, //2-success 0-pending -1 - canceled -2 - failed -3 - chargeBack
    md5sig,
    method,
  } = req.body;
  try {
    const local_md5sig = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          crypto.createHash("md5").update(merchant_secret).digest("hex")
      )
      .digest("hex")
      .toUpperCase();
    if (local_md5sig === md5sig) {
      // Update payment status in the database
      const status = status_code == 2 ? "SUCCESS" : "FAILED";
      await Transaction.findOneAndUpdate(
        {
          orderId: order_id,
        },
        {
          status,
          amount: payhere_amount,
          currency: payhere_currency,
          transactionDate: new Date(),
          paymentMethod: method,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Payment success!", success: true });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }

  return res.status(400).json({ message: "Payment failed!", success: false });
};

export const getAllTransaction = async (req, res) => {
  // filter can perform
  // 1. using status
  // 2. using month
  try {
    const userId = req.userId;

    const { month, status, sortBy } = req.query;
    // initialize filter with userId
    let filter = { userId };
    if (status) {
      filter.status = status;
    }
    if (month) {
      const year = new Date().getFullYear(); //2024
      const startOfMonth = new Date(year, month - 1, 1); //2024,5,1  -- month 1-jan  2-feb ....
      const endOfMonth = new Date(year, month, 0); //2024,5,31 -- if date 0 then end of month
      filter.transactionDate = { $gte: startOfMonth, $lte: endOfMonth }; //2024-5-1 to 2024-5-31
    }

    let sortOptions = {};
    if (sortBy === "status") {
      sortOptions.status = 1; //Ascending order;
    } else if (sortBy === "amount") {
      sortOptions.amount = -1; // Descending order
    } else {
      sortOptions.transactionDate = -1; // Default to most recent first
    }

    const transaction = await Transaction.find(filter).sort(sortOptions);
    res.status(200).json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
