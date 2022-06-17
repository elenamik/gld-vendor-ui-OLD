
## 🏵 GLD Vendor
This is a fork of [scaffold-eth challenge 2](https://speedrunethereum.com/challenge/token-vendor) that aims to build a brand new UI from scratch.

I am leveraging eth-hooks, and using a [design](https://www.figma.com/file/KXrIvKLSGnH3AfIzFIJvu6/GLD-Token-Vendor?node-id=0%3A1) I drafted up in Figma to create a more enticing UX.

I am tracking progress [here](https://github.com/elenamik/gld-vendor-ui/projects/1).

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
