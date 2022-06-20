import React, { FC, useEffect, useState } from 'react';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';

import { BigNumber, ethers } from 'ethers';
import { useContractLoader } from 'eth-hooks';

import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { Account } from '~~/app/common/Account';
import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

import { useEthersAppContext } from 'eth-hooks/context';
import { Balance } from 'eth-components/ant';
import { TEthersProviderOrSigner } from 'eth-hooks/models';

export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const appContractConfig = useAppContracts();
  const ethersContext = useEthersAppContext();

  const readContracts = useContractLoader(appContractConfig, ethersContext.provider as TEthersProviderOrSigner);
  const vendorContract = readContracts['Vendor'] as unknown as Vendor;
  const tokenContract = readContracts['YourToken'] as unknown as YourTokenContract;

  console.log('contracts', vendorContract, tokenContract);
  const [vendorTokenBalance, setVendorTokenBalance] = useState<BigNumber>();

  // @ts-ignore
  const getVendorTokenBalance = async (): void => {
    const balance = await tokenContract?.balanceOf(vendorContract?.address);
    console.log('🏵 vendorTokenBalance:', balance ? ethers.utils.formatEther(balance) : '...');
    setVendorTokenBalance(balance);
  };

  useEffect(() => {
    if (vendorContract) {
      getVendorTokenBalance();
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
    </div>
  );
};

export default Main;
