import React, { FC } from 'react';
import { useEthersContext } from 'eth-hooks/context';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';
import {BigNumber, ethers} from "ethers";
import {useBalance, useContractLoader } from 'eth-hooks';
import { useScaffoldProviders } from './hooks/useScaffoldAppProviders';
import { formatEther } from '@ethersproject/units';


export const Main: FC = () => {
    const scaffoldAppProviders = useScaffoldProviders();

    const ethersContext = useEthersContext();

    const appContractConfig = useAppContracts();

    const contract = useContractLoader(appContractConfig, undefined, 4)
    const vendorContract = contract['Vendor'] as any;
    console.log('VENDOR', vendorContract)
    const vendorBal = useBalance(vendorContract?.address)
    console.log(formatEther(BigNumber.from(vendorBal)))


    return (
    <div className="App">
      hi, world
    <div>
        balance of ETH in Vendor is {} ETH
    </div>
    </div>
  );
};

export default Main;
