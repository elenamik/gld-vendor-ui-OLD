import { Button } from 'antd';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, useState } from 'react';
import { invariant } from 'ts-invariant';
import { useDebounce } from 'use-debounce';
import { useIsMounted } from 'usehooks-ts';

import { IScaffoldAppProviders } from '~~/app/routes/main/hooks/useScaffoldAppProviders';

export const Account: FC<{
  providers: IScaffoldAppProviders;
}> = ({ providers }) => {
  const ethersContext = useEthersAppContext();
  const [connecting, setConnecting] = useState(false);

  console.log('context in acct', ethersContext);
  const isMounted = useIsMounted();
  const [loadingButton, loadingButtonDebounce] = useDebounce(connecting, 1000, {
    maxWait: 1500,
  });

  if (loadingButton && connecting) {
    setConnecting(false);
  }
  const handleLoginClick = (): void => {
    if (providers.createLoginConnector != null) {
      const connector = providers.createLoginConnector?.();
      if (connector) ethersContext.activate(connector);
      if (!isMounted()) {
        invariant.log('openModal: no longer mounted');
      } else if (connector) {
        setConnecting(true);
      } else {
        invariant.warn('openModal: A valid EthersModalConnector was not provided');
      }
    }
  };

  const handleLogoutClick = (): void => {
    ethersContext.disconnectModal();
  };

  if (ethersContext.active) {
    return (
      <div>
        The wallet connected is {ethersContext.account}
        <br />
        <Button
          loading={loadingButtonDebounce.isPending()}
          key="logoutbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={handleLogoutClick}>
          Log Out
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <Button
          loading={loadingButtonDebounce.isPending()}
          key="loginbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={handleLoginClick}>
          Connect Wallet
        </Button>{' '}
      </div>
    );
  }
};
