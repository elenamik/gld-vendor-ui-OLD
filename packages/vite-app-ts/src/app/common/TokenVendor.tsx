import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import { TransactionInput } from './TransactionInput';
import { TransactionValue } from './TransactionValue';

import { Vendor } from '~~/generated/contract-types';

const defaultQuantity = 1;

export const TokenVendor: FC<{
  vendorWrite: Vendor;
}> = ({ vendorWrite }) => {
  const [inputQuantity, setInputQuantity] = useState(defaultQuantity);
  const [action, setAction] = useState<'BUYING' | 'SELLING'>('BUYING');
  console.log(action);
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
          <button
            onClick={(): void => {
              setAction('BUYING');
            }}
            className={
              'flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl ' +
              (action === 'BUYING' ? 'bg-white' : 'bg-gray')
            }>
            BUY
          </button>
          <button
            onClick={(): void => {
              setAction('SELLING');
            }}
            className={
              'flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl ' +
              (action === 'SELLING' ? 'bg-white' : 'bg-gray')
            }>
            SELL
          </button>
        </div>
        <div
          id="buy-sell-tab-content"
          className="flex flex-col items-center w-full py-4 bg-white border-2 rounded-b-xl">
          <BuyTokens
            handleQuantityChange={handleQuantityChange}
            inputQuantity={inputQuantity}
            handleBuyClick={handleBuyClick}
          />
        </div>
      </div>
    </div>
  );
};

const BuyTokens: FC<{
  handleQuantityChange: any;
  inputQuantity: any;
  handleBuyClick: any;
}> = ({ handleQuantityChange, inputQuantity, handleBuyClick }) => {
  return (
    <>
      <TransactionInput unit="GLD" onChange={handleQuantityChange} value={inputQuantity} />
      <div className="p-2 text-lg">⚜️ FOR ⚜️</div>
      <TransactionValue unit="ETH" value={inputQuantity / 100} />

      <button className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72" onClick={handleBuyClick}>
        EXECUTE
      </button>
    </>
  );
};
