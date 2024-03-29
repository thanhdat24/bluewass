import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  alpha,
  Stack,
} from "@mui/material";
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "../../../routes/paths";
import Iconify from "../../../components/Iconify";
import { TableEmptyRows, TableHeadCustom } from "../../../components/table";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  deleteReceipt,
  getAllReceipt,
} from "../../../redux/slices/receiptReducer";
import useTable, { emptyRows, getComparator } from "../../../hooks/useTable";
import { ReceiptModel } from "../../../interfaces/ReceiptModel";
import ReceiptTableRow from "./ReceiptTableRow";
import useTabs from "../../../hooks/useTabs";
import ReceiptTableToolbar from "./ReceiptTableToolbar";
import useToggle from "../../../hooks/useToggle";
import { PDFViewer } from "@react-pdf/renderer";
import ReceiptPDF from "./ReceiptPDF";
import AlertDialog from "../../../components/Dialog";
import {
  cancelReceiptStatus,
  cancelReceiptStatusSuccess,
  getBillingPeriodByCashier,
  getCustomersByCashier,
  resetCasher,
  updateReceiptStatus,
} from "../../../redux/slices/cashierReducer";
import { useForm } from "react-hook-form";
import { fDate, fMonthYear } from "../../../utils/formatTime";
import { formatPriceInVND } from "../../../utils/formatNumber";
import { CustomerModel } from "../../../interfaces/CustomerModel";
import { FormProvider } from "../../../components/hook-form";
import TagFiltered from "../../../components/TagFiltered";
import { CSVLink } from "react-csv";

// ----------------------------------------------------------------------

const OPTIONS_INFO = ["Thông tin khách hàng", "Mã số phiếu"];

const STATUS_OPTIONS = ["Tất cả", "chưa thu", "đã thu"];

const TABLE_HEAD = [
  { id: "MASOPHIEU", label: "Mã số phiếu", align: "left" },
  { id: "NGAYTAO", label: "Ngày tạo", align: "left" },
  { id: "NGAYCAPNHAT", label: "Ngày cập nhật", align: "left" },
  { id: "TRANGTHAIPHIEU", label: "Trạng thái", align: "left" },
  { id: "KYTHU", label: "Kỳ thu", align: "left" },
  { id: "KHACHHANG", label: "Người nộp/nhận", align: "left" },
  { id: "LOAIKH", label: "Loại người nộp/nhận", align: "left" },
  { id: "SOTIEN", label: "Giá trị", align: "left" },
  { id: "TUYENTHU", label: "Tuyến Thu", align: "left" },
  { id: "CONFIRM", label: "Thu phiếu" },
  { id: "ACTION", label: "Thao Tác" },
];


