/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, useEffect, useState } from 'react';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';

import { BigNumber } from 'ethers';
import { useBalance, useContractLoader } from 'eth-hooks';

import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { formatEther } from '@ethersproject/units';

import { Account } from '~~/app/common/Account';
import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

export const parseEther = (balance: BigNumber): string => {
  return balance ? '0' : formatEther(BigNumber.from(balance));
};

export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const ethersContext = useEthersAppContext();
  const appContractConfig = useAppContracts();

  const readContracts = useContractLoader(appContractConfig, scaffoldAppProviders.currentProvider);
  const vendorContract = readContracts['Vendor'] as unknown as Vendor;
  const tokenContract = readContracts['YourToken'] as unknown as YourTokenContract;
  console.log('contracts', vendorContract, tokenContract);

  const [vendorTokenBal, setVendorTokenBal] = useState<string>('0');
  const bal = useBalance(vendorContract?.address) as unknown as BigNumber;
  const vendorEthBal = parseEther(bal);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const readTokenVendorBal = async () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getVendorTokenBal = async () => {
      const bal = await tokenContract?.balanceOf(vendorContract?.address);
      setVendorTokenBal(parseEther(bal));
    };
    await getVendorTokenBal();
  };
  useEffect(() => {
    if (vendorContract) {
      readTokenVendorBal();
    }
  }, [vendorContract?.address]);

  return (
    <div className="App">
      <Account providers={scaffoldAppProviders} />
      hi, world
      <div>balance of ETH in Vendor is {vendorEthBal} ETH</div>
      <div>balance of tokens in Vendor is {vendorTokenBal} ETH</div>
    </div>
  );
};

export default Main;
