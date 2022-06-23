import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, useState } from 'react';

import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';

export const TransactionInput: FC<{ unit: string }> = ({ unit }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-center mb-3 bg-brown">
      <input id="quantity-input" className="p-1 bg-yellow" type="text" />
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
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  const handleBuyClick = async (): void => {
    setLoading(true);
  };

  return (
    <div id="buy-sell-tab-container" className="flex justify-center">
      <div id="buy-sell-tab-content" className="flex flex-col items-center justify-center w-1/2 pt-6 bg-white border-2">
        <TransactionInput unit="ETH" />
        <div className="p-2">⚜ FOR ⚜</div>
        <TransactionInput unit="GLD" />
        <button className="w-1/3 p-1 m-3 border-2" onClick={handleBuyClick}>
          EXECUTE
        </button>
      </div>
    </div>
  );
};
