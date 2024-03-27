import { useLocalStorage } from '@xxch-network/api-react';
import { Flex, SettingsHR, SettingsSection, SettingsText } from '@xxch-network/core';
import { Trans } from '@lingui/macro';
import { Grid, Box } from '@mui/material';
import React from 'react';

import SettingsStakeAutoWithdraw from './SettingsStakeAutoWithdraw';

export default function SettingsStake() {
  const [wasSettingsStakeVisited, setWasSettingsStakeVisited] = useLocalStorage<boolean>(
    'newFlag--wasSettingsStakeVisited',
    false
  );

  React.useEffect(() => {
    if (!wasSettingsStakeVisited) {
      setWasSettingsStakeVisited(true);
    }
  }, [wasSettingsStakeVisited, setWasSettingsStakeVisited]);

  return (
    <Grid container style={{ maxWidth: '624px' }} gap={3}>

      <Box>
        <SettingsSection>
          <Trans>Auto withdraw stake transactions</Trans>
        </SettingsSection>

        <SettingsText>
          <Trans>Withdraw to you automatically when the stake time period expires.</Trans>
        </SettingsText>
      </Box>
      <SettingsStakeAutoWithdraw sx={{ marginTop: 1 }} />
    </Grid>
  );
}
