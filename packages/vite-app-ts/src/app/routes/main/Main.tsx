import React, { FC, useEffect, useState } from 'react';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';

import { BigNumber } from 'ethers';
import { useContractLoader } from 'eth-hooks';

import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { Account } from '~~/app/common/Account';
import { BuyTokens } from '~~/app/common/BuyTokens';
import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

import { useEthersAppContext } from 'eth-hooks/context';
import { Balance } from 'eth-components/ant';
import { TEthersProviderOrSigner } from 'eth-hooks/models';

export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const appContractConfig = useAppContracts();
  const ethersContext = useEthersAppContext();

  const readContracts = useContractLoader(appContractConfig, ethersContext.provider as TEthersProviderOrSigner);
  const writeContracts = useContractLoader(appContractConfig, ethersContext.signer);

  const vendorContract = readContracts['Vendor'] as unknown as Vendor;
  const tokenContract = readContracts['YourToken'] as unknown as YourTokenContract;
  const vendorContractWrite = writeContracts['Vendor'] as unknown as Vendor;

  const [vendorTokenBalance, setVendorTokenBalance] = useState<BigNumber>();
  const [yourTokenBalance, setYourTokenBalance] = useState<BigNumber>();

  // @ts-ignore
  const getTokenBalance = async (address: string, callback: (balance: BigNumber) => void): void => {
    const balance = await tokenContract?.balanceOf(address);
    callback(balance);
  };

  useEffect(() => {
    if (vendorContract) {
      //   getVendorTokenBalance();
      getTokenBalance(vendorContract.address, setVendorTokenBalance);
      getTokenBalance(ethersContext.account!, setYourTokenBalance);
      console.log(ethersContext);
    }
  }, [vendorContract?.address]);

  return (
    <div className="App">
      <Account providers={scaffoldAppProviders} />
      <div>
        balance of ETH in Vendor is <Balance address={vendorContract?.address} />
        ETH
      </div>
      <div>
        balance of tokens in Vendor is <Balance balance={vendorTokenBalance} address={undefined} /> ETH
      </div>
      <div>
        your balance of tokens is <Balance balance={yourTokenBalance} address={undefined} /> ETH
      </div>
      {ethersContext.active && <BuyTokens providers={scaffoldAppProviders} vendorWrite={vendorContractWrite} />}
    </div>
  );
};

export default Main;
