import PropTypes from "prop-types";
// @mui
import { styled, useTheme } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar } from "@mui/material";
import { HEADER, NAVBAR } from "../../../utils/config";
import cssStyles from "../../../utils/cssStyles";
import useOffSetTop from "../../../hooks/useOffSetTop";
import AccountPopover from "./AccountPopover";
// hooks

type Props = {};

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: "none",
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("lg")]: {
    // height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    // width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,

    // ...(isOffset && {
    //   height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    // }),
    // ...(verticalLayout && {
    width: "100%",
    height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    backgroundColor: theme.palette.background.default,
    // }),
  },
}));

export default function DashboardHeader({}: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT);
  return (
    <RootStyle>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ height: "100%" }}
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <AccountPopover />
      </Stack>
    </RootStyle>
  );
}