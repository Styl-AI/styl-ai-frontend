import {
  IconPlus,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'New Chat',
    icon: IconPlus,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'History',
  },
];

export default Menuitems;
