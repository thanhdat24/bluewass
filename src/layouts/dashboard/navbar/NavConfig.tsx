// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import SvgIconStyle from "../../../components/SvgIconStyle";

// ----------------------------------------------------------------------

type IconName =
  | "ic_user"
  | "ic_userType"
  | "ic_invoice"
  | "ic_analytics"
  | "ic_billing_period"
  | "ic_permission"
  | "ic_district"
  | "ic_wards"
  | "ic_revenue_routes";

const getIcon = (name: IconName): React.ReactNode => (
  <SvgIconStyle
    src={`/icons/${name}.svg`}
    sx={{ color: "#a3aed1", fill: "#a3aed1", width: 1, height: 1 }}
  />
);

const ICONS = {
  analytics: getIcon("ic_analytics"),
  user: getIcon("ic_user"),
  userType: getIcon("ic_userType"),
  receipt: getIcon("ic_invoice"),
  billing: getIcon("ic_billing_period"),
  permission: getIcon("ic_permission"),
  district: getIcon("ic_district"),
  wards: getIcon("ic_wards"),
  revenueRoutes: getIcon("ic_revenue_routes"),
};

const navConfig = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "Quản lý khách hàng",
    items: [
      // USER
      {
        title: "Khách hàng",
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: "Danh sách", path: PATH_DASHBOARD.user.list },
          // { title: "Tài khoản", path: PATH_DASHBOARD.user.account },
        ],
      },
      // Loại khách hàng
      {
        title: "Loại Khách hàng",
        path: PATH_DASHBOARD.userType.root,
        icon: ICONS.userType,
        children: [{ title: "Danh sách", path: PATH_DASHBOARD.userType.list }],
      },
    ],
  },

  {
    subheader: "Quản lý thông tin sử dụng",
    items: [
      
      // RECEIPT
      {
        title: "Kỳ thu",
        path: PATH_DASHBOARD.billingPeriod.root,
        icon: ICONS.billing,
        children: [
          { title: "Danh sách", path: PATH_DASHBOARD.billingPeriod.list },
        ],
      },
      {
        title: "Phiếu thu",
        path: PATH_DASHBOARD.receipt.root,
        icon: ICONS.receipt,
        children: [{ title: "Danh sách", path: PATH_DASHBOARD.receipt.list }],
      },
    ],
  },

  {
    subheader: "Quản lý danh mục hệ thống",
    items: [
      // RECEIPT
      {
        title: "Nhân viên",
        path: PATH_DASHBOARD.staff.root,
        icon: ICONS.user,
        children: [{ title: "Danh sách", path: PATH_DASHBOARD.staff.list }],
      },
      {
        title: "Tuyến thu",
        path: PATH_DASHBOARD.revenueRoutes.root,
        icon: ICONS.revenueRoutes,
        children: [
          { title: "Danh sách", path: PATH_DASHBOARD.revenueRoutes.list },
        ],
      },
      {
        title: "Quyền",
        path: PATH_DASHBOARD.permission.root,
        icon: ICONS.permission,
        children: [
          { title: "Danh sách", path: PATH_DASHBOARD.permission.list },
        ],
      },
      {
        title: "Quận Huyện",
        path: PATH_DASHBOARD.district.root,
        icon: ICONS.district,
        children: [{ title: "Danh sách", path: PATH_DASHBOARD.district.list }],
      },
      {
        title: "Xã phường",
        path: PATH_DASHBOARD.wards.root,
        icon: ICONS.wards,
        children: [{ title: "Danh sách", path: PATH_DASHBOARD.wards.list }],
      },
    ],
  },

  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "Thống kê báo cáo",
    items: [
      {
        title: "Thống kê",
        path: PATH_DASHBOARD.general.dashboard,
        icon: ICONS.analytics,
        children: [
          {
            title: "Thống kê tổng quan",
            path: PATH_DASHBOARD.general.dashboard,
          },
          {
            title: "Thống kê theo tuyến thu",
            path: PATH_DASHBOARD.general.revenueRoute,
          },
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
];

export default navConfig;
