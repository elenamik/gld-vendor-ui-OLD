import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, useState } from 'react';

import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';

const defaultQuantity = 1;

export const TransactionInput: FC<{ unit: string; onChange: any; value: number }> = ({ unit, onChange, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-center w-1/2 mb-3 bg-brown">
      <input id="quantity-input" className="p-1 bg-yellow" type="text" onChange={onChange} value={value} />
      <span id="quantity-unit" className="inline-flex items-center px-3 bg-yellow">
        {unit}
      </span>
    </div>
  );
};

export const TransactionValue: FC<{ unit: string; value: number }> = ({ unit, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-center w-1/2 mb-3 bg-brown">
      <span id="quantity-input" className="p-1 bg-yellow">
        {value}
      </span>
      <span id="quantity-unit" className="inline-flex items-center px-3 bg-yellow">
        {unit}
      </span>
    </div>
  );
};
export const BuyTokens: FC<{
  providers: IScaffoldAppProviders;
}> = ({ providers }) => {
  const ethersContext = useEthersAppContext();
  const [inputQuantity, setInputQuantity] = useState(defaultQuantity);

  // @ts-ignore
  const handleBuyClick = async (): void => {};

  const handleQuantityChange = (event: { target: { value: number } }): void => {
    setInputQuantity(event.target.value);
  };

  return (
    <div id="buy-sell-tab-container" className="flex justify-center">
      <div id="buy-sell-tab-content" className="flex flex-col items-center justify-center w-1/2 pt-6 bg-white border-2">
        <TransactionInput unit="GLD" onChange={handleQuantityChange} value={inputQuantity} />
        <div className="p-2">⚜ FOR ⚜</div>
        <TransactionValue unit="ETH" value={inputQuantity / 100} />
        <button className="w-1/3 p-1 m-3 border-2" onClick={handleBuyClick}>
          EXECUTE
        </button>
      </div>
    </div>
  );
};
