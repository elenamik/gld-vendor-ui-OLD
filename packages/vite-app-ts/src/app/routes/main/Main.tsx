import React, { FC, useEffect, useState } from 'react';
import { useEthersContext } from 'eth-hooks/context';

import '~~/styles/main-page.css';
import { useAppContracts } from './hooks/useAppContracts';
import {BigNumber, ethers} from "ethers";
import {useBalance, useContractLoader } from 'eth-hooks';
import {IScaffoldAppProviders, useScaffoldProviders} from './hooks/useScaffoldAppProviders';
import { formatEther } from '@ethersproject/units';
import {IEthersContext} from "eth-hooks/context/EthersAppContext";


export const Main: FC = () => {
    const scaffoldAppProviders = useScaffoldProviders();
    const ethersContext = useEthersContext();
    const appContractConfig = useAppContracts();

    console.log(ethersContext)


    const readContracts = useContractLoader(appContractConfig)
    const vendorContract = readContracts['Vendor'] as any;
    const tokenContract = readContracts['YourToken'] as any;


    const [vendorTokenBal, setVendorTokenBal] = useState<string >('0')
    const vendorEthBal = parseEther(useBalance(vendorContract?.address))

    const readTokenVendorBal = async ()=> {
        const getVendorTokenBal = async ()=> {
            const bal = await tokenContract?.balanceOf(vendorContract?.address)
            setVendorTokenBal(parseEther(bal))
        }
        await getVendorTokenBal()
    }
    useEffect(()=> {
        if (vendorContract){
            readTokenVendorBal()
        }
    }, [vendorContract?.address])

    return (
    <div className="App">
        <WalletHeader context={ethersContext} providers={scaffoldAppProviders}/>
      hi, world
        <div>
            Account connected is
        </div>
    <div>
        balance of ETH in Vendor is {vendorEthBal} ETH
    </div>
        <div>
            balance of tokens in Vendor is {vendorTokenBal} ETH
        </div>
    </div>
  );
};

export default Main;

export const parseEther= (balance: BigNumber)=> {
    return formatEther(BigNumber.from(balance));
}

export const WalletHeader: FC<{context: IEthersContext, providers: IScaffoldAppProviders}> = ({context, providers})=> {
    if (context.account){
        return <div>
            Connected account is {context.account}
            <br/>
            <button onClick={context.disconnectModal}>
                Disconnect Wallet
            </button>
        </div>
    } else {
        return <div>
            <button onClick={()=> {
                console.log('opening?') // TODO: gotta do this with web3 modal?
                providers.createLoginConnector()}}>
                Connect Wallet
            </button>
        </div>
    }
}