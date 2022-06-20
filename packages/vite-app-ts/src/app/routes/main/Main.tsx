import { useEthersContext } from 'eth-hooks/context';
import React, { FC, useEffect, useState } from 'react';
import { invariant } from 'ts-invariant';
import { useIsMounted } from 'usehooks-ts';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';

import { BigNumber } from 'ethers';
import { useBalance, useContractLoader } from 'eth-hooks';
import { useDebounce } from 'use-debounce';

import { IScaffoldAppProviders, useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { formatEther } from '@ethersproject/units';

import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

import { Button } from 'antd';

export const parseEther = (balance: BigNumber) => {
  return balance ? 0 : formatEther(BigNumber.from(balance));
};

export const Account: FC<{
  providers: IScaffoldAppProviders;
}> = ({ providers }) => {
  const ethersContext = useEthersContext();
  const [connecting, setConnecting] = useState(false);

  console.log('context in acct', ethersContext);
  const isMounted = useIsMounted();
  const [loadingButton, loadingButtonDebounce] = useDebounce(connecting, 1000, {
    maxWait: 1500,
  });

  if (loadingButton && connecting) {
    setConnecting(false);
  }
  const handleLoginClick = async (): void => {
    if (providers.createLoginConnector != null) {
      const connector = providers.createLoginConnector?.();
      await connector.activate();
      if (!isMounted()) {
        invariant.log('openModal: no longer mounted');
      } else if (connector) {
        setConnecting(true);
      } else {
        invariant.warn('openModal: A valid EthersModalConnector was not provided');
      }
    }
  };

  if (ethersContext.active) {
    return (
      <div>
        The wallet connected is {ethersContext.account}
        <br />
        <button onClick={ethersContext.disconnectModal}>Log Out</button>
      </div>
    );
  } else {
    return (
      <div>
        No Wallet Connected
        <br />
        <Button
          loading={loadingButtonDebounce.isPending()}
          key="loginbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={handleLoginClick}>
          Connect Wallet
        </Button>
      </div>
    );
  }
};

export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const ethersContext = useEthersContext();
  const appContractConfig = useAppContracts();

  const readContracts = useContractLoader(appContractConfig);
  const vendorContract = readContracts['Vendor'] as Vendor;
  const tokenContract = readContracts['YourToken'] as YourTokenContract;

  const [vendorTokenBal, setVendorTokenBal] = useState<string>('0');
  const vendorEthBal = parseEther(useBalance(vendorContract?.address));

  const readTokenVendorBal = async () => {
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
