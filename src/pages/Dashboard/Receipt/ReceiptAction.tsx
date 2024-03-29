import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import CustomerForm from "../../../sections/@dashboard/user/Form/CustomerForm";
import ReceiptForm from "../../../sections/@dashboard/receipt/ReceiptForm";
import {
  getAllCustomer,
  getDetailCustomer,
} from "../../../redux/slices/customerReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getAllBillingPeriods } from "../../../redux/slices/billingPeriodReducer";
import { getAllReceipt } from "../../../redux/slices/receiptReducer";


type Props = {};

export default function ReceiptAction({}: Props) {
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();

  const { id = "" } = useParams();

  const isEdit = pathname.includes("edit");

  const { customerList } = useAppSelector((state) => state.customer);

  const { receiptList } = useAppSelector((state) => state.receipt);


  const currentCustomer = customerList?.find(
    (customer) => customer.IDKHACHHANG === Number(id)
  );

  const currentReceipt = receiptList?.find(
    (receipt) => receipt.IDPHIEU === Number(id)
  );


  useEffect(() => {
    dispatch(getAllCustomer());
    dispatch(getAllBillingPeriods());
    dispatch(getAllReceipt());
  }, [dispatch]);

  return (
    <Page title="Receipt: Create a new receipt">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Tạo phiếu thu" : "Chỉnh sửa phiếu thu"}
          links={[
            { name: "Trang chủ", href: PATH_DASHBOARD.root },
            { name: "Phiếu thu", href: PATH_DASHBOARD.receipt.list },
            { name: !isEdit ? "Phiếu thu mới" : id },
          ]}
        />

        <ReceiptForm isEdit={isEdit} currentCustomer={currentCustomer} currentReceipt={currentReceipt}  />
      </Container>
    </Page>
  );
}
