import React from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { DynamicApi } from './types';
import { get } from 'lodash';

const DynamicSelect = ({
  onChange,
  title,
  formData,
  uiSchema: { 'ui:options': uiOptions },
}: FieldExtensionComponentProps<string, DynamicApi>) => {
  const [options, setOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        if (!uiOptions?.url) {
          throw new Error('No API available');
        }
        const response = await fetch(uiOptions.url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = (await response.json()) as Object;
        const array = get(data, uiOptions.arrayKey) as Array<{
          [key: string]: string;
        }>;
        setOptions(array.map(item => get(item, uiOptions.key)));
      } catch (_error) {
        setError(_error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uiOptions]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error">Error: {(error as Error).message}</Typography>
    );

  return (
    <FormControl fullWidth>
      <InputLabel id="dynamic-select-label">{title}</InputLabel>
      <Select
        labelId="dynamic-select-label"
        value={formData}
        label="Select a Country"
        onChange={e => {
          console.log('value', e.target?.value);
          onChange((e.target?.value as string) || '');
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DynamicSelect;
