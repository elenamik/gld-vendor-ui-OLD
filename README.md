
## 🏵 GLD TokenVendor
Building a simple UI against a smart contract which can buy and sells fictional GLD Tokens. 

I am leveraging eth-hooks, and using [this design](https://www.figma.com/file/KXrIvKLSGnH3AfIzFIJvu6/GLD-Token-Vendor?node-id=0%3A1) to style the page.

I am tracking progress [here](https://github.com/elenamik/gld-vendor-ui/projects/1).

The smart contract logic is sourced from my submission to [scaffold-eth challenge 2](https://speedrunethereum.com/challenge/token-vendor).
The contract and out-of-the-box UI can be found on my [buidlguidl profile](https://buidlguidl.com/builders/0x74503D89E994e5e6FE44Ba3BBD09e048F0185403).

### 📦 install 

```bash
git clone https://github.com/scaffold-eth/scaffold-eth-typescript-challenges.git challenge-2-token-vendor
cd challenge-2-token-vendor
git checkout challenge-2-token-vendor
yarn install
```
---

### 🔭 Environment 

You'll have three terminals up for:

`yarn chain` (hardhat backend)

`yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

`yarn start` (react app frontend)

Make sure you run the commands in the above order. The contract types get generated as part of the deploy, which will be required to build and start the app.

> 👀 Visit your frontend at http://localhost:3000

> 👩‍💻 Rerun `yarn deploy --reset` whenever you want to deploy new contracts to the frontend.

---
