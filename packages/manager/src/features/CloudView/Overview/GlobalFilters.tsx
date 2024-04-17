/* eslint-disable no-console */
import { Dashboard } from '@linode/api-v4';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { WithStartAndEnd } from 'src/features/Longview/request.types';

import { CloudViewDashboardSelect } from '../shared/dashboardSelect';
import { CloudViewIntervalSelect } from '../shared/IntervalSelect';
import { CloudViewRegionSelect } from '../shared/RegionSelect';
import { CloudViewResourceSelect } from '../shared/ResourceSelect';
// import { CloudViewResourceSelectCopy } from '../shared/ResourceSelectCopy';
import { CloudViewServiceSelect } from '../shared/ServicetypeSelect';
import { CloudViewTimeRangeSelect } from '../shared/TimeRangeSelect';
// import { useCloudViewDashboardsQuery } from 'src/queries/cloudview/dashboards';// remove

export const GlobalFilters = React.memo(() => {
  // const { data, error, isLoading } = useCloudViewDashboardsQuery();// remove
  // console.log('dashboards data', data, isLoading, error);// remove
  const theme = useTheme();

  const [time, setTimeBox] = React.useState<WithStartAndEnd>({
    end: 0,
    start: 0,
  });

  const [selectedInterval, setInterval] = React.useState<string>();

  const [selectedRegion, setRegion] = React.useState<string>();

  const [selectedResource, setResource] = React.useState<any>();

  const [selectedDashboard, setDashboard] = React.useState<
    Dashboard | undefined
  >();

  const [selectedService, setService] = React.useState<string | undefined>();

  const handleTimeRangeChange = (start: number, end: number) => {
    // console.log('TimeRange: ', start, end);
    setTimeBox({ end, start });
  };

  const handleIntervalChange = (interval: string | undefined) => {
    // console.log('Interval: ', interval);
    setInterval(interval);
  };

  const handleRegionChange = (region: string | undefined) => {
    // console.log('Region: ', region);
    setRegion(region);
  };

  const handleResourceChange = (resource: any) => {
    // console.log('Resource ID: ', resourceId);
    // console.log("resource",resource);
    setResource(resource);
  };

  const handleServiceChange = (service: string) => {
    // console.log('Service Type: ', service);
    setService(service);
  };

  const handleDashboardChange = (dashboard: Dashboard | undefined) => {
    console.log('Selected Dashboard: ', dashboard);
    setDashboard(dashboard);
    setService(dashboard?.service_type);
  };

  return (
    <Grid container sx={{ ...itemSpacing, padding: '8px' }}>
      <StyledGrid xs={12}>
        <Grid sx={{ width: 300 }}>
          <CloudViewDashboardSelect
            handleDashboardChange={handleDashboardChange}
          />
        </Grid>
        <Grid sx={{ marginLeft: 10, width: 250 }}>
          <StyledCloudViewRegionSelect
            handleRegionChange={handleRegionChange}
          />
        </Grid>
        {/* <Grid sx={{ marginLeft: 0.2, width: 100 }}>
          <CloudViewServiceSelect handleServiceChange={handleServiceChange} />
        </Grid> */}
        {/* <Grid sx={{ marginLeft: 3, width: 200 }}>
          <StyledCloudViewResourceSelect
            disabled={!selectedService}
            handleResourceChange={handleResourceChange}
            region={selectedRegion}
            resourceType={selectedService}
          />
        </Grid> */}
        <Grid sx={{ marginLeft: 20, width: 200 }}>
          <CloudViewResourceSelect
            disabled={!selectedService}
            handleResourceChange={handleResourceChange}
            region={selectedRegion}
            resourceType={selectedService}
          />
        </Grid>
        {/* <Grid sx={{ marginLeft: 8 }}>
          <StyledCloudViewIntervalSelect
            handleIntervalChange={handleIntervalChange}
          />
        </Grid> */}
        <Grid sx={{ marginLeft: 10 }}>
          <StyledCloudViewTimeRangeSelect
            defaultValue={'Past 30 Minutes'}
            handleStatsChange={handleTimeRangeChange}
            hideLabel
            label="Select Time Range"
          />
        </Grid>
      </StyledGrid>
    </Grid>
  );
});

const StyledCloudViewRegionSelect = styled(CloudViewRegionSelect, {
  label: 'StyledCloudViewRegionSelect',
})({
  width: 100,
});

const StyledCloudViewResourceSelect = styled(CloudViewResourceSelect, {
  label: 'StyledCloudViewResourceSelect',
})({
  width: 100,
});

const StyledCloudViewTimeRangeSelect = styled(CloudViewTimeRangeSelect, {
  label: 'StyledCloudViewTimeRangeSelect',
})({
  width: 150,
});

const StyledCloudViewIntervalSelect = styled(CloudViewIntervalSelect, {
  label: 'StyledCloudViewIntervalSelect',
})({
  width: 40,
});

const StyledGrid = styled(Grid, { label: 'StyledGrid' })(({ theme }) => ({
  alignItems: 'end',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  marginBottom: theme.spacing(1.25),
}));

const itemSpacing = {
  boxSizing: 'border-box',
  margin: '0',
};
