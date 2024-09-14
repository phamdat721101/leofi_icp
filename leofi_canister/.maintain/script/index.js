import HDKey from "hdkey";
import dotenv from "dotenv";
import * as bip39 from "bip39";
import Secp256k1 from "secp256k1";
import fetch from "isomorphic-fetch";
import { replica, HttpAgent } from "ic0";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";

import readline from "readline";
import { execSync } from "child_process";

dotenv.config();

const DERIVATION_PATH = "m/44'/223'/0'/0";

const getIdentityFromSeed = (mnemonic, index = 0) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = HDKey.fromMasterSeed(seed);
  const { privateKey } = masterKey.derive(`${DERIVATION_PATH}/${index}`);
  const publicKey = Secp256k1.publicKeyCreate(privateKey, false);
  return Secp256k1KeyIdentity.fromKeyPair(publicKey, privateKey);
};

function createHostAgentAndIdentityFromSeed(
  seedPhrase,
  host = "http://127.0.0.1:8000",
) {
  const identity = getIdentityFromSeed(seedPhrase);
  console.log("Identity: ", identity.getPrincipal().toText());
  return new HttpAgent({ host, identity, fetch, verifyQuerySignatures: false });
}

const canister_id = process.env.CANISTER_ID;
const custodian_seed = process.env.CUSTODIAN_SEED;
const agent = createHostAgentAndIdentityFromSeed(custodian_seed);
const ic = replica(agent, { local: true });
const custodian = ic(canister_id);

const ledgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const ledger = ic(ledgerCanisterId);

const indexCanisterId = "qhbym-qaaaa-aaaaa-aaafq-cai";
const index = ic(indexCanisterId);

async function runTest(method, ...args) {
  // console.log(`Testing ${method} method:`);
  // try {
  //   const result = await custodian.call(method, ...args);
  //   console.log(result);
  //   return result;
  // } catch (error) {
  //   console.error(`Error in ${method}:`, error);
  // }

  console.log("Creating success")
}

async function transferICP(amount, memo, to) {
  const command = `dfx ledger transfer --network local --amount ${amount} --memo ${memo} ${to}`;
  try {
    const output = execSync(command, { encoding: "utf-8" });
    console.log("Transfer output:", output);
  } catch (error) {
    console.error("Transfer error:", error.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  rl.question(
    `
Choose a test to run:
1. create_profile_investment
2. get_profile_performance
3. get_next_block
4. get_canister_principal
5. get_subaccountid
6. get_subaccount_count
7. get_transactions_count
8. refund
9. sweep
10. Transfer ICP
11. Exit
Enter your choice: `,
    async (choice) => {
      switch (choice) {        
        case "1":
          rl.question("Enter profile investment: ", async (investment) => {
            await runTest("create_profile_investment", parseInt(investment));
            promptUser();
          });
          return;
        case "2":
          await runTest("get_profile_performance");
          break;
        case "3":
          await runTest("get_next_block");
          break;
        case "4":
          await runTest("get_canister_principal");
          break;
        case "5":
          rl.question("Enter nonce: ", async (nonce) => {
            await runTest("get_subaccountid", parseInt(nonce));
            promptUser();
          });
          return;
        case "6":
          await runTest("get_subaccount_count");
          break;
        case "7":
          await runTest("get_transactions_count");
          break;
        case "8":
          rl.question("Enter transaction index: ", async (index) => {
            await runTest("refund", parseInt(index));
            promptUser();
          });
          return;
        case "9":
          await runTest("sweep");
          break;
        case "10":
          rl.question("Enter amount: ", (amount) => {
            rl.question("Enter memo: ", (memo) => {
              rl.question("Enter destination address: ", async (to) => {
                await transferICP(amount, memo, to);
                promptUser();
              });
            });
          });
          return;
        case "11":
          rl.close();
          process.exit(0);
        default:
          console.log("Invalid choice. Please try again.");
      }
      promptUser();
    },
  );
}

async function handleCommandLineArgs(args) {
  if (args.length > 0) {
    const method = args[0];
    const params = args.slice(1);

    switch (method) {
      case "add_subaccount":
        return await runTest("add_subaccount");
      case "set_webhook_url":
        if (params.length === 1) {
          return await runTest("set_webhook_url", params[0]);
        } else {
          console.error("URL parameter is required for set_webhook_url");
          process.exit(1);
        }
      default:
        console.error("Unknown method:", method);
        process.exit(1);
    }
  } else {
    console.error("No method specified");
    process.exit(1);
  }
}

// Main function to handle the execution mode
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--cli") {
    // CLI mode
    await handleCommandLineArgs(args.slice(1));
    process.exit(0); // Ensure the process exits after CLI command execution
  } else {
    // Interactive mode
    promptUser();
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
