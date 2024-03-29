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
  Grid,
} from "@mui/material";
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "../../../routes/paths";
import Iconify from "../../../components/Iconify";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  deletePermission,
  getAllPermissions,
} from "../../../redux/slices/permissionReducer";
import useTable, { emptyRows } from "../../../hooks/useTable";
import { PermissionModel } from "../../../interfaces/PermissionModel";
import { TableEmptyRows, TableHeadCustom } from "../../../components/table";
import PermissionTableRow from "./PermissionTableRow";
import PermissionTableToolbar from "./PermissionTableToolbar";
import { CSVLink } from "react-csv";

type Props = {};
const OPTIONS_INFO = ["Tên quyền"];

const TABLE_HEAD = [
  { id: "STT", label: "STT", align: "left" },
  { id: "TENQUYEN", label: "Tên quyền", align: "left" },
  { id: "THAOTAC", label: "Thao tác", align: "right" },
];

export default function PermissionList({}: Props) {
  ////----
  const dispatch = useAppDispatch();

  const { permissionList, deletePermissionSuccess } = useAppSelector(
    (state) => state.permission
  );
  useEffect(() => {
    dispatch(getAllPermissions());
  }, [dispatch, deletePermissionSuccess]);

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
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultDense: false, defaultOrderBy: "name" });

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState("");

  const [filterUser, setFilterUser] = useState("Tên quyền");

  const [tableData, setTableData] = useState<PermissionModel[]>([]);

  const denseHeight = dense ? 60 : 80;

  const dataFiltered = applySortFilter({
    tableData,
    filterName,
    filterUser,
  });

  useEffect(() => {
    if (permissionList && permissionList.length) {
      setTableData(permissionList);
    }
  }, [permissionList ?? []]);

  const handleDeleteRow = (id: number) => {
    dispatch(deletePermission(id));
  };

  const handleEditRow = (id: number) => {
    navigate(PATH_DASHBOARD.permission.edit(id));
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
  ////----

  ///CSV
  const dataCSV = dataFiltered.map((row, index) => ({
    STT: index + 1,
    "ID Quyền": row.IDQUYEN,
    "Tên quyền": row.TENQUYEN,
  }));

  return (
    <Page title="Permission: List">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="Danh sách quyền"
          links={[
            { name: "Trang chủ", href: PATH_DASHBOARD.root },
            { name: "Quyền", href: PATH_DASHBOARD.permission.root },
            { name: "Danh sách" },
          ]}
          action={
            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                sx={{ borderRadius: 2, textTransform: "none" }}
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.permission.new}
                startIcon={<Iconify icon={"eva:plus-fill"} />}
              >
                Thêm quyền
              </Button>
              <Box className="flex items-center leading-[1]">
                <CSVLink filename="Danh_sach_quyen" data={dataCSV}>
                  <Tooltip title="Xuất danh sách">
                    <img
                      src="/icons/ic_excel.png"
                      alt="export excel"
                      className="w-7 h-7 leading-3 block"
                    />
                  </Tooltip>
                </CSVLink>
              </Box>
            </Box>
          }
        />
        <Grid container justifyContent="center" alignItems="center">
          <Card sx={{ maxWidth: 2000 }}>
            <Divider />
            <PermissionTableToolbar
              dataTable={dataCSV}
              filterName={filterName}
              onFilterName={handleFilterName}
              filterUser={filterUser}
              onFilterUser={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleFilterUser(event)}
              optionsInfo={OPTIONS_INFO}
            />
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
                      <PermissionTableRow
                        key={row.IDQUYEN}
                        row={row}
                        index={index}
                        // selected={selected.includes(row.id)}
                        // onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.IDQUYEN)}
                        onEditRow={() => handleEditRow(row.IDQUYEN)}
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
        </Grid>
      </Container>
    </Page>
  );
}

////--------------

interface ApplySortFilterProps {
  tableData: any[];
  filterStatus?: string;
  filterName?: string;
  filterUser?: string;
}

function applySortFilter({
  tableData,
  filterName,
  filterUser,
}: ApplySortFilterProps) {
  if (filterUser === "Tên quyền") {
    if (filterName) {
      const searchTerm = filterName.toLowerCase();
      tableData = tableData.filter((item) =>
        item.TENQUYEN.toLowerCase().includes(searchTerm)
      );
    }
  }
  return tableData;
}
