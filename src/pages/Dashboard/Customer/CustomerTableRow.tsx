import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  DialogContent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { TableMoreMenu } from "../../../components/table";
import Iconify from "../../../components/Iconify";
import Label from "../../../components/Label";
import { fDate } from "../../../utils/formatTime";

type Props = {
  row: any;
  onDeleteRow: () => void;
  onEditRow: () => void;
};

export default function CustomerTableRow({
  row,
  onDeleteRow,
  onEditRow,
}: Props) {
  const [openMenu, setOpenMenuActions] = useState<null | HTMLElement>(null); // Add type annotation

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    // Add type annotation
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const {
    IDKHACHHANG,
    HOTEN,
    CMT,
    DIACHI,
    LOAIKH,
    NGAYCAP,
    MAKHACHHANG,
    TUYENTHU,
  } = row;
  return (
    <TableRow hover>
      <TableCell align="left">{IDKHACHHANG}</TableCell>
      <TableCell align="left">{MAKHACHHANG}</TableCell>
      <TableCell align="left">{HOTEN}</TableCell>
      <TableCell align="left">{CMT}</TableCell>
      <TableCell align="left">{fDate(NGAYCAP)}</TableCell>
      <TableCell align="left">{DIACHI}</TableCell>
      <TableCell align="left">
        <Label
          variant={"ghost"}
          color={
            (LOAIKH.TENLOAI === "Hộ dân" && "info") ||
            (LOAIKH.TENLOAI === "Doanh nghiệp" && "error") ||
            "default"
          }
          sx={{ textTransform: "uppercase", mb: 1 }}
        >
          {LOAIKH.TENLOAI}
        </Label>
      </TableCell>
      <TableCell align="left">{TUYENTHU.TENTUYENTHU}</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: "error.main" }}
              >
                <Iconify icon={"eva:trash-2-outline"} />
                Xóa
              </MenuItem>
              <MenuItem onClick={onEditRow}>
                <Iconify icon={"eva:edit-fill"} />
                Chỉnh sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}