import React from 'react'

import {
  MdHome,
  MdInventory,
  MdLocalCafe,
  MdPointOfSale,
  MdSwapHoriz,
} from 'react-icons/md'

// We will use standard React Icons for the sidebar

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Green Inventory',
    layout: '/admin',
    path: 'green-inventory',
    icon: <MdInventory className="h-6 w-6" />,
  },
  {
    name: 'Roasting',
    layout: '/admin',
    path: 'roasting',
    icon: <MdLocalCafe className="h-6 w-6" />,
  },
  {
    name: 'Roasted Inventory',
    layout: '/admin',
    path: 'roasted-inventory',
    icon: <MdInventory className="h-6 w-6" />,
  },
  {
    name: 'Sales',
    layout: '/admin',
    path: 'sales',
    icon: <MdPointOfSale className="h-6 w-6" />,
  },
  {
    name: 'Movements',
    layout: '/admin',
    path: 'movements',
    icon: <MdSwapHoriz className="h-6 w-6" />,
  },
]

export default routes
