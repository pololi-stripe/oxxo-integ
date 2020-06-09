import React from "react";
import Barcode from "react-barcode";
import oxxo from './oxxo.png';
import './App.css';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

export default function Voucher(props) {
  const { amount, currency, number, expires_after } = props;

  const formatter = new Intl.NumberFormat(['es-MX'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  });

  const amountText = formatter.format((amount / 100).toFixed(2));
  const expiryDate = new Date(expires_after * 1000).toLocaleDateString('en-US');

  return (
    <div className="result-oxxo">
      <h1>Thanks! Just one more step:</h1>
      <div className="instructions">
        <p>
          OXXO payment instructions:
          <p>1. Give the voucher to the cashier to scan the barcode.</p>
          <p>2. Provide cash payment to the cashier.</p>
          <p>3. After the payment is complete, keep the receipt of your payment for your records.</p>
          <p>4. For any questions or clarification, please contact the merchant.</p>
        </p>
      </div>

      <div><b>Amount:</b> <span className="order-amount">{amountText}</span></div>
      <div><b>Expires:</b> <span className="oxxo-expiry-date">{expiryDate}</span></div>
      <img width="150px" src={oxxo} alt="" />

      <div className="oxxo-display">
        <Barcode value={number} text={number.match(/.{1,4}/g).join('  ')} height={50} fontSize={15} />
      </div>
      <Button type="primary" icon={<DownloadOutlined />} onClick={() => window.print()}>
        Print
      </Button>
    </div>
  );
}