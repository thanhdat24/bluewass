import PropTypes from "prop-types";
import { Page, View, Text, Image, Document } from "@react-pdf/renderer";

import { default as VNnum2words } from "vn-num2words";
// utils
// import { fCurrency } from "../../../../utils/formatNumber";
// import { fDate } from "../../../../utils/formatTime";
//
import styles from "./ReceiptStyle";
import { Box } from "@mui/material";
import { formatPriceInVND } from "../../../utils/formatNumber";
import dayjs from "dayjs";

// ----------------------------------------------------------------------
interface ReceiptPDFProps {
  receipt: any;
}
export default function ReceiptPDF({ receipt }: ReceiptPDFProps) {
  const {
    MAUSOPHIEU,
    KHACHHANG,
    CHITIETPHIEUTHUs,
    NHANVIEN,
    TRANGTHAIHUY,
    TRANGTHAIPHIEU,
    NGUOITHU,
    NGAYTAO,
    KYHIEU,
  } = receipt;

  const formattedNgayTao = dayjs(NGAYTAO)
    .locale("vi")
    .format("Ngày DD [tháng] MM [năm] YYYY");
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb25]}>
          <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
            <Text style={[styles.h3]}>VNPT CẦN THƠ</Text>
            <Text>
              <Text style={styles.h5}>Địa chỉ:</Text> 02 Nguyễn Trãi, An Hội,
              Ninh Kiều, Cần Thơ
            </Text>
            <Text>
              <Text style={styles.h5}>Điện thoại:</Text> (0710) 800126 -{" "}
              <Text style={styles.h5}>Fax</Text>: (0710) 3765566
            </Text>
            <Text>
              <Text style={styles.h5}>Email:</Text> cskh@vnpt.vn -{" "}
              <Text style={styles.h5}>Website:</Text>
              http://www.vnptcantho.com.vn
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", flexDirection: "column" }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text style={styles.h3}>
                Mẫu số {MAUSOPHIEU} - {KYHIEU}
              </Text>
              <Text style={styles.fontItalic}>
                (Ban hành theo Thông tư số: 200/2014/TT
              </Text>
              <Text style={styles.fontItalic}>Ngày 22/12/2014 của BTC)</Text>
            </View>
          </View>
        </View>
        <View style={[styles.gridContainer]}>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              opacity: 0,
            }}
          >
            <Text
              style={{
                opacity: 0,
              }}
            >
              Ngày......tháng.
            </Text>
          </View>
          <View style={{ alignItems: "center", flexDirection: "column" }}>
            <Text style={[styles.h1, styles.mb3]}>PHIẾU THU</Text>
            <Text style={[styles.h5, styles.fontItalic]}>
              {formattedNgayTao ? (
                <Text style={[styles.h5, styles.fontItalic]}>
                  {formattedNgayTao}
                </Text>
              ) : null}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                alignItems: "flex-start",
              }}
            >
              <Text style={[styles.h5]}>Quyển số: ..................</Text>
              <Text style={[styles.h5]}>Số: .............................</Text>
              <Text style={[styles.h5]}>Nợ: .............................</Text>
              <Text style={[styles.h5]}>Có: .............................</Text>
            </View>
          </View>
        </View>
        <View style={[styles.gridContainer, styles.mt15]}>
          <View style={{ flexDirection: "column" }}>
            <Text>
              Họ và tên người nộp tiền: &ensp;
              <Text style={[styles.fontBold]}>{KHACHHANG.HOTEN}</Text>
            </Text>
            <Text>
              Loại người nộp tiền: &ensp;
              <Text style={[styles.fontBold]}>{KHACHHANG.LOAIKH.TENLOAI}</Text>
            </Text>
            <Text>
              Địa chỉ: &ensp;{" "}
              <Text style={[styles.fontBold]}>{KHACHHANG.DIACHI}</Text>
            </Text>
            <Text>
              Lý do nộp: &ensp;{" "}
              <Text style={[styles.fontBold]}>
                {CHITIETPHIEUTHUs[0]?.NOIDUNG}
              </Text>
            </Text>
            <Text>
              Số tiền: &ensp;{" "}
              <Text style={[styles.fontBold]}>
                {formatPriceInVND(CHITIETPHIEUTHUs[0]?.SOTIEN)}
              </Text>
              &ensp; (Viết bằng chữ): &ensp;
              <Text style={[styles.fontBold]}>
                {" "}
                {VNnum2words(CHITIETPHIEUTHUs[0]?.SOTIEN)}
              </Text>
            </Text>
            <Text>Kèm theo: {Array(40).fill(".").join("")} Chứng từ gốc</Text>
          </View>
          {TRANGTHAIPHIEU && !TRANGTHAIHUY && (
            <View style={[styles.gridColumn]}>
              {" "}
              <Image
                source="/logo/logo_confirm_receipt.png"
                style={{ height: 100 }}
              />
            </View>
          )}
          {TRANGTHAIHUY && (
            <View style={[styles.gridColumn]}>
              {" "}
              <Image
                source="/logo/logo_cancel_receipt.png"
                style={{ height: 100 }}
              />
            </View>
          )}
        </View>
        <View style={[styles.gridEvenly, styles.mt15]}>
          <View style={[styles.gridItem]}>
            <Text style={[styles.h4]}>Giám đốc </Text>
            <Text style={[styles.h6, styles.fontItalic]}>
              (Ký, họ tên, đóng dấu)
            </Text>
          </View>
          <View style={[styles.gridItem]}>
            <Text style={[styles.h4]}>Khách hàng</Text>
            <Text style={[styles.h6, styles.fontItalic]}>(Ký, họ tên)</Text>
            <Text style={[styles.subtitle1, styles.mt35]}>
              {KHACHHANG.HOTEN}
            </Text>
          </View>
          <View style={[styles.gridItem]}>
            <Text style={[styles.h4]}>NV lập phiếu</Text>
            <Text style={[styles.h6, styles.fontItalic]}>(Ký, họ tên)</Text>
            <Text style={[styles.subtitle1, styles.mt35]}>
              {NHANVIEN.HOTEN}
            </Text>
          </View>
          <View style={[styles.gridItem]}>
            <Text style={[styles.h4]}>NV Thu ngân</Text>
            <Text style={[styles.h6, styles.fontItalic]}>(Ký, họ tên)</Text>
            <Text style={[styles.subtitle1, styles.mt35]}>{NGUOITHU}</Text>
          </View>
        </View>
      </Page>
      {/* <View style={[styles.footer]}>
        <Image source="/logo/logo_congty.png" style={[styles.col6]} />
      </View> */}
    </Document>
  );
}
