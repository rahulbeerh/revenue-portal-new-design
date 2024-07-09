import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import classes from "./NewLineGraph.module.css";

export default function LineGraph({ data }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  console.log(data, "datamain");

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const graphData = {
      labels: [...data.map((dataItem) => dataItem?.misDate)],
      datasets: [
        {
          label: "Total Revenue",
          data: [...data.map((dataItem) => dataItem?.totalRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--red-500"),
          tension: 0.4,
        },
        {
          label: "Renewal Revenue",
          data: [...data.map((dataItem) => dataItem?.renewalsRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: "Subscription Revenue",
          data: [...data.map((dataItem) => dataItem?.subscriptionRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(graphData);
    setChartOptions(options);
  }, [data]);

  return (
    <div className={classes.graph_container_2}>
      <div className={classes.info_container}>
        <p>Click the below buttons for data filtering in graph.</p>
      </div>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
