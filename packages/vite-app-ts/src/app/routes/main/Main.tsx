import { useBlockNumberContext, useEthersContext } from 'eth-hooks/context';
import React, { FC, useCallback, useEffect, useState } from 'react';

import '~~/styles/main-page.css';

import { useAppContracts } from './hooks/useAppContracts';
import { useLoadContract } from './hooks/useLoadContract';
import { IScaffoldAppProviders, useScaffoldProviders } from './hooks/useScaffoldAppProviders';

import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import { IEthersContext } from 'eth-hooks/context/EthersAppContext';
import { Account } from 'eth-components/ant';
const zero = BigNumber.from(0);

export const parseEther = (balance: BigNumber) => {
  return formatEther(BigNumber.from(balance));
};
export const useReadOnlyBalance = (providers: IScaffoldAppProviders, address: string): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(zero);
  const blockNumber = useBlockNumberContext();
  console.log('BALANCE IS', parseEther(balance));

  const callFunc = useCallback(async (): Promise<void> => {
    const newBalance = await providers.currentProvider?.getBalance(address);
    setBalance(newBalance);
  }, [address, providers]);

  useEffect(() => {
    void callFunc();
  }, [blockNumber, callFunc]);

  return balance;
};
export const Main: FC = () => {
  const scaffoldAppProviders = useScaffoldProviders();
  const ethersContext = useEthersContext();
  const appContractConfig = useAppContracts();
  console.log('PROVIDERS', scaffoldAppProviders);
  // console.log('CONTEXT', ethersContext);
  // console.log('CONTRACT CONFIG', appContractConfig);

  const readContracts = useLoadContract(appContractConfig, scaffoldAppProviders);
  console.log('READ CONTRACTS', readContracts);
  // adding unknown so linter does not yell at me

  const vendorContract = readContracts['Vendor'] as unknown as Vendor;
  const tokenContract = readContracts['YourToken'] as unknown as YourTokenContract;

  const [vendorTokenBal, setVendorTokenBal] = useState<string>('0');
  // TODO: should be in a state var
  const vendorEthBal = parseEther(useReadOnlyBalance(scaffoldAppProviders, vendorContract?.address));
  console.log('Vendor ETH BAL', vendorEthBal);
  console.log('token contract bal', vendorTokenBal);

  const readTokenVendorBal = async (): Promise<any> => {
    const getVendorTokenBal = async (): Promise<any> => {
      console.log('RE EXECUTING');
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
      {/* <AccountHeader context={ethersContext} providers={scaffoldAppProviders}/>*/}
      <Account
        createLoginConnector={scaffoldAppProviders.createLoginConnector}
        ensProvider={scaffoldAppProviders.mainnetProvider}
        price={0}
        blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      hi, world
      <div>Account connected is</div>
      <div>balance of ETH in Vendor is {vendorEthBal} ETH</div>
      <div>balance of tokens in Vendor is {vendorTokenBal} ETH</div>
    </div>
  );
};

export default Main;

export const AccountHeader: FC<{ context: IEthersContext; providers: IScaffoldAppProviders }> = ({
  context,
  providers,
}) => {
  if (context.account) {
    return (
      <div>
        Connected account is {context.account}
        <br />
        <button onClick={context.disconnectModal}>Disconnect Wallet</button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            console.log('opening?'); // TODO: gotta do this with web3 modal?
            providers.createLoginConnector();
          }}>
          Connect Wallet
        </button>
      </div>
    );
  }
};
