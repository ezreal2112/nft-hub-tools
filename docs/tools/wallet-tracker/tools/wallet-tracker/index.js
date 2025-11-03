import fs from 'fs';
import fetch from 'node-fetch';
import 'dotenv/config';

const wallets = JSON.parse(fs.readFileSync('./wallets.example.json', 'utf8'));
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const ETHERSCAN_BASE = process.env.ETHERSCAN_BASE || 'https://api.etherscan.io';

async function getEthBalance(address) {
  const url = `${ETHERSCAN_BASE}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return Number(data.result) / 1e18;
}

(async () => {
  let total = 0;
  for (const w of wallets) {
    const bal = await getEthBalance(w.address);
    total += bal;
    console.log(`${w.label}: ${bal.toFixed(4)} ETH`);
  }
  console.log(`Total: ${total.toFixed(4)} ETH`);
})();
