import { INavData } from '@coreui/angular';

export const navItemsUser: INavData[] = [
  {
    name: 'IDEA',
    url: '/ble',
    icon: 'cil-lightbulb',
    
    children: [
      {
        name: 'Nueva idea',
        url: '/ideas/new-idea',
        icon: 'icon-pencil'
      },
      {
        name: 'Mis ideas',
        url: '/ideas/my-idea',
        icon: 'cil-list'
      },
    ]
  },
  {
    name: 'COCREACIÓN',
    url: '/ideas/view-idea',
    icon: 'icon-puzzle'
  },
  {
    name: 'EQUIPOS',
    url: '/needs/conformation',
    icon: 'fa fa-users',
  },
  {
    name: 'IDEACIÓN',
    url: '/ideation/new-ideation',
    icon: 'icon-puzzle',
  },
  {
    name: 'DISEÑO Y PROT',
    url: '/design/new-activity',
    icon: 'cil-color-palette',
  },
  {
    name: 'MERCADEO',
    url: '/market/marketing',
    icon: 'icon-bag',
  },
];

export const navItemsEnte: INavData[] = [
  {
    name: 'IDEA',
    url: '/ble',
    icon: 'cil-lightbulb',
    
    children: [
      {
        name: 'Nueva idea',
        url: '/ideas/new-idea',
        icon: 'icon-pencil'
      },
      {
        name: 'Mis ideas',
        url: '/ideas/my-idea',
        icon: 'cil-list'
      },
    ]
  },
  {
    name: 'COCREACIÓN',
    url: '/ideas/view-idea',
    icon: 'icon-puzzle'
  },
  {
    name: 'EQUIPOS',
    url: '/needs/conformation',
    icon: 'fa fa-users',
  },
  {
    name: 'NECESIDADES',
    url: '/needs/new-need',
    icon: 'cil-casino',
  },
  {
    name: 'IDEACIÓN',
    url: '/ideation/new-ideation',
    icon: 'icon-puzzle',
  },
  {
    name: 'DISEÑO Y PROT',
    url: '/design/new-activity',
    icon: 'cil-color-palette',
  },
  {
    name: 'MERCADEO',
    url: '/market/marketing',
    icon: 'icon-bag',
  },
  // {
  //   name: 'CAPACIDADES',
  //   url: '/ble',
  //   icon: 'icon-puzzle',
  //   children: [
  //     {
  //       name: 'Agrupación de necesidades',
  //       url: 'theme/typography',
  //       icon: 'icon-pencil'
  //     },
  //   ]
  // },
];

export const navItemsNull: INavData[] = [
  {
    name: 'INICIO',
    url: '/profile',
    icon: 'cil-lightbulb',
  }
];
