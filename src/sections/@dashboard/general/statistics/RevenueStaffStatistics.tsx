import { useState, useEffect } from "react";
// @mui
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Stack,
  CardHeader,
  Tooltip,
} from "@mui/material";
import { FormProvider } from "../../../../components/hook-form";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import useTable, { emptyRows } from "../../../../hooks/useTable";
import { useForm } from "react-hook-form";
import { TableEmptyRows, TableHeadCustom, TableNoData } from "../../../../components/table";
import RevenueStatisticsToolbar from "./RevenueStatisticsToolbar";
import TagFiltered from "../../../../components/TagFiltered";
import { getAllRevenueRoutes } from "../../../../redux/slices/revenueRoutesReducer";
import { getAllStaff } from "../../../../redux/slices/staffReducer";
import RevenueStatisticsTable from "./RevenueStatisticsTable";
import {
  filterStaffStatistics,
  filterStatistics,
} from "../../../../redux/slices/statisticsReducer";
import { StatisticsModel } from "../../../../interfaces/StatisticsModel";
import { fMonthYear } from "../../../../utils/formatTime";
import { formatPriceInVND } from "../../../../utils/formatNumber";
import { CSVLink } from "react-csv";

const TABLE_HEAD = [
  { id: "STT", label: "STT", align: "left" },
  { id: "TENKYTHU", label: "Kỳ thu", align: "left" },
  { id: "NHANVIENTHU", label: "Nhân viên thu", align: "left" },
  { id: "TUYENTHU", label: "Tuyến thu", align: "left" },
  { id: "SOLUONGTONG", label: "Số lượng thu", align: "left" },
  { id: "SOLUONGYHU", label: "Số lượng đã thu", align: "left" },
  { id: "SOLUONGCHUATHU", label: "Số lượng tồn kho", align: "left" },
  { id: "SOLUONGHUY", label: "Số lượng phiếu hủy", align: "left" },
  { id: "TONGTIEN", label: "Tổng tiền đã thu", align: "left" },
  //   { id: "PHANTRANDATHU", label: "Tỉ lệ đã thu", align: "left" },
  //   { id: "PHANTRAMCHUATHU", label: "Tỉ lệ chưa thu", align: "left" },
];

