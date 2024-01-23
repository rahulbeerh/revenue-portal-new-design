import { Button } from "@mui/material";
import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const ExportDailyRevenueToExcel = ({ data }) => {
  const createDownloadData = () => {
    handleExport().then((url) => {
      // console.log(url);
      const downloadAnchorElement = document.createElement("a");
      downloadAnchorElement.setAttribute("href", url);
      downloadAnchorElement.setAttribute("download", "revenue_report.xlsx");
      downloadAnchorElement.click();
      downloadAnchorElement.remove();
    });
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);

    // console.log(buf);

    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    // console.log(view);
    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      //   console.log(s.charCodeAt(i));
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      type: "binary",
    };
    const wbout = XLSX.write(workbook, wopts);

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const handleExport = () => {
    let table = [
      {
        A: "Date",
        B: "Total Base",
        C: "Total Active Base",
        D: "Subscriptions",
        E: "Subscription Failed",
        F: "Unsubscriptions",
        G: "Renewal Revenue",
        H: "Subscription Revenue",
        I: "Total Revenue",
        J: "Fame",
        K: "Callback Count",
        L: "Revenue Share",
      },
    ];
    data.forEach((row) => {
      const misDate = row.misDate;
      const totalBase = row.totalBase;
      const totalActiveBase = row.totalActiveBase;
      const subscriptions = row.subscriptions;
      const subFailed = row.subFailed;
      const unsubscriptions = row.unsubscriptions;
      const renewalsRevenue = row.renewalsRevenue;
      const subscriptionRevenue = row.subscriptionRevenue;
      const totalRevenue = row.totalRevenue;
      const fame = row.fame;
      const callbackcount = row.callbackcount;
      const revenueShare = row.revenueShare;

      table.push({
        A: misDate,
        B: totalBase,
        C: totalActiveBase,
        D: subscriptions,
        E: subFailed,
        F: unsubscriptions,
        G: renewalsRevenue,
        H: subscriptionRevenue,
        I: totalRevenue,
        J: fame,
        K: callbackcount,
        L: revenueShare,
      });
    });
    // console.log(table);
    const finalData = [...table];
    // console.log(finalData);

    //creating workbook
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, sheet, "Revenue_Report");
    const workbookblob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Date" ? headerIndexes.push(index) : null
    );
    const totalIndex = [];
    finalData.forEach((data, index) =>
      data["A"] === "Totals" ? totalIndex.push(index) : null
    );
    // console.log({ totalIndex });
    // console.log({ headerIndexes });

    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:H2",
      tbodyRange: `A1:L${finalData.length}`,
      theadRange:
        headerIndexes.length >= 1
          ? `A${headerIndexes[0] + 1}:L${headerIndexes[0] + 1}`
          : null,
      ttotalRange:
        totalIndex.length >= 1
          ? `A${totalIndex[0] + 1}:L${totalIndex[0] + 1}`
          : null,
    };
    return addStyles(workbookblob, dataInfo);
  };

  const addStyles = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        // sheet.usedRange().style({
        //   fontFamily: "Arial",
        //   verticalAlignment: "center",
        // });

        sheet.column("A").width(15);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(20);
        sheet.column("F").width(15);
        sheet.column("G").width(20);
        sheet.column("H").width(20);
        sheet.column("I").width(15);
        sheet.column("J").width(15);
        sheet.column("K").width(15);
        sheet.column("L").width(20);

        sheet.range(dataInfo.tbodyRange).style({
          horizontalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange).style({
          fill: "FFFD04",
          bold: true,
        });
        sheet.range(dataInfo.ttotalRange).style({
          fill: "FFFD04",
          bold: true,
        });
      });
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <Button variant="contained" onClick={createDownloadData} color="secondary">
      Export
    </Button>
  );
};

export default ExportDailyRevenueToExcel;
