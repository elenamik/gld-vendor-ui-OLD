import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import { Vendor } from '~~/generated/contract-types';

const defaultQuantity = 1;

export const TransactionInput: FC<{ unit: string; onChange: any; value: number }> = ({ unit, onChange, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-between w-96 bg-yellow">
      <input
        id="quantity-input"
        className="w-3/4 p-1 text-xl bg-yellow"
        type="text"
        onChange={onChange}
        value={value}
      />
      <span id="quantity-unit" className="inline-flex items-center px-3 text-xl bg-yellow">
        {unit}
      </span>
    </div>
  );
};

export const TransactionValue: FC<{ unit: string; value: number }> = ({ unit, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-between w-96 bg-yellow">
      <span id="quantity-input" className="w-3/4 p-1 text-xl text-left bg-yellow">
        {value}
      </span>
      <span id="quantity-unit" className="inline-flex items-center px-3 text-xl bg-yellow">
        {unit}
      </span>
    </div>
  );
};
export const BuyTokens: FC<{
  vendorWrite: Vendor;
}> = ({ vendorWrite }) => {
  const [inputQuantity, setInputQuantity] = useState(defaultQuantity);

  // TODO: do something with this
  const [buying, setBuying] = useState(false);

  // @ts-ignore
  const handleBuyClick = async (): void => {
    setBuying(true);
    const tokensPerEth = await vendorWrite.tokensPerEth();
    const ethCostToPurchaseTokens = ethers.utils.parseEther(`${inputQuantity / parseFloat(tokensPerEth.toString())}`);
    await vendorWrite.buyTokens({ value: ethCostToPurchaseTokens });
    setBuying(false);
  };

  const handleQuantityChange = (event: { target: { value: string } }): void => {
    const re = /^[0-9\b]+$/;
    const val = event.target.value;
    if (val === '' || re.test(val)) {
      // TODO: deal with string / big number typing on this.
      setInputQuantity(val);
    }
  };

  return (
    <div className="w-1/2 m-auto">
      <div id="container" className="flex flex-col items-center">
        <div id="tabs" className="flex flex-row justify-between w-full">
          <div className="flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl">
            BUY
          </div>
          <div className="flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl">
            SELL
          </div>
        </div>

        <div
          id="buy-sell-tab-content"
          className="flex flex-col items-center w-full py-4 bg-white border-2 rounded-b-xl">
          <TransactionInput unit="GLD" onChange={handleQuantityChange} value={inputQuantity} />
          <div className="p-2 text-lg">⚜️ FOR ⚜️</div>
          <TransactionValue unit="ETH" value={inputQuantity / 100} />

          <button className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72" onClick={handleBuyClick}>
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
};
