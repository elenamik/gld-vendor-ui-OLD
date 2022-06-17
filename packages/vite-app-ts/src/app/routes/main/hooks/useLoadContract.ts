import { TContractLoaderConfig, TDeployedContractsJson, THardhatContractJson } from 'eth-hooks/models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsMounted } from 'usehooks-ts';

import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';

export const parseContractsInJson = (
  contractList: TDeployedContractsJson,
  chainId: number
): Record<string, THardhatContractJson> => {
  let combinedContracts: Record<string, THardhatContractJson> = {};

  // combine partitioned contracts based on all the available and chain id.
  if (contractList?.[chainId] != null) {
    for (const network in contractList[chainId]) {
      if (Object.prototype.hasOwnProperty.call(contractList[chainId], network)) {
        const chainContracts = contractList?.[chainId]?.[network]?.contracts;
        if (chainContracts != null) {
          combinedContracts = {
            ...combinedContracts,
            ...chainContracts,
          };
        }
      }
    }
  }

  return combinedContracts;
};
export const useLoadContract = (
  config: TContractLoaderConfig = {},
  providers: IScaffoldAppProviders
): Record<string, THardhatContractJson> => {
  const isMounted = useIsMounted();
  const [contracts, setContracts] = useState<Record<string, THardhatContractJson>>({});
  const configDep: string = useMemo(() => `${JSON.stringify(config ?? providers)}`, [config, providers]);
  const callFunc = useCallback(() => {
    const chainId = providers?.targetNetwork.chainId;
    const contractList = parseContractsInJson({ ...(config.deployedContractsJson ?? {}) }, chainId);
    if (isMounted()) {
      setContracts(contractList);
      console.log(`🌀🌀🌀 loading read contracts..`);
    }
  }, [configDep]);

  useEffect(() => {
    void callFunc();
  }, [callFunc]);

  return contracts;
};
