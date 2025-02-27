import { Linode } from '@linode/api-v4/lib/linodes';
import { useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { List } from 'src/components/List';
import { ListItem } from 'src/components/ListItem';
import { Notice } from 'src/components/Notice/Notice';
import { OrderByProps, sortData } from 'src/components/OrderBy';
import Paginate from 'src/components/Paginate';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Paper } from 'src/components/Paper';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';
import { useFlags } from 'src/hooks/useFlags';
import { useOrder } from 'src/hooks/useOrder';

import { PowerActionsDialog } from '../../PowerActionsDialogOrDrawer';
import { SelectLinodeCards } from './SelectLinodeCards';
import { SelectLinodeTable } from './SelectLinodeTable';

interface Props {
  disabled?: boolean;
  error?: string;
  handleSelection: (id: number, type: null | string, diskSize?: number) => void;
  header?: string;
  linodes: Linode[];
  notices?: string[];
  selectedLinodeID?: number;
  showPowerActions?: boolean;
}

export const SelectLinodePanel = (props: Props) => {
  const {
    disabled,
    error,
    handleSelection,
    header,
    linodes,
    notices,
    selectedLinodeID,
    showPowerActions,
  } = props;

  const { handleOrderChange, order, orderBy } = useOrder(
    { order: 'asc', orderBy: 'label' },
    'create-select-linode'
  );

  const orderedLinodes = sortData<Linode>(orderBy, order)(linodes);

  const flags = useFlags();
  const theme = useTheme();
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [userSearchText, setUserSearchText] = React.useState<
    string | undefined
  >(undefined);

  const [powerOffLinode, setPowerOffLinode] = React.useState<
    { linodeId: number } | false
  >(false);

  // Capture the selected linode when this component mounts,
  // so it doesn't change when the user selects a different one.
  const [preselectedLinodeID] = React.useState(
    flags.linodeCloneUiChanges && selectedLinodeID
  );

  const searchText = React.useMemo(
    () =>
      userSearchText !== undefined
        ? userSearchText
        : linodes.find((linode) => linode.id === preselectedLinodeID)?.label ||
          '',
    [linodes, preselectedLinodeID, userSearchText]
  );

  const filteredLinodes = React.useMemo(
    () =>
      orderedLinodes.filter((linode) =>
        linode.label.toLowerCase().includes(searchText.toLowerCase())
      ),
    [orderedLinodes, searchText]
  );

  const SelectComponent =
    matchesMdUp && flags.linodeCloneUiChanges
      ? SelectLinodeTable
      : SelectLinodeCards;

  return (
    <>
      <Paginate data={filteredLinodes}>
        {({
          count,
          data: linodesData,
          handlePageChange,
          handlePageSizeChange,
          page,
          pageSize,
        }) => {
          return (
            <>
              <StyledPaper data-qa-select-linode-panel>
                <Stack gap={0.5} mb={2}>
                  {error && (
                    <Notice
                      spacingBottom={0}
                      spacingTop={0}
                      text={error}
                      variant="error"
                    />
                  )}
                  {notices && !disabled && notices.length > 0 && (
                    <Notice variant="warning">
                      <List
                        sx={(theme) => ({
                          '& > li': {
                            display: 'list-item',
                            lineHeight: theme.spacing(3),
                            padding: 0,
                            pl: 0,
                          },
                          listStyle: 'disc',
                          ml: theme.spacing(2),
                        })}
                      >
                        {notices.map((notice, i) => (
                          <ListItem key={i}>{notice}</ListItem>
                        ))}
                      </List>
                    </Notice>
                  )}
                </Stack>
                <Typography
                  marginBottom={
                    flags.linodeCloneUiChanges ? theme.spacing(2) : undefined
                  }
                  data-qa-select-linode-header
                  variant="h2"
                >
                  {!!header ? header : 'Select Linode'}
                </Typography>
                {flags.linodeCloneUiChanges && (
                  <DebouncedSearchTextField
                    customValue={{
                      onChange: setUserSearchText,
                      value: searchText,
                    }}
                    sx={{
                      marginBottom: theme.spacing(1),
                      width: '330px',
                    }}
                    clearable
                    data-qa-linode-search
                    debounceTime={0}
                    expand={true}
                    hideLabel
                    label=""
                    placeholder="Search"
                  />
                )}
                <StyledBox>
                  <SelectComponent
                    handlePowerOff={(linodeId) =>
                      setPowerOffLinode({ linodeId })
                    }
                    orderBy={{
                      data: linodesData,
                      handleOrderChange,
                      order,
                      orderBy,
                    }}
                    disabled={disabled}
                    handleSelection={handleSelection}
                    selectedLinodeId={selectedLinodeID}
                    showPowerActions={showPowerActions ?? false}
                  />
                </StyledBox>
              </StyledPaper>
              <PaginationFooter
                count={count}
                eventCategory={'Clone from existing panel'}
                handlePageChange={handlePageChange}
                handleSizeChange={handlePageSizeChange}
                page={page}
                pageSize={pageSize}
              />
            </>
          );
        }}
      </Paginate>
      {powerOffLinode && (
        <PowerActionsDialog
          action={'Power Off'}
          isOpen={!!powerOffLinode}
          linodeId={powerOffLinode.linodeId}
          manuallyUpdateConfigs={true}
          onClose={() => setPowerOffLinode(false)}
        />
      )}
    </>
  );
};

export interface RenderLinodeProps {
  disabled?: boolean;
  handlePowerOff: (linodeId: number) => void;
  handleSelection: Props['handleSelection'];
  orderBy: OrderByProps<Linode>;
  selectedLinodeId: number | undefined;
  showPowerActions: boolean;
}

const StyledBox = styled(Box, {
  label: 'StyledBox',
})(({ theme }) => ({
  padding: `${theme.spacing(2)} 0 0`,
}));

const StyledPaper = styled(Paper, { label: 'StyledPaper' })(({ theme }) => ({
  backgroundColor: theme.color.white,
  flexGrow: 1,
  width: '100%',
}));
