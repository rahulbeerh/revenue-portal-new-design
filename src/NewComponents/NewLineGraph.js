import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import classes from "./NewLineGraph.module.css";

const NewLineGraph = (props) => {
  return (
    <div className={classes.graph_container}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={props.width}
            height={300}
            data={props.data}
            barCategoryGap="2%"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              //   stroke={theme ? "#fff" : "black"}
              stroke="black"
              dataKey="misDate"
              style={{ fontSize: "smaller" }}
            />
            <YAxis
              stroke="black"
              allowDataOverflow={true}
              allowDecimals={true}
              scale="auto"
              domain={[0, props.biggest]}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="renewalsRevenue"
              stroke="#8884d8"
              // activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="subscriptionRevenue"
              stroke="#82ca9d"
            />
            <Line type="monotone" dataKey="totalRevenue" stroke="#c91054" />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default NewLineGraph;
