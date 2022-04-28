Fund testnet accounts on NEAR. This script creates temporary accounts and
deletes them to recover their native NEAR to a beneficiary.

```
yarn
yarn fund --beneficiary <account_to_fund> --iterations <number>
```

Each iteration is ~200 NEAR on testnet.
