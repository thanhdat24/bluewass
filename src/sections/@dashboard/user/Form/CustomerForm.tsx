import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  TextField,
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import dayjs, { Dayjs } from "dayjs";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import RHFSelect from "../../../../components/hook-form/RHFSelect";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store";
import axios from "../../../../utils/axios";
import { getAllCustomerTypes } from "../../../../redux/slices/customerTypeReducer";
import {
  createCustomer,
  resetCustomer,
  updateCustomer,
} from "../../../../redux/slices/customerReducer";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { getAllRevenueRoutes } from "../../../../redux/slices/revenueRoutesReducer";
import { CustomerModel } from "../../../../interfaces/CustomerModel";

type Props = {
  isEdit: boolean;
  currentCustomer: CustomerModel | undefined;
};

export default function CustomerForm({ isEdit, currentCustomer }: Props) {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { createCustomerSuccess, updateCustomerSuccess } = useAppSelector(
    (state) => state.customer
  );

  ///

  const [checked, setChecked] = useState(currentCustomer?.TRANGTHAI || false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  ///

  useEffect(() => {
    dispatch(getAllCustomerTypes());
    dispatch(getAllRevenueRoutes());
  }, [dispatch]);

  const { revenueRoutesList } = useAppSelector(
    (state: RootState) => state.revenueRoutes
  );
  const { customerTypeList } = useAppSelector(
    (state: RootState) => state.customerType
  );

  const [data, setData] = useState({
    setWard: currentCustomer?.TUYENTHU.XAPHUONG.TENXAPHUONG || "",
    setDistrict:
      currentCustomer?.TUYENTHU.XAPHUONG.QUANHUYEN.TENQUANHUYEN || "",
    setIDXAPHUONG: currentCustomer?.TUYENTHU.XAPHUONG.IDXAPHUONG || "",
  });

  const handleSelectrevenueRoutes = async (selectedValue: number) => {
    try {
      const response = await axios.get(`api/TUYENTHUs/${selectedValue}`);
      setData({
        ...data,
        setDistrict: response.data.XAPHUONG.QUANHUYEN.TENQUANHUYEN,
        setWard: response.data.XAPHUONG.TENXAPHUONG,
        setIDXAPHUONG: response.data.XAPHUONG.IDXAPHUONG,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const NewUserSchema = Yup.object().shape({
    MAKHACHHANG: Yup.string()
      .required("Mã khách hàng là bắt buộc")
      .matches(/^\S+$/, "Không được chứa khoảng trống")
      .min(4, "Phải có ít nhất 4 ký tự"),
    HOTEN: Yup.string()
      .required("Họ tên là bắt buộc")
      .matches(/^[a-zA-Z\sÀ-ỹ]+$/, "Họ tên chỉ chứa chữ cái"),
    DIACHI: Yup.string().required("Địa chỉ là bắt buộc"),
    NGAYCAP: Yup.date()
      .required("Ngày cấp là bắt buộc")
      .test("checkAge", "Ngày cấp phải nhỏ hơn ngày hiện tại", (value) => {
        var today = new Date();
        return value < today;
      }),
    CMT: Yup.string()
      .required("Chứng minh thư là bắt buộc")
      .matches(/^\S+$/, "Không được chứa khoảng trống")
      .matches(/^\d+$/, "Chứng minh thư chỉ chứa số")
      .matches(/^[0-9]{12}$/, "Chứng minh thư gồm 12 số"),
    IDTUYENTHU: Yup.string().required("Phiếu thu là bắt buộc"),
    IDLOAIKH: Yup.string().required("Loại khách hàng là bắt buộc"),
  });

  const defaultValues = useMemo(
    () => ({
      MAKHACHHANG: currentCustomer?.MAKHACHHANG || "",
      HOTEN: currentCustomer?.HOTEN || "",
      DIACHI: currentCustomer?.DIACHI || "",
      NGAYCAP: dayjs(currentCustomer?.NGAYCAP) || dayjs(new Date()),
      CMT: currentCustomer?.CMT || "",
      IDTUYENTHU: currentCustomer?.TUYENTHU?.IDTUYENTHU || "",
      TENXAPHUONG: currentCustomer?.TUYENTHU.XAPHUONG.IDXAPHUONG || "",
      IDLOAIKH: currentCustomer?.IDLOAIKH || "",
      // NGAYTAO: dayjs(new Date()),
      // NGAYCHINHSUA: dayjs(new Date()),
      TRANGTHAI: currentCustomer?.TRANGTHAI || "",
      TENQUANHUYEN:
        currentCustomer?.TUYENTHU.XAPHUONG.QUANHUYEN.IDQUANHUYEN || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomer]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCustomer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCustomer]);

  const onSubmit = async (account: any) => {
    try {
      if (isEdit) {
        account = {
          ...account,
          IDKHACHHANG: currentCustomer?.IDKHACHHANG,
          TRANGTHAI: checked,
        };
        await dispatch(updateCustomer(account));
      } else {
        await dispatch(createCustomer(account));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (createCustomerSuccess || updateCustomerSuccess) {
      navigate(PATH_DASHBOARD.user.list);
    }
    return () => {
      dispatch(resetCustomer());
    };
  }, [createCustomerSuccess, updateCustomerSuccess]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField
                // disabled={isEdit}
                name="MAKHACHHANG"
                label="Mã khách hàng"
                InputProps={{
                  readOnly: isEdit ? true : false,
                }}
              />
              <RHFTextField name="HOTEN" label="Họ tên " />

              <RHFSelect
                name="IDTUYENTHU"
                label="Tuyến thu"
                placeholder="Tuyến thu"
                onChange={handleSelectrevenueRoutes}
                disabled={isEdit}
              >
                <option value="" />
                {revenueRoutesList?.map((option, index) => (
                  <option key={option.IDTUYENTHU} value={option.IDTUYENTHU}>
                    {option.TENTUYENTHU}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField
                name="TENQUANHUYEN"
                label="Quận huyện"
                value={data.setDistrict}
                InputProps={{
                  readOnly: isEdit ? true : false,
                }}
              />

              <RHFTextField
                name="TENXAPHUONG"
                label="Xã phường"
                value={data.setWard}
                InputProps={{
                  readOnly: true,
                }}
              />
              {isEdit && (
                <>
                  <Stack
                    mx={2}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography>
                      <Label
                        variant={"outlined"}
                        color={"error"}
                        sx={{ textTransform: "uppercase", mb: 1 }}
                      >
                        Khóa
                      </Label>
                    </Typography>
                    <Switch
                      name="TRANGTHAI"
                      checked={
                        typeof checked === "string"
                          ? checked === "true"
                          : checked
                      }
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <Typography>
                      <Label
                        variant={"outlined"}
                        color={"success"}
                        sx={{ textTransform: "uppercase", mb: 1 }}
                      >
                        Hoạt động
                      </Label>
                    </Typography>
                  </Stack>
                </>
              )}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="CMT" label="Chứng minh thư" />
              <Controller
                name="NGAYCAP"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày cấp"
                    defaultValue={dayjs("2022-04-17")}
                    disableFuture
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <RHFTextField
                name="DIACHI"
                label="Địa chỉ"
                // sx={{ gridColumn: { sm: "1 / 3" } }}
              />

              <RHFSelect
                name="IDLOAIKH"
                label="Loại khách hàng"
                placeholder="Loại khách hàng"
                InputProps={{
                  readOnly: isEdit ? true : false,
                }}
              >
                <option value="" />
                {customerTypeList?.map((option, index) => (
                  <option key={option.IDLOAIKH} value={option.IDLOAIKH}>
                    {option.TENLOAI}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