export default function ReceiptList() {
  ///
  const dispatch = useAppDispatch();

  const { toggle: open, onOpen, onClose } = useToggle(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { receiptList, deleteReceiptSuccess } = useAppSelector(
    (state) => state.receipt
  );

  const {
    updateReceiptStatusSuccess,
    billingPeriodByCashierList,
    cancelReceiptStatusSuccess,
  } = useAppSelector((state) => state.cashier);

  const { userLogin } = useAppSelector((state) => state.admin);
  useEffect(() => {
    if (
      userLogin?.USERNAME === "admin" ||
      userLogin?.CHITIETPHANQUYENs.some(
        (item) => item.QUYEN?.TENQUYEN === "Nhân viên quản trị"
      )
    ) {
      dispatch(getAllReceipt());
    } else {
      dispatch(getBillingPeriodByCashier(Number(userLogin?.IDNHANVIEN)));
    }
  }, [
    dispatch,
    deleteReceiptSuccess,
    cancelReceiptStatusSuccess,
    updateReceiptStatusSuccess,
    cancelReceiptStatusSuccess,
  ]);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultDense: false, defaultOrderBy: "name" });

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState("");

  const [filterUser, setFilterUser] = useState("Thông tin khách hàng");

  const [tableData, setTableData] = useState<ReceiptModel[] | CustomerModel[]>(
    []
  );
  const methods = useForm({});

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();
  const onSubmit = () => {};
  const isDefault = values.TUYENTHU?.length === 0 || values.KYTHU?.length === 0;

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs("Tất cả");

  const [viewRow, setViewRow] = useState<ReceiptModel | null>(null);

  const denseHeight = dense ? 60 : 80;

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterStatus,
    filterName,
    filterUser,
    values,
  });

  useEffect(() => {
    if (receiptList && receiptList.length > 0) {
      setTableData(receiptList);
    } else if (
      billingPeriodByCashierList &&
      billingPeriodByCashierList.length > 0
    ) {
      setTableData(billingPeriodByCashierList);
    }
  }, [receiptList ?? [], billingPeriodByCashierList ?? []]);

  const handleDeleteRow = (id: number) => {
    dispatch(deleteReceipt(id));
  };

  const handleCancelRow = async (id: number, row: any) => {
    const rows = {
      IDPHIEU: row.IDPHIEU,
      IDKHACHHANG: row.IDKHACHHANG,
      IDKYTHU: row.IDKYTHU,
      IDNHANVIEN: row.IDNHANVIEN,
      NGAYTAO: row.NGAYTAO,
      NGAYCAPNHAT: row.NGAYCAPNHAT,
      MAUSOPHIEU: row.MAUSOPHIEU,
      KYHIEU: row.KYHIEU,
      TRANGTHAIHUY: true,
    };
    await dispatch(
      cancelReceiptStatus(id, Number(userLogin?.IDNHANVIEN), rows)
    );
  };

  const handleEditRow = (id: number) => {
    navigate(PATH_DASHBOARD.receipt.edit(id));
  };

  const handleViewRow = (row: ReceiptModel) => {
    setViewRow(row);
    onOpen();
  };

  const handleOpenDialog = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmRow = async (id: number) => {
    await dispatch(updateReceiptStatus(id, Number(userLogin?.IDNHANVIEN)));
    setOpenConfirm(false);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterUser = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilterUser(event.target.value);
  };

  const handleRemoveRevenueRoute = (value: any) => {
    const newValue = values.TUYENTHU.filter((item: any) => item !== value);
    setValue("TUYENTHU", newValue);
  };

  const handleRemoveBillPeriod = (value: any) => {
    setValue("KYTHUBATDAU", "");
    setValue("KYTHUKETTHUC", "");
  };

  const handleRemoveActive = (value: any) => {
    const newValue = values.TRANGTHAI.filter((item: any) => item !== value);
    setValue("TRANGTHAI", newValue);
  };

  const handleResetFilter = () => {
    reset();
  };

  const dataCSV = dataFiltered.map((row, index) => ({
    STT: index + 1,
    "Mã số phiếu": row.MASOPHIEU,
    "Mẫu số phiếu": row.MAUSOPHIEU,
    "Ký hiệu": row.KYHIEU,
    "Ngày tạo phiếu": row.NGAYTAO ?? "",
    "Trạng thái phiếu": row.TRANGTHAIPHIEU ? "Đã thu" : "Chưa thu",
    "Kỳ thu": fMonthYear(row.KYTHU.TENKYTHU),
    "Khách hàng": row.KHACHHANG.HOTEN,
    "Loại khách hàng": row.KHACHHANG.LOAIKH.TENLOAI,
    "Giá trị": formatPriceInVND(row.CHITIETPHIEUTHUs[0]?.SOTIEN),
    "Người tạo phiếu": row.NHANVIEN.HOTEN,
    "Người thu phiếu": row.NGUOITHU,
    "Người cập nhật": row.NGUOICAPNHAT,
    "Ngày cập nhật": fDate(row.NGAYCAPNHAT) ?? "",
  }));

  useEffect(() => {
    if (updateReceiptStatusSuccess || cancelReceiptStatusSuccess) {
      dispatch(resetCasher());
    }
  }, [updateReceiptStatusSuccess, cancelReceiptStatusSuccess]);

  return (
    <Page title="Receipt: List">
      <HeaderBreadcrumbs
        heading="Danh sách phiếu thu"
        links={[
          { name: "Trang chủ", href: PATH_DASHBOARD.root },
          { name: "Phiếu thu", href: PATH_DASHBOARD.receipt.root },
          { name: "Danh sách" },
        ]}
        action={
          <Box className="flex items-center leading-[1]">
            <CSVLink filename="Danh_sach_phieu_thu" data={dataCSV}>
              <Tooltip title="Excel Export">
                <img
                  src="/icons/ic_excel.png"
                  alt="export excel"
                  className="w-7 h-7 leading-3 block"
                />
              </Tooltip>
            </CSVLink>
          </Box>
        }
      />
      <Card>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={filterStatus}
          onChange={onChangeFilterStatus}
          sx={{ px: 2, bgcolor: "background.neutral" }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab disableRipple key={tab} label={tab} value={tab} />
          ))}
        </Tabs>
        <Divider />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <ReceiptTableToolbar
            optionRevenueRoute={tableData}
            dataTable={dataCSV}
            filterName={filterName}
            onFilterName={handleFilterName}
            filterUser={filterUser}
            onFilterUser={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => handleFilterUser(event)}
            optionsInfo={OPTIONS_INFO}
          />
        </FormProvider>
        {(values.TUYENTHU?.length > 0 ||
          values.KYTHU?.length > 0 ||
          values.KYTHUBATDAU ||
          values.KYTHUKETTHUC) && (
          <Stack spacing={2} direction={{ md: "column" }} sx={{ py: 0, px: 3 }}>
            <Box>
              <strong>{dataFiltered.length}</strong>
              <span className="ml-1 !text-[#637381]">Kết quả tìm thấy</span>
            </Box>
            <TagFiltered
              filters={values}
              onRemoveRevenueRoute={handleRemoveRevenueRoute}
              onRemoveBillPeriod={handleRemoveBillPeriod}
              isShowReset={!isDefault}
              onResetAll={handleResetFilter}
              onRemoveActive={handleRemoveActive}
            />
          </Stack>
        )}
        {/* <Scrollbar> */}
        <TableContainer sx={{ minWidth: 800, position: "relative" }}>
          <Table size={dense ? "small" : "medium"}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => (
                  <ReceiptTableRow
                    key={index}
                    row={row}
                    onCancelRow={() => handleCancelRow(row.IDPHIEU, row)}
                    onDeleteRow={() => handleDeleteRow(row.IDPHIEU)}
                    onEditRow={() => handleEditRow(row.IDPHIEU)}
                    onViewRow={() => handleViewRow(row)}
                    onConfirmRow={() => handleOpenDialog(row.IDPHIEU)}
                  />
                ))}
              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />
              {/* <TableNoData isNotFound={isNotFound} /> */}
            </TableBody>
          </Table>
        </TableContainer>{" "}
        <Box sx={{ position: "relative" }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered?.length ?? 0}
            rowsPerPage={rowsPerPage ?? 5}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
        {/* </Scrollbar> */}
      </Card>

      <Dialog fullScreen open={open}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: "12px !important",
              boxShadow: `0 8px 16px 0 ${alpha("#919EAB", 0.16)}`,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={"eva:close-fill"} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
              <ReceiptPDF receipt={viewRow} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
      <AlertDialog
        open={openConfirm}
        title={"Xác nhận thu phiếu này?"}
        onConfirm={() => {
          if (selectedId !== null) {
            handleConfirmRow(selectedId);
          }
        }}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      />
    </Page>
  );
}

