import {TransactionType, TransactionTypeFilterMode, StakeValue, toBech32m} from '@xxch-network/api';
import {useGetSyncStatusQuery} from "@xxch-network/api-react";
import {
  AddressBookContext,
  Card,
  CopyToClipboard,
  Flex,
  TableControlled,
  useCurrencyCode,
  mojoToXxch,
  FormatLargeNumber,
  truncateValue,
} from '@xxch-network/core';
import type { Row } from '@xxch-network/core';
import {t, Trans} from '@lingui/macro';
import {
  Box,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import moment from 'moment';
import React, {useCallback, useContext, useMemo} from 'react';

import useWalletTransactions from '../../hooks/useWalletTransactions';

import StakeHistoryChip from "./StakeHistoryChip";
import StakeHistoryPending from "./StakeHistoryPending";
import StakeWithdrawDialog from "./StakeWithdrawDialog";

const getCols = (isStakeFarm: boolean) => [
  {
    field: (row: Row, metadata: any) => (
        <>
          <strong>
            <FormatLargeNumber value={mojoToXxch(row.amount)} />
          </strong>
          &nbsp;
          {metadata.feeUnit}
        </>
      ),
    title: <Trans>Asset</Trans>,
  },

  {
    field: (row: Row, metadata: any) => (
      <Typography variant="caption" component="span">
        {row.confirmedAtHeight}
      </Typography>
    ),
    title: <Trans>Confirmed at Height</Trans>,
  },
  {
    field: (row: Row, metadata: any) => {
      const address = toBech32m(row.metadata?.recipientPuzzleHash??'', metadata.feeUnit)
      let stakeAddress = truncateValue(row.toAddress, {leftLength: 2, rightLength: 4});
      let stakeEmoji = null;
      let rewardAddress = truncateValue(address, {});
      let rewardEmoji = null;
      if (metadata.matchList) {
        metadata.matchList.forEach((contact) => {
          if (contact.address === row.toAddress) {
            stakeAddress = contact.displayName;
            stakeEmoji = contact.emoji;
          }
          if (isStakeFarm && contact.address === address) {
            rewardAddress = contact.displayName;
            rewardEmoji = contact.emoji;
          }
        });
      }
      return (
        <Flex flexDirection="column" gap={1}>
          {isStakeFarm && (
          <div>
            <Typography variant="caption" component="span">
              <Trans>To Stake:</Trans>
            </Typography>
            <Tooltip
              title={
                <Flex flexDirection="column" gap={1}>
                  <Flex flexDirection="row" alignItems="center" gap={1}>
                    <Box maxWidth={200}>{row.toAddress}</Box>
                    <CopyToClipboard value={row.toAddress} fontSize="small" />
                  </Flex>
                </Flex>
              }
            >
              <span> {stakeEmoji} {stakeAddress}</span>
            </Tooltip>
          </div>
          ) }
          <Flex>
            <Typography variant="caption" component="span">
               {isStakeFarm ? <Trans>To Reward:</Trans> : <Trans>To Lock:</Trans>}
            </Typography>
            <Tooltip
              title={
                <Flex flexDirection="column" gap={1}>
                  <Flex flexDirection="row" alignItems="center" gap={1}>
                    <Box maxWidth={200}>{address}</Box>
                    <CopyToClipboard value={address} fontSize="small" />
                  </Flex>
                </Flex>
              }
            >
              <span> {rewardEmoji} {rewardAddress}</span>
            </Tooltip>
          </Flex>
        </Flex>
      );
    },
    title: <Trans>Address</Trans>,
  },
  {
    field: (row: Row) => (
      <Flex flexDirection="column" gap={1}>
        <Typography color="textSecondary" variant="body2">
          {moment(row.createdAtTime * 1000).format('LLL')}
        </Typography>
        <Flex>
        <Typography color="textSecondary" variant="body2">
          {moment(row.createdAtTime * 1000).add(row.metadata?.timeLock, 'seconds').format('LLL')}
        </Typography>
        </Flex>
      </Flex>
    ),
    title: <Trans>Confirmed / Expiration Date</Trans>,
    forceWrap: true,
  },

  {
    field: (row: Row, metadata) => (
      <Flex flexDirection="column" gap={0.5}>
      <Typography color="textPrimary" variant="body2">
        {metadata.getStakeTypeName(row.metadata?.stakeType)}
      </Typography>
        <Flex>
          {row.confirmed ? (
              <Chip size="small" variant="outlined" color="info" label={<Trans>withdrawal</Trans>} />
            ) : (
              <StakeHistoryChip
                transactionRow={row}
                feeUnit={metadata.feeUnit}
                setStakeWithdrawDialogProps={metadata.setStakeWithdrawDialogProps}
              />
            )}
        </Flex>
      </Flex>
    ),
    title: <Trans>Status</Trans>,
  },
];

type Props = {
  walletId: number;
  isStakeFarm: boolean;
  stakeList: StakeValue[];
  stakeOldList: StakeValue[];
};

export default function StakeHistory(props: Props) {
  const { walletId, isStakeFarm, stakeList, stakeOldList } = props;

  const { data: walletState, isLoading: isWalletSyncLoading } = useGetSyncStatusQuery(undefined, {
    pollingInterval: 10_000,
  });

  const {
    transactions,
    isLoading: isWalletTransactionsLoading,
    page,
    rowsPerPage,
    count,
    pageChange,
  } = useWalletTransactions({
    walletId,
    defaultRowsPerPage: 10,
    defaultPage: 0,
    sortKey: 'RELEVANCE',
    reverse: false,
    confirmed: true,
    typeFilter: {
      mode: TransactionTypeFilterMode.INCLUDE,
      values: [
        isStakeFarm ? TransactionType.INCOMING_STAKE_FARM_RECEIVE : TransactionType.INCOMING_STAKE_LOCK_RECEIVE
      ],
    },
  });

  const feeUnit = useCurrencyCode();
  const [, , , , , getContactByAddress, getContactByStakeAddress] = useContext(AddressBookContext);

  const isLoading = isWalletTransactionsLoading;
  const isSyncing = isWalletSyncLoading || !walletState || !!walletState?.syncing;
  const isSynced = !isSyncing && walletState?.synced;

  const [stakeWithdrawDialogProps, setStakeWithdrawDialogProps] = React.useState<{
    coinId: string;
    amountInMojo: number;
    isStakeFarm: boolean;
    address: string;
  } | null>(null);

  const handleCloseStakeWithdrawDialog = useCallback(() => setStakeWithdrawDialogProps(null), []);


  const contacts = useMemo(() => {
    if (!transactions || isWalletTransactionsLoading) {
      return [];
    }

    const contactList: { displayName: string; address: string }[] = [];

    (transactions ?? []).forEach((transaction) => {
      if (isStakeFarm) {
        const match = getContactByStakeAddress(transaction.toAddress);
        if (match) {
          match.stakeAddresses.forEach((stakeInfo) => {
            if (transaction.toAddress === stakeInfo.address) {
              const nameStr = JSON.stringify(match.name).slice(1, -1);
              const emojiStr = match.emoji ? match.emoji : '';
              const matchColor = (theme) => `${match.color ? theme.palette.colors[match.color].main : null}`;
              const addNameStr = JSON.stringify(stakeInfo.name).slice(1, -1);
              const matchName = `${emojiStr} ${nameStr} | ${addNameStr}`;
              contactList.push({displayName: matchName, address: stakeInfo.address, color: matchColor});
            }
          });
        }
      }
      const address = toBech32m(transaction.metadata?.recipientPuzzleHash??'', feeUnit);
      const match = getContactByAddress(address);
      if (match) {
        match.addresses.forEach((addressInfo) => {
          if (address === addressInfo.address) {
            const nameStr = JSON.stringify(match.name).slice(1, -1);
            const emojiStr = match.emoji ? match.emoji : '';
            const matchColor = (theme) => `${match.color ? theme.palette.colors[match.color].main : null}`;
            const addNameStr = JSON.stringify(addressInfo.name).slice(1, -1);
            const matchName = `${emojiStr} ${nameStr} | ${addNameStr}`;
            contactList.push({ displayName: matchName, address: addressInfo.address, color: matchColor });
          }
        });
      }
    });
    return contactList;
  }, [transactions, isWalletTransactionsLoading]);


  function getStakeTypeName(stakeType: number): string {
    const list = stakeType < 19 ? stakeOldList : stakeList;
    const val = list[stakeType < 19 ? stakeType : stakeType - 20] || {timeLock:0, coefficient:0, rewardCoefficient: null};
    return ` ${val.timeLock/86_400} ${t`days`} (${val.coefficient}${val.rewardCoefficient == null?``:
      `/${parseFloat((parseFloat(val.rewardCoefficient)*10_000).toFixed(1))}‱`})`;
  }

  const metadata = useMemo(() => {
    const matchList = contacts;
    return {
      feeUnit,
      stakeList,
      setStakeWithdrawDialogProps,
      getStakeTypeName,
      matchList,
    };
  }, [feeUnit, stakeList, contacts]);

  const cols = useMemo(() => {
    return getCols(isStakeFarm);
  }, [isStakeFarm]);


  const ExtraRowsAfterHeader = useMemo(
    () =>
        <StakeHistoryPending
          walletId={walletId}
          cols={cols}
          isStakeFarm={isStakeFarm}
          metadata={metadata}
        />
      ,
    [cols, isStakeFarm, metadata, walletId]
  );

  return (
    <Card title={
      isStakeFarm? <Trans>Stake Farm Transactions</Trans> : <Trans>Stake Lock Transactions</Trans>
    } titleVariant="h6" transparent>
      <StakeWithdrawDialog
        {...stakeWithdrawDialogProps}
        onClose={handleCloseStakeWithdrawDialog}
        open={!!stakeWithdrawDialogProps}
      />
      <TableControlled
        size="small"
        cols={cols}
        rows={transactions ?? []}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        page={page}
        rowsPerPage={rowsPerPage}
        count={count}
        onPageChange={pageChange}
        isLoading={isLoading}
        metadata={metadata}
        uniqueField="name"
        caption={
          !transactions?.length && (
            <Typography variant="body2" align="center">
              {isStakeFarm ? <Trans>No previous stake farm transactions</Trans> : <Trans>No previous stake lock transactions</Trans>}
            </Typography>
          )
        }
        pages={!!transactions?.length}
        ExtraRowsAfterHeader={ExtraRowsAfterHeader}
      />
    </Card>
  );
}
