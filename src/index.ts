import * as nearApi from 'near-api-js';
import { getNearConfig } from '@tonic-foundation/config';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair } from 'near-api-js';
import { parse } from 'ts-command-line-args';

export interface Options {
  beneficiary: string;
  iterations: number;
}

const args = parse<Options>({
  beneficiary: String,
  iterations: Number,
});

async function run() {
  console.log(
    'Funding',
    args.beneficiary,
    'from',
    args.iterations,
    'temp accounts',
    `(~${args.iterations * 200} NEAR)`
  );

  for (let i = 0; i < args.iterations; i++) {
    const keyStore = new InMemoryKeyStore();
    const near = new nearApi.Near({ ...getNearConfig('testnet'), keyStore });
    const keyPair = KeyPair.fromRandom('ed25519');

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