export default function RevenueStaffStatistics() {
  ///
  const dispatch = useAppDispatch();

  const { revenueRoutesList } = useAppSelector((state) => state.revenueRoutes);

  const { filterStaffStatisticList } = useAppSelector(
    (state) => state.statistic
  );
  const { staffList } = useAppSelector((state) => state.staff);

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

  const [tableData, setTableData] = useState<StatisticsModel[]>([]);
  const methods = useForm({});

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();
  const onSubmit = () => {};
  const isDefault =
    values.KYTHU === undefined ||
    values.TUYENTHUTK === undefined ||
    values.NGAYTHUBATDAU === "" ||
    values.NGAYTHUKETTHUC === "" ||
    values.QUANHUYEN === "" ||
    values.XAPHUONG === "";

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !tableData.length;

  const handleResetFilter = () => {
    reset();
    setValue("TUYENTHUTK", "");
  };

  const handleRemoveRevenueRoute = () => {
    setValue("TUYENTHUTK", "");
  };
  const handleRemoveDay = () => {
    setValue("NGAYTHUBATDAU", undefined);
    setValue("NGAYTHUKETTHUC", undefined);
  };
  const handleRemoveMonth = () => {
    setValue("KYTHU", "");
  };
  const handleRemoveActiveBill = () => {
    setValue("TRANGTHAIPHIEU", "");
  };

  const handleRemoveBillPeriod = () => {
    setValue("KYTHUBATDAU", "");
    setValue("KYTHUKETTHUC", "");
  };

  //   useEffect(() => {
  //     dispatch(getAllRevenueRoutes());
  //     dispatch(getAllStaff());
  //   }, [dispatch]);

  let filterValue = {
    NGAYBATDAU: "",
    NGAYKETTHUC: "",
    IDQUAN: 0,
    IDXA: 0,
    IDTUYEN: 0,
    TENKYTHU: null,
  };
  useEffect(() => {
    if (values.NGAYTHUBATDAU) {
      filterValue = { ...filterValue, NGAYBATDAU: values.NGAYTHUBATDAU };
    }
    if (values.NGAYTHUKETTHUC) {
      filterValue = { ...filterValue, NGAYKETTHUC: values.NGAYTHUKETTHUC };
    }
    if (values.TUYENTHUTK) {
      filterValue = {
        ...filterValue,
        IDTUYEN: JSON.parse(values.TUYENTHUTK).idtuyenthu,
      };
    }
    if (values.KYTHU) {
      filterValue = {
        ...filterValue,
        TENKYTHU: values.KYTHU,
      };
    }
    dispatch(filterStaffStatistics(filterValue));
  }, [
    values.NGAYTHUBATDAU,
    values.NGAYTHUKETTHUC,
    values.TUYENTHUTK,
    values.KYTHU,
  ]);

  useEffect(() => {
    if (filterStaffStatisticList) {
      setTableData(filterStaffStatisticList);
    }
  }, [filterStaffStatisticList ?? []]);

  const dataCSV = tableData.map((row, index) => ({
    STT: index + 1,
    "Nhân viên thu": row.nhanvienthu,
    "Kỳ thu": fMonthYear(row.tenkythu),
    "Tuyến thu": row.tentuyenthu,
    "Số lượng": row.soluongtong,
    "Số lượng đã thu": row.soluongdathu,
    "Số lượng tồn kho": row.soluongchuathu,
    "Số lượng phiếu hủy": row.soluongphieuhuy,
    "Tổng tiền đã thu": formatPriceInVND(row.tongtien),
    "Tỉ lệ đã thu": row.phantramdathu + "%",
  }));

  return (
    <Card>
      <CardHeader
        sx={{ ".MuiCardHeader-title": { fontSize: "25px " } }}
        action={
          <Box className="flex items-center leading-[1]">
            <CSVLink filename="Danh_sach_thong_ke_tinh_hinh_thu" data={dataCSV}>
              <Tooltip title="Xuất danh sách">
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RevenueStatisticsToolbar
          setValue={setValue}
          values={values}
          optionRevenueRoute={revenueRoutesList}
          optionStaff={
            staffList
              ?.filter((option) => option.HOTEN !== "Admin")
              ?.map((option) => option.HOTEN) || []
          }
        />
      </FormProvider>
      {(values.TUYENTHUTK ||
        values.KYTHU?.length > 0 ||
        values.NHANVIENTHU?.length > 0 ||
        values.TRANGTHAIPHIEU?.length > 0 ||
        values.NGAYTHUBATDAU ||
        values.NGAYTHUKETTHUC ||
        values.QUANHUYEN ||
        values.XAPHUONG) && (
        <Stack spacing={2} direction={{ md: "column" }} sx={{ py: 0, px: 3 }}>
          <Box>
            <strong>{tableData.length}</strong>
            <span className="ml-1 !text-[#637381]">Kết quả tìm thấy</span>
          </Box>
          <TagFiltered
            filters={values}
            onRemoveRevenueRoute={handleRemoveRevenueRoute}
            onRemoveBillPeriod={handleRemoveBillPeriod}
            isShowReset={!isDefault}
            onResetAll={handleResetFilter}
            onRemoveDay={handleRemoveDay}
            onRemoveMonth={handleRemoveMonth}
            onRemoveActiveBill={handleRemoveActiveBill}
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
            {tableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: number) => (
                <RevenueStatisticsTable
                  key={index}
                  row={row}
                  index={index}
                  isStaffStatistic={true}
                />
              ))}
            <TableEmptyRows
              height={denseHeight}
              emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
            />
            <TableNoData isNotFound={isNotFound} />
          </TableBody>
        </Table>
      </TableContainer>{" "}
      <Box sx={{ position: "relative" }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData?.length ?? 0}
          rowsPerPage={rowsPerPage ?? 5}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>
      {/* </Scrollbar> */}
    </Card>
  );
}
