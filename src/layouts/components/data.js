import { TbApps, TbBasket, TbBellRinging, TbCalendar, TbComponents, TbCreditCard, TbFolder, TbHeadset, TbLock, TbLogout2, TbMessageDots, TbSettings2, TbSignRight, TbUserCircle, TbUserHexagon, TbUsers } from 'react-icons/tb';
import { LuCalendar, LuChartNoAxesCombined, LuCircleGauge, LuDessert, LuEarth, LuEyeOff, LuFileInput, LuFingerprint, LuFolderOpenDot, LuHandshake, LuHousePlug, LuInbox, LuKey, LuListTree, LuMapPinned, LuMessageSquareDot, LuNotebookText, LuPanelRightClose, LuPanelTop, LuPencilRuler, LuProportions, LuReceiptText, LuRss, LuShieldAlert, LuShieldBan, LuShoppingBag, LuSparkles, LuTable, LuUsers } from 'react-icons/lu';

export const userDropdownItems = [
  {
    label: 'Snow White Laundry Service Admin',
    isHeader: true
  },
  {
    isDivider: true
  },
  // {
  //   label: 'Sign In',
  //   icon: TbSignRight,
  //   url: '/auth-1/sign-in',
  //   class: 'text-danger fw-semibold'
  // },
  // {
  //   label: 'Log Out',
  //   icon: TbLogout2,
  //   url: '#',
  //   class: 'text-danger fw-semibold'
  // }
];

export const menuItems = [
  {
    key: 'Admin',
    label: 'Admin',
    isTitle: true
  },

  // ✅ Orders moved to top-level (no Dashboards)
  {
    key: 'orders-list',
    label: 'Dashboard',
    icon: LuTable,
    url: '/dashboard'
  },
  // {
  //   key: 'order-details',
  //   label: 'Order Details',
  //   icon: LuNotebookText,
  //   url: '/ticket-details'
  // },

  {
    key: 'Laundry Services',
    label: 'Laundry Services',
    icon: LuShoppingBag,
    url: '/products-grid' 
  },

  {
    key: 'invoice',
    label: 'Invoice',
    icon: LuReceiptText,
    url: '/add-invoice'
  },

  
];

// ✅ Horizontal menu (only orders, no dashboards)
export const horizontalMenuItems = [
  {
    key: 'orders-list',
    label: 'Dashboard',
    icon: LuTable,
    url: '/dashboard'
  },
  {
    key: 'order-details',
    label: 'Order Details',
    icon: LuNotebookText,
    url: '/ticket-details'
  }
];


