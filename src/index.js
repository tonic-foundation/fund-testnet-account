"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearApi = __importStar(require("near-api-js"));
const config_1 = require("@tonic-foundation/config");
const key_stores_1 = require("near-api-js/lib/key_stores");
const near_api_js_1 = require("near-api-js");
const ts_command_line_args_1 = require("ts-command-line-args");
const args = (0, ts_command_line_args_1.parse)({
    beneficiary: String,
    iterations: Number,
});
async function run() {
    console.log('Funding', args.beneficiary, 'from', args.iterations, 'temp accounts', `(~${args.iterations * 200} NEAR)`);
    for (let i = 0; i < args.iterations; i++) {
        const keyStore = new key_stores_1.InMemoryKeyStore();
        const near = new nearApi.Near({ ...(0, config_1.getNearConfig)('testnet'), keyStore, headers: {} });
        const keyPair = near_api_js_1.KeyPair.fromRandom('ed25519');
        const tempAccountId = `temp-${Date.now()}.testnet`;
        console.log('Creating account', tempAccountId);
        await near.accountCreator.createAccount(tempAccountId, keyPair.getPublicKey());
        await keyStore.setKey('testnet', tempAccountId, keyPair);
        console.log('Deleting', tempAccountId, 'and sending remaining balance to', args.beneficiary);
        const tempAccount = await near.account(tempAccountId);
        await tempAccount.deleteAccount(args.beneficiary);
    }
}
run();
