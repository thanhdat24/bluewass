import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Card,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
// components
import Label from "../../../components/Label";
import dayjs, { Dayjs } from "dayjs";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import RHFSelect from "../../../components/hook-form/RHFSelect";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store";

import { CustomerModel } from "../../../interfaces/CustomerModel";
import { PATH_DASHBOARD } from "../../../routes/paths";
import {
  createReceipt,
  resetReceipt,
} from "../../../redux/slices/receiptReducer";
import { ReceiptModel } from "../../../interfaces/ReceiptModel";
import { DateField } from "@mui/x-date-pickers";
import { fDateTime } from "../../../utils/formatTime";
type Props = {
  isEdit: boolean;
  currentCustomer: CustomerModel | undefined;
};

export default function ReceiptForm({ isEdit, currentCustomer }: Props) {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { billingPeriodList } = useAppSelector((state) => state.billingPeriod);

  const { userLogin } = useAppSelector((state) => state.admin);

  const { createReceiptSuccess } = useAppSelector((state) => state.receipt);

  console.log("12345", dayjs(new Date()).format());
  const NewUserSchema = Yup.object().shape({
    MAUSOPHIEU: Yup.string().required("Mẫu số phiếu là bắt buộc"),
    IDKYTHU: Yup.string().required("Kỳ thu là bắt buộc"),
    KYHIEU: Yup.string().required("Ký hiệu là bắt buộc"),
    NOIDUNG: Yup.string().required("Nội dung là bắt buộc"),
  });
  const defaultValues = useMemo(
    () => ({
      MAUSOPHIEU: "",
      KYHIEU: "",
      IDKHACHHANG: currentCustomer?.IDKHACHHANG || "",
      IDNHANVIEN: userLogin?.IDNHANVIEN || "",
      KHACHHANG: currentCustomer?.HOTEN || "",
      MAKHACHHANG: currentCustomer?.MAKHACHHANG || "",
      CMT: currentCustomer?.CMT || "",
      DIACHI: currentCustomer?.DIACHI || "",
      IDKYTHU: 3,
      IDTUYENTHU: currentCustomer?.TUYENTHU?.IDTUYENTHU || "",
      TUYENTHU: currentCustomer?.TUYENTHU?.TENTUYENTHU || "",
      XAPHUONG: currentCustomer?.TUYENTHU?.XAPHUONG.TENXAPHUONG || "",
      QUANHUYEN:
        currentCustomer?.TUYENTHU?.XAPHUONG.QUANHUYEN.TENQUANHUYEN || "",
      GIA: currentCustomer?.LOAIKH.GIA || "",
      NGAYTAO: dayjs(new Date()),
      NOIDUNG: "",
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

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data);
      const convertedData: any = {
        IDKHACHHANG: data.IDKHACHHANG,
        IDNHANVIEN: data.IDNHANVIEN,
        MAUSOPHIEU: data.MAUSOPHIEU,
        KYHIEU: data.KYHIEU,
        IDKYTHU: Number(data.IDKYTHU),
        TRANGTHAIPHIEU: false,
        NGAYTAO: fDateTime(data.NGAYTAO),
        CHITIETPHIEUTHUs: [
          {
            NOIDUNG: data.NOIDUNG,
            SOTIEN: data.GIA,
          },
        ],
      };
      console.log("convertedData", convertedData);
      await dispatch(createReceipt(convertedData));
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (createReceiptSuccess) {
      navigate(PATH_DASHBOARD.receipt.list);
    }
    return () => {
      dispatch(resetReceipt());
    };
  }, [createReceiptSuccess]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <div className="mb-6 text-lg font-semibold uppercase text-blue-600">
              Thông tin khách hàng
              <Label
                variant={"ghost"}
                color={
                  (currentCustomer?.LOAIKH.TENLOAI === "Hộ Dân" && "success") ||
                  (currentCustomer?.LOAIKH.TENLOAI === "Doanh Nghiệp" &&
                    "error") ||
                  "default"
                }
                sx={{ textTransform: "uppercase", mb: 1, marginLeft: 1 }}
              >
                {currentCustomer?.LOAIKH.TENLOAI}
              </Label>
            </div>
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
                name="KHACHHANG"
                label="Họ tên"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="MAKHACHHANG"
                label="Mã khách hàng"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="CMT"
                label="Chứng minh thư"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="DIACHI"
                label="Địa chỉ"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="GIA"
                label="Giá loại khách hàng"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="TUYENTHU"
                label="Tuyến thu"
                InputProps={{
                  readOnly: true,
                }}
              />
              <RHFTextField
                name="QUANHUYEN"
                label="Quận huyện"
                InputProps={{
                  readOnly: true,
                }}
              />{" "}
              <RHFTextField
                name="XAPHUONG"
                label="Phường xã"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <div className="mb-6 text-lg font-semibold uppercase text-blue-600">
              Thông tin phiếu thu
            </div>
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
              <RHFTextField name="MAUSOPHIEU" label="Mẫu số phiếu" />
              <RHFTextField name="KYHIEU" label="Ký hiệu" />
              <RHFTextField
                name="NOIDUNG"
                label="Nội dung"
                sx={{ gridColumn: { sm: "1 / 3" } }}
              />
              <RHFSelect name="IDKYTHU" label="Kỳ thu" placeholder="Kỳ thu">
                {billingPeriodList?.map((option, index) => (
                  <option key={index} value={option.IDKYTHU}>
                    {option.TENKYTHU}
                  </option>
                ))}
              </RHFSelect>
              {/* <Controller
                name="KYTHU"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Kỳ thu"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              /> */}
              <Controller
                name="NGAYTAO"
                control={control}
                render={({ field }) => (
                  <DateField
                    label="Ngày tạo phiếu"
                    value={field.value}
                    onChange={field.onChange}
                    readOnly
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <LoadingButton
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Lưu thay đổi
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
