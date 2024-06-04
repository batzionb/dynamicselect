import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import DynamicSelect from './DynamicSelect';

export const DynamicSelectExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'DynamicSelect',
    component: DynamicSelect,
  }),
);
