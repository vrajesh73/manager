import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

export interface CloudViewIntervalSelectProps {
  handleIntervalChange: (interval: string | undefined) => void;
}

export const CloudViewIntervalSelect = React.memo(
  (props: CloudViewIntervalSelectProps) => {
    const intervalOptions: any[] = [
      {
        label: '1 min',
        value: '1m',
      },
      {
        label: '5 min',
        value: '5m',
      },
      {
        label: '2 hrs',
        value: '2h',
      },
      {
        label: '1 day',
        value: '1d',
      },
    ];

    const [selectedInterval, setInterval] = React.useState<string>('1m');

    React.useEffect(() => {
      props.handleIntervalChange(selectedInterval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterval]);

    return (
      <Autocomplete
        onChange={(_: any, timeInterval: any) => {
          setInterval(timeInterval.value);
        }}
        data-testid="interval-select"
        defaultValue={intervalOptions[0]}
        disableClearable
        fullWidth
        isOptionEqualToValue={(option, value) => option.label === value.label}
        label=""
        noMarginTop
        options={intervalOptions}
      />
    );
  }
);
