import { useGetAutoWithdrawStakeQuery, useSetAutoWithdrawStakeMutation } from '@xxch-network/api-react';
import { Flex, SettingsText, Form, ButtonLoading, Fee, xxchToMojo, mojoToXxch } from '@xxch-network/core';
import { ConnectCheckmark } from '@xxch-network/icons';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SettingsStakeAutoWithdraw(props) {
  const [setStakeWithdraw, { isLoading: isSetStakeWithdrawLoading }] = useSetAutoWithdrawStakeMutation();
  const { data: autoWithdrawData, isLoading } = useGetAutoWithdrawStakeQuery();

  const isStakeWithdrawEnabled = autoWithdrawData?.enabled;
  const autoWithdrawFee = autoWithdrawData?.txFee ? mojoToXxch(autoWithdrawData.txFee).toNumber() : 0;

  const methods = useForm({
    defaultValues: {
      spendStakeFee: autoWithdrawFee,
    },
  });

  async function handleSubmit({ spendStakeFee }: { spendStakeFee: number }) {
    const feeInMojos = xxchToMojo(spendStakeFee);
    await setStakeWithdraw({
      enabled: spendStakeFee > 0,
      txFee: feeInMojos,
      batchSize: 50,
    }).unwrap();

    // hook form does not reset isDirty after submit
    methods.reset({}, { keepValues: true });
  }

  async function disableStakeWithdraw() {
    await setStakeWithdraw({
      enabled: false,
      txFee: 0,
      batchSize: 50,
    }).unwrap();
  }

  if (isLoading) {
    return <Box>'Loading...'</Box>;
  }

  return (
    <Box {...props}>
      <Form methods={methods} onSubmit={handleSubmit}>
        <>
          <Flex gap={2} sx={{ marginTop: 1, alignItems: 'flex-start' }}>
            <Fee
              id="filled-secondary"
              variant="filled"
              name="spendStakeFee"
              color="secondary"
              disabled={isSetStakeWithdrawLoading}
              label={<Trans>Transaction auto withdraw fee</Trans>}
              data-testid="SettingsStakeAutoWithdraw-spendStakeFee"
              fullWidth
              sx={{ width: '300px' }}
            />

            <ButtonLoading
              size="small"
              type="submit"
              variant="contained"
              color="primary"
              loading={isSetStakeWithdrawLoading}
              disabled={!methods.formState.isDirty}
              data-testid="SettingsStakeAutoWithdraw-save"
              sx={{ height: '55px' }}
            >
              {isStakeWithdrawEnabled ? <Trans>Save</Trans> : <Trans>Enable</Trans>}
            </ButtonLoading>

            {isStakeWithdrawEnabled && (
              <ButtonLoading
                size="small"
                loading={isSetStakeWithdrawLoading}
                variant="outlined"
                color="secondary"
                data-testid="SettingsStakeAutoWithdraw-disable"
                onClick={async () => {
                  await disableStakeWithdraw();
                  methods.reset({ spendStakeFee: 0 });
                }}
                sx={{ height: '55px' }}
              >
                <Trans>Disable</Trans>
              </ButtonLoading>
            )}
          </Flex>
          <Box sx={{ marginTop: 3 }} />
          {isStakeWithdrawEnabled && (
            <>
              <Typography component="div" variant="subtitle2" sx={(theme) => ({ color: theme.palette.primary.main })}>
                <ConnectCheckmark
                  sx={(theme) => ({
                    verticalAlign: 'middle',
                    position: 'relative',
                    top: '-5px',
                    left: '-7px',
                    width: '31px',
                    height: '31px',

                    circle: {
                      stroke: theme.palette.primary.main,
                      fill: theme.palette.primary.main,
                    },
                    path: {
                      stroke: theme.palette.primary.main,
                      fill: theme.palette.primary.main,
                    },
                  })}
                />

                <Trans>Auto withdraw is enabled.</Trans>
              </Typography>

              <Box sx={{ marginTop: 2 }}>
                <SettingsText>
                  <Trans>Your wallet is required to be running for auto withdraw to work. </Trans>
                </SettingsText>
                <SettingsText>
                  <Trans>Transactions less than the fee will not be auto withdraw.</Trans>
                </SettingsText>
              </Box>
            </>
          )}
          {!isStakeWithdrawEnabled && (
            <Typography component="div" variant="subtitle2" sx={{ marginTop: 3 }}>
              <Trans>Auto withdraw is disabled. </Trans>
            </Typography>
          )}
        </>
      </Form>
    </Box>
  );
}
