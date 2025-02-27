import Grid from '@mui/material/Unstable_Grid2';
import countryData, { Region } from 'country-region-data';
import { useFormik } from 'formik';
import { pathOr } from 'ramda';
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import EnhancedSelect, { Item } from 'src/components/EnhancedSelect/Select';
import { Notice } from 'src/components/Notice/Notice';
import { TextField } from 'src/components/TextField';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { useRestrictedGlobalGrantCheck } from 'src/hooks/useRestrictedGlobalGrantCheck';
import { useAccount, useMutateAccount } from 'src/queries/account';
import { useNotificationsQuery } from 'src/queries/accountNotifications';
import { useProfile } from 'src/queries/profile';
import { getErrorMap } from 'src/utilities/errorUtils';

import { Country } from './types';

interface Props {
  focusEmail: boolean;
  onClose: () => void;
}

const excludedUSRegions = ['Micronesia', 'Marshall Islands', 'Palau'];

const UpdateContactInformationForm = ({ focusEmail, onClose }: Props) => {
  const { data: account } = useAccount();
  const { error, isLoading, mutateAsync } = useMutateAccount();
  const { data: notifications, refetch } = useNotificationsQuery();
  const { classes } = useStyles();
  const emailRef = React.useRef<HTMLInputElement>();
  const { data: profile } = useProfile();
  const isChildUser = profile?.user_type === 'child';
  const isParentUser = profile?.user_type === 'parent';
  const isReadOnly =
    useRestrictedGlobalGrantCheck({
      globalGrantType: 'account_access',
      permittedGrantLevel: 'read_write',
    }) || isChildUser;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address_1: account?.address_1,
      address_2: account?.address_2,
      city: account?.city,
      company: account?.company,
      country: account?.country,
      email: account?.email,
      first_name: account?.first_name,
      last_name: account?.last_name,
      phone: account?.phone,
      state: account?.state,
      tax_id: account?.tax_id,
      zip: account?.zip,
    },
    async onSubmit(values) {
      await mutateAsync(values);

      // If there's a "billing_email_bounce" notification on the account, and
      // the user has just updated their email, re-request notifications to
      // potentially clear the email bounce notification.
      const hasBillingEmailBounceNotification = notifications?.find(
        (notification) => notification.type === 'billing_email_bounce'
      );

      if (hasBillingEmailBounceNotification) {
        refetch();
      }
      onClose();
    },
  });

  React.useEffect(() => {
    if (focusEmail && emailRef.current) {
      emailRef.current.focus();
      emailRef.current.scrollIntoView();
    }
  }, []);

  const errorMap = getErrorMap(
    [
      'address_1',
      'address_2',
      'city',
      'country',
      'company',
      'email',
      'first_name',
      'last_name',
      'phone',
      'state',
      'tax_id',
      'zip',
    ],
    error
  );

  const generalError = errorMap.none;

  const countryResults: Item<string>[] = countryData.map((country: Country) => {
    return {
      label: country.countryName,
      value: country.countryShortCode,
    };
  });

  const currentCountryResult = countryData.filter((country: Country) =>
    formik.values.country
      ? country.countryShortCode === formik.values.country
      : country.countryShortCode === account?.country
  );

  const countryRegions: Region[] = pathOr(
    [],
    ['0', 'regions'],
    currentCountryResult
  );

  const regionResults = countryRegions.map((region) => {
    if (formik.values.country === 'US' && region.name === 'Virgin Islands') {
      return {
        label: 'Virgin Islands, U.S.',
        value: region.shortCode,
      };
    }

    return {
      label: region.name,
      value: region.shortCode,
    };
  });

  let filteredRegionResults;

  if (formik.values.country === 'US') {
    filteredRegionResults = regionResults.filter(
      (region) => !excludedUSRegions.includes(region.label)
    );

    filteredRegionResults.push({
      label: 'United States Minor Outlying Islands',
      value: 'UM',
    });
  } else {
    filteredRegionResults = regionResults;
  }

  // Prevent edge case field error for "Company Name" when updating billing info
  // for accounts that did not initially require an address.
  if (formik.values.company === null) {
    formik.setFieldValue('company', '');
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        className={classes.mainFormContainer}
        columnSpacing={2}
        container
        data-qa-update-contact
        spacing={0}
      >
        {isReadOnly && (
          <Grid xs={12}>
            <Notice
              text={getRestrictedResourceText({
                isChildUser,
                resourceType: 'Account',
              })}
              variant="error"
            />
          </Grid>
        )}
        {generalError && (
          <Grid xs={12}>
            <Notice text={generalError} variant="error" />
          </Grid>
        )}
        <Grid xs={12}>
          <TextField
            data-qa-contact-email
            disabled={isReadOnly}
            errorText={errorMap.email}
            helperTextPosition="top"
            inputRef={emailRef}
            label="Email"
            name="email"
            onChange={formik.handleChange}
            required
            trimmed
            type="email"
            value={formik.values.email}
          />
        </Grid>
        <Grid sm={6} xs={12}>
          <TextField
            data-qa-contact-first-name
            disabled={isReadOnly}
            errorText={errorMap.first_name}
            label="First Name"
            name="first_name"
            onChange={formik.handleChange}
            value={formik.values.first_name}
          />
        </Grid>
        <Grid sm={6} xs={12}>
          <TextField
            data-qa-contact-last-name
            disabled={isReadOnly}
            errorText={errorMap.last_name}
            label="Last Name"
            name="last_name"
            onChange={formik.handleChange}
            value={formik.values.last_name}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            data-qa-company
            disabled={isReadOnly || isParentUser}
            errorText={errorMap.company}
            label="Company Name"
            name="company"
            onChange={formik.handleChange}
            value={formik.values.company}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            data-qa-contact-address-1
            disabled={isReadOnly}
            errorText={errorMap.address_1}
            label="Address"
            name="address_1"
            onChange={formik.handleChange}
            value={formik.values.address_1}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            data-qa-contact-address-2
            disabled={isReadOnly}
            errorText={errorMap.address_2}
            label="Address 2"
            name="address_2"
            onChange={formik.handleChange}
            value={formik.values.address_2}
          />
        </Grid>

        <Grid sm={6} xs={12}>
          <EnhancedSelect
            textFieldProps={{
              dataAttrs: {
                'data-qa-contact-country': true,
              },
            }}
            value={countryResults.find(
              ({ value }) => value === formik.values.country
            )}
            disabled={isReadOnly}
            errorText={errorMap.country}
            isClearable={false}
            label="Country"
            onChange={(item) => formik.setFieldValue('country', item.value)}
            options={countryResults}
            placeholder="Select a Country"
            required
          />
        </Grid>
        <Grid sm={6} xs={12}>
          {formik.values.country === 'US' || formik.values.country == 'CA' ? (
            <EnhancedSelect
              placeholder={
                formik.values.country === 'US'
                  ? 'Enter state'
                  : 'Enter province'
              }
              textFieldProps={{
                dataAttrs: {
                  'data-qa-contact-state-province': true,
                },
              }}
              value={
                filteredRegionResults.find(
                  ({ value }) => value === formik.values.state
                ) ?? null
              }
              disabled={isReadOnly}
              errorText={errorMap.state}
              isClearable={false}
              label={`${formik.values.country === 'US' ? 'State' : 'Province'}`}
              onChange={(item) => formik.setFieldValue('state', item.value)}
              options={filteredRegionResults}
              required
            />
          ) : (
            <TextField
              data-qa-contact-state-province
              disabled={isReadOnly}
              errorText={errorMap.state}
              label="State / Province"
              name="state"
              onChange={formik.handleChange}
              placeholder="Enter region"
              required
              value={formik.values.state}
            />
          )}
        </Grid>
        <Grid sm={6} xs={12}>
          <TextField
            data-qa-contact-city
            disabled={isReadOnly}
            errorText={errorMap.city}
            label="City"
            name="city"
            onChange={formik.handleChange}
            value={formik.values.city}
          />
        </Grid>
        <Grid sm={6} xs={12}>
          <TextField
            data-qa-contact-post-code
            disabled={isReadOnly}
            errorText={errorMap.zip}
            label="Postal Code"
            name="zip"
            onChange={formik.handleChange}
            value={formik.values.zip}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            data-qa-contact-phone
            disabled={isReadOnly}
            errorText={errorMap.phone}
            label="Phone"
            name="phone"
            onChange={formik.handleChange}
            type="tel"
            value={formik.values.phone}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            data-qa-contact-tax-id
            disabled={isReadOnly}
            errorText={errorMap.tax_id}
            label="Tax ID"
            name="tax_id"
            onChange={formik.handleChange}
            value={formik.values.tax_id}
          />
        </Grid>
      </Grid>
      <ActionsPanel
        primaryButtonProps={{
          'data-testid': 'save-contact-info',
          disabled: isReadOnly,
          label: 'Save Changes',
          loading: isLoading,
          type: 'submit',
        }}
        secondaryButtonProps={{
          'data-testid': 'reset-contact-info',
          label: 'Cancel',
          onClick: onClose,
        }}
        className={classes.actions}
      />
    </form>
  );
};

const useStyles = makeStyles()({
  actions: {
    '& button': {
      marginBottom: 0,
    },
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  mainFormContainer: {
    '& .MuiGrid-item:not(:first-of-type) label': {
      marginTop: 0,
    },
    maxWidth: 860,
  },
});

export default UpdateContactInformationForm;
