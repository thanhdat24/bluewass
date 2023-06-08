import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Iconify from "./Iconify";
import { IconButton } from "@mui/material";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onConfirm,
  onClose,
  title,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}{" "}
          <IconButton color="warning">
            <Iconify icon={"eva:alert-circle-outline"} />{" "}
          </IconButton>
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button sx={{ fontSize: 13 }} onClick={onClose} variant="outlined">
            Hủy bỏ
          </Button>
          <Button
            sx={{ fontSize: 13 }}
            onClick={onConfirm}
            autoFocus
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;