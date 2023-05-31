import React from "react";
import { useLocation, useParams } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import RevenueRoutesForm from "../../../sections/@dashboard/revenueRoutes/RevenueRoutesForm";

type Props = {};

export default function RevenueRoutesAction({}: Props) {
  const { pathname } = useLocation();

  const { id = "" } = useParams();

  const isEdit = pathname.includes("edit");

  return (
    <Page title="RevenueRoutes: Create a new Revenue Routes">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Tạo tuyến thu" : "Chỉnh tuyến thu"}
          links={[
            { name: "Trang chủ", href: PATH_DASHBOARD.root },
            { name: "Tuyến thu", href: PATH_DASHBOARD.receipt.list },
            { name: !isEdit ? "Tuyến thu mới" : id },
          ]}
        />

        <RevenueRoutesForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}