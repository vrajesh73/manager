import { Theme } from '@mui/material/styles';
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';

import { Divider } from 'src/components/Divider';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import {
  DataSet,
  LineGraph,
  LineGraphProps,
} from 'src/components/LineGraph/LineGraph';
import { Typography } from 'src/components/Typography';

const useStyles = makeStyles()((theme: Theme) => ({
  message: {
    left: '50%',
    position: 'absolute',
    top: '45%',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    '& > span': {
      color: theme.palette.text.primary,
    },
    color: theme.color.headline,
    fontFamily: theme.font.bold,
    fontSize: '1rem',
  },
}));

export interface CloudViewLineGraphProps extends LineGraphProps {
  ariaLabel?: string;
  error?: string;
  gridSize: number;
  legendRows?: any[];
  loading?: boolean;
  subtitle?: string;
  title: string;
}

export const CloudViewLineGraph = React.memo(
  (props: CloudViewLineGraphProps) => {
    const { classes } = useStyles();

    const { ariaLabel, error, loading, subtitle, title, ...rest } = props;

    const message = error // Error state is separate, don't want to put text on top of it
      ? undefined
      : loading // Loading takes precedence over empty data
      ? 'Loading data...'
      : isDataEmpty(props.data)
      ? 'No data to display'
      : undefined;

    return (
      <React.Fragment>
        <Typography
          className={classes.title}
          style={{ marginLeft: '13px', marginTop: '25px' }}
          variant="body1"
        >
          {title}
          {subtitle && (
            <React.Fragment>
              &nbsp;<span>({subtitle})</span>
            </React.Fragment>
          )}
        </Typography>
        <Divider spacingBottom={32} spacingTop={32} />
        <div style={{ position: 'relative' }}>
          {error ? (
            <div style={{ height: props.chartHeight || '300px' }}>
              <ErrorState errorText={error} />
            </div>
          ) : (
            <LineGraph
              {...rest}
              ariaLabel={ariaLabel!}
              legendRows={props.legendRows}
            />
          )}
          {message && <div className={classes.message}>{message}</div>}
        </div>
      </React.Fragment>
    );
  }
);

export const isDataEmpty = (data: DataSet[]) => {
  return data.every(
    (thisSeries) =>
      thisSeries.data.length === 0 ||
      // If we've padded the data, every y value will be null
      thisSeries.data.every((thisPoint) => thisPoint[1] === null)
  );
};