// ----------------------------------------------------------------------

interface ApplySortFilterProps {
  tableData: any[];
  comparator: (a: any, b: any) => number;
  filterStatus?: string | boolean;
  filterName?: string;
  filterUser?: string;
  values?: any;
}

function applySortFilter({
  tableData,
  comparator,
  filterStatus,
  filterName,
  filterUser,
  values,
}: ApplySortFilterProps) {
  if (filterStatus === "chưa thu") {
    filterStatus = false;
  } else if (filterStatus === "đã thu") {
    filterStatus = true;
  }

  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStatus !== "Tất cả") {
    tableData = tableData.filter(
      (item) => item.TRANGTHAIPHIEU === filterStatus
    );
  }
  if (filterUser === "Mã số phiếu") {
    if (filterName) {
      const searchTerm = filterName.toLowerCase();
      tableData = tableData.filter((item) =>
        item.MAUSOPHIEU.toLowerCase().includes(searchTerm)
      );
    }
  }

  if (filterUser === "Thông tin khách hàng") {
    if (filterName) {
      const searchTerm = filterName.toLowerCase();
      tableData = tableData.filter(
        (item) =>
          item.KHACHHANG.HOTEN.toLowerCase().includes(searchTerm) ||
          item.KHACHHANG.MAKHACHHANG.toLowerCase().includes(searchTerm) ||
          item.KHACHHANG.CMT.includes(searchTerm)
      );
    }
  }

  if (values.TUYENTHU?.length > 0) {
    tableData = tableData.filter((TT) =>
      values.TUYENTHU.includes(TT.KHACHHANG.TUYENTHU.TENTUYENTHU)
    );
  }

  // if (values.KYTHU?.length > 0) {
  //   tableData = tableData.filter((TT) =>
  //     values.KYTHU.includes(TT.KYTHU.TENKYTHU)
  //   );
  // }
  if (values.KYTHUBATDAU && !values.KYTHUKETTHUC) {
    tableData = tableData.filter((TT) => {
      const startDate = fMonthYear(values.KYTHUBATDAU);

      const kyThuTen = fMonthYear(TT.KYTHU.TENKYTHU);

      return startDate === kyThuTen;
    });
  }
  if (values.KYTHUBATDAU && values.KYTHUKETTHUC) {
    tableData = tableData.filter((TT) => {
      const startDate = fMonthYear(values.KYTHUBATDAU);
      const endDate = fMonthYear(values.KYTHUKETTHUC);

      const kyThuTen = fMonthYear(TT.KYTHU.TENKYTHU);

      return kyThuTen >= startDate && kyThuTen <= endDate;
    });
  }

  return tableData;
}
