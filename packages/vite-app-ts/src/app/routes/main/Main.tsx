import React, { FC, useEffect, useState } from 'react';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';

import { BigNumber } from 'ethers';
import { useContractLoader, useEventListener } from 'eth-hooks';

import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { Account } from '~~/app/common/Account';
import { getFaucetAvailable } from '~~/app/common/FaucetHintButton';
import { TokenVendor } from '~~/app/common/TokenVendor';
import { ViewEvents } from '~~/app/common/ViewEvents';
import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

import { useEthersAppContext } from 'eth-hooks/context';
import { Balance, Faucet } from 'eth-components/ant';
import { TEthersProviderOrSigner } from 'eth-hooks/models';
import { useDexEthPrice } from 'eth-hooks/dapps';

export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const appContractConfig = useAppContracts();
  const ethersContext = useEthersAppContext();

  const readContracts = useContractLoader(appContractConfig, ethersContext.provider as TEthersProviderOrSigner);
  const writeContracts = useContractLoader(appContractConfig, ethersContext.signer);

  const vendorContract = readContracts['Vendor'] as unknown as Vendor;
  const tokenContract = readContracts['YourToken'] as unknown as YourTokenContract;
  const vendorContractWrite = writeContracts['Vendor'] as unknown as Vendor;
  const tokenContractWrite = writeContracts['YourToken'] as unknown as YourTokenContract;

  console.log('PROVIDERS', scaffoldAppProviders);
  console.log('CONTEXT', ethersContext);
  console.log('CONTRACTS', readContracts);

  const [vendorTokenBalance, setVendorTokenBalance] = useState<BigNumber>();
  const [yourTokenBalance, setYourTokenBalance] = useState<BigNumber>();

  const sellTokensEvents = useEventListener(vendorContract, 'SellTokens', 1);
  console.log('sell events', sellTokensEvents);
  const buyTokensEvents = useEventListener(vendorContract, 'BuyTokens', 1);
  console.log('buy events', buyTokensEvents);

  // @ts-ignore
  const getTokenBalance = async (address: string, callback: (balance: BigNumber) => void): void => {
    const balance = await tokenContract?.balanceOf(address);
    callback(balance);
  };
  const faucetAvailable = getFaucetAvailable(scaffoldAppProviders, ethersContext);
  const ethPrice = useDexEthPrice(scaffoldAppProviders.mainnetProvider, scaffoldAppProviders.targetNetwork);
  console.log('FAUCET AVAIL', faucetAvailable);

  useEffect(() => {
    if (vendorContract) {
      getTokenBalance(vendorContract.address, setVendorTokenBalance);
      getTokenBalance(ethersContext.account!, setYourTokenBalance);
      console.log(ethersContext);
    }
  }, [vendorContract?.address]);

  return (
    <div className="App">
      <div className="flex flex-col text-3xl font-extrabold font-display">BUY AND SELL GLD TOKENS</div>
      <Account providers={scaffoldAppProviders} />
      <div>
        balance of ETH in Vendor is <Balance address={vendorContract?.address} />
        ETH
      </div>
      <div>
        balance of tokens in Vendor is <Balance balance={vendorTokenBalance} address={undefined} /> ETH
      </div>
      <div>
        your balance of tokens is <Balance balance={yourTokenBalance} address={undefined} /> GLD
      </div>
      {ethersContext.active && <TokenVendor vendorWrite={vendorContractWrite} tokenWrite={tokenContractWrite} />}
      <div className="w-full">
        <ViewEvents sellEvents={sellTokensEvents[0]} buyEvents={buyTokensEvents[0]} />
      </div>
      {
        // if the local provider has a signer, let's show the faucet:
        faucetAvailable && scaffoldAppProviders?.mainnetProvider && scaffoldAppProviders?.localProvider && (
          <Faucet
            localProvider={scaffoldAppProviders.localProvider}
            price={ethPrice}
            mainnetProvider={scaffoldAppProviders.mainnetProvider}
          />
        )
      }
    </div>
  );
};

export default Main;
