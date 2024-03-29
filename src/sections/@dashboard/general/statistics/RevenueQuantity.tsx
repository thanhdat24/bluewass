import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader } from "@mui/material";
import { BaseOptionChart } from "../../../../components/chart";
import { fNumber, formatPriceInVND } from "../../../../utils/formatNumber";
import { getAllStatistics } from "../../../../redux/slices/statisticsReducer";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function RevenueQuantity() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllStatistics());
  }, [dispatch]);

  const { statisticAllList } = useAppSelector(
    (state: RootState) => state.statistic
  );

  const theme = useTheme();

  const CHART_DATA = [
    statisticAllList?.soluongdathu || 0,
    statisticAllList?.soluongchuathu || 0,
    statisticAllList?.soluongphieuhuy || 0,
  ];

  const chartOptions = merge(BaseOptionChart(), {
    labels: ["Đã thu", "Chưa thu", "Đã hủy"],
    legend: { floating: true, horizontalAlign: "center" },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          [
            {
              offset: 0,
              color: theme.palette.primary.light,
            },
            {
              offset: 100,
              color: theme.palette.primary.main,
            },
          ],
          [
            {
              offset: 0,
              color: theme.palette.warning.light,
            },
            {
              offset: 100,
              color: theme.palette.warning.main,
            },
          ],
          [
            {
              offset: 0,
              color: theme.palette.error.light,
            },
            {
              offset: 100,
              color: theme.palette.error.main,
            },
          ],
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "68%" },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            formatter: () =>
              statisticAllList?.soluongtong !== undefined
                ? statisticAllList.soluongtong
                : 0,
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Thống kê tất cả số lượng phiếu thu " />
      <CardHeader
        title={`Tổng tiền đã thu: ${formatPriceInVND(
          statisticAllList?.tongtien || 0
        )}`}
        className="!pt-1 !text-gray-600"
      />

      <ChartWrapperStyle dir="ltr">
        {statisticAllList?.soluongtong && (
          <ReactApexChart
            type="radialBar"
            series={CHART_DATA}
            options={chartOptions as any}
            height={330}
          />
        )}
      </ChartWrapperStyle>
    </Card>
  );
}
