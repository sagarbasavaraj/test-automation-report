import React, { PureComponent } from "react";
import { number } from "prop-types";
import { withStyles } from "@material-ui/styles";

const styles = {
  track: {
    fill: "transparent",
    stroke: "#001f4b",
    strokeWidth: 10
  },
  indicator: {
    fill: "transparent",
    stroke: "#cee308",
    strokeWidth: 10,
    strokeDasharray: "0 10000",
    strokeLinecap: "round",
    transition: "stroke-dasharray .3s ease"
  },
  text: {
    fill: "#c0cfdc"
  },
  val: {
    fontSize: "18px"
  },
  percent: {
    fontSize: "12px"
  }
};

class DonutChart extends PureComponent {
  static propTypes = {
    value: number,
    size: number,
    strokeWidth: number
  };

  static defaultProps = {
    value: 0,
    size: 70,
    strokewidth: 8
  };

  render() {
    const { classes } = this.props;
    const halfsize = this.props.size * 0.5;
    const radius = halfsize - this.props.strokewidth * 0.5;
    const circumference = 2 * Math.PI * radius;
    const strokeval = (this.props.value * circumference) / 100;
    const dashval = strokeval + " " + circumference;

    const trackstyle = { strokeWidth: this.props.strokewidth };
    const indicatorstyle = {
      strokeWidth: this.props.strokewidth,
      strokeDasharray: dashval
    };
    const rotateval = "rotate(90 " + halfsize + "," + halfsize + ")";

    return (
      <svg
        width={this.props.size}
        height={this.props.size}
      >
        <circle
          r={radius}
          cx={halfsize}
          cy={halfsize}
          transform={rotateval}
          style={trackstyle}
          className={classes.track}
        />
        <circle
          r={radius}
          cx={halfsize}
          cy={halfsize}
          transform={rotateval}
          style={indicatorstyle}
          className={classes.indicator}
        />
        <text
          className={classes.text}
          x={halfsize + 2}
          y={halfsize + 5}
          style={{ textAnchor: "middle" }}
        >
          <tspan className={classes.val}>{this.props.value}</tspan>
          <tspan className={classes.percent}>%</tspan>
        </text>
      </svg>
    );
  }
}

export default withStyles(styles)(DonutChart);
