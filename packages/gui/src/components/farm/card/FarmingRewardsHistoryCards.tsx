import { useGetFarmedAmountQuery } from '@xxch-network/api-react';
import {
  useCurrencyCode,
  mojoToXxchLocaleString,
  useLocale,
  CardSimple,
  FormatLargeNumber,
  Tooltip,
} from '@xxch-network/core';
import { Trans } from '@lingui/macro';
import { Grid, Typography, Box } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
  border-collapse: collapse;
  td:first-child {
    padding-right: 8px;
  }
`;

export default React.memo(FarmingRewardsHistoryCards);
function FarmingRewardsHistoryCards() {
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const totalXxchFarmedCard = useMemo(() => {
    if (!data || isLoading) {
      return <CardSimple title={<Trans>Total XXCH Farmed</Trans>} value="-" loading={isLoading} error={error} />;
    }

    let cardValue: React.ReactElement | string = '-';
    if (data && data.farmedAmount) {
      const title = (
        <StyledTable>
          <tbody>
            <tr>
              <td>
                <Trans>Pool Reward</Trans>
              </td>
              <td>
                {mojoToXxchLocaleString(data.poolRewardAmount, locale)}
                &nbsp;
                {currencyCode}
              </td>
            </tr>
            <tr>
              <td>
                <Trans>Farmer Reward</Trans>
              </td>
              <td>
                {mojoToXxchLocaleString(data.farmerRewardAmount, locale)}
                &nbsp;
                {currencyCode}
              </td>
            </tr>
            <tr>
              <td>
                <Trans>Block Fee</Trans>
              </td>
              <td>
                {mojoToXxchLocaleString(data.feeAmount, locale)}
                &nbsp;
                {currencyCode}
              </td>
            </tr>
          </tbody>
        </StyledTable>
      );

      cardValue = (
        <Tooltip title={title}>
          {mojoToXxchLocaleString(data.farmedAmount, locale)}
          &nbsp;
          {currencyCode}
        </Tooltip>
      );
    }

    return <CardSimple title={<Trans>Total XXCH Farmed</Trans>} value={cardValue} loading={isLoading} error={error} />;
  }, [data, locale, currencyCode, isLoading, error]);

  const blocksWonCard = useMemo(() => {
    if (!data || isLoading) {
      return <CardSimple title={<Trans>Blocks won</Trans>} value="-" loading={isLoading} error={error} />;
    }

    return <CardSimple title={<Trans>Blocks won</Trans>} value={data.blocksWon} loading={isLoading} error={error} />;
  }, [data, isLoading, error]);

  const lastBlockWonCard = useMemo(() => {
    if (!data || isLoading) {
      return <CardSimple title={<Trans>Last block won</Trans>} value="-" loading={isLoading} error={error} />;
    }
    if (data.lastTimeFarmed === 0) {
      return <CardSimple title={<Trans>Last block won</Trans>} value="Never" loading={isLoading} error={error} />;
    }

    const time = moment(data.lastTimeFarmed * 1000);
    const cardValue = (
      <Tooltip title={time.format('LLL')}>
        {time.format('LL')} - <Trans>Block</Trans> <FormatLargeNumber value={data.lastHeightFarmed} />
      </Tooltip>
    );
    return <CardSimple title={<Trans>Last block won</Trans>} value={cardValue} loading={isLoading} error={error} />;
  }, [data, isLoading, error]);

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        <Trans>Farming Rewards History</Trans>
      </Typography>
      <Grid spacing={2} alignItems="stretch" container>
        <Grid xs={12} sm={6} md={4} item>
          <CardSimple title={<Trans>Stake Reward</Trans>} value={
            `${mojoToXxchLocaleString(data?.stakeFarmRewardAmount, locale)} ${currencyCode}`
          } loading={isLoading} error={error} />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <CardSimple title={<Trans>Lock Reward</Trans>} value={
            `${mojoToXxchLocaleString(data?.stakeLockRewardAmount, locale)} ${currencyCode}`
          } loading={isLoading} error={error} />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <CardSimple title={<Trans>Farmer Reward</Trans>} value={
            `${mojoToXxchLocaleString(data?.farmerRewardAmount, locale)} ${currencyCode}`
          } loading={isLoading} error={error} />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          {totalXxchFarmedCard}
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          {blocksWonCard}
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          {lastBlockWonCard}
        </Grid>
      </Grid>
    </Box>
  );
}
