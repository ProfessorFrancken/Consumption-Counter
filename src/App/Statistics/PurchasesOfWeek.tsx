import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import {VictoryChart, VictoryBar, VictoryAxis} from "victory";

const PurchasesOfWeek = ({purchases, today, icon, type}: any) => {
  return (
    <div className="p-0 bg-dark text-white" style={{position: "relative"}}>
      <div
        style={{
          position: "absolute",
          top: "1.0em",
          right: "1.0em",
          zIndex: 100,
          textAlign: "right",
        }}
      >
        <h4 className="mb-1" style={{color: "#a4afb9"}}>
          {purchases.reduce((total: any, purchases: any) => total + purchases[type], 0)}
          <FontAwesomeIcon icon={icon} size="1x" className="ms-1" />
        </h4>
        <small className="text-uppercase" style={{color: "#a4afb9"}}>
          {today[type]} today
        </small>
      </div>
      <div>
        <VictoryChart height={150} width={400} domainPadding={{x: 10, y: 0}} padding={35}>
          <VictoryAxis
            tickFormat={(date) => moment(date).format("ddd")}
            style={{
              axis: {stroke: "transparant"},
              tickLabels: {color: "#6c757d", fill: "rgb(108, 117, 125)"},
            }}
          />
          <VictoryBar
            data={purchases}
            style={{data: {fill: "#6c757d"}}}
            x={"date"}
            y={type}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default PurchasesOfWeek;
