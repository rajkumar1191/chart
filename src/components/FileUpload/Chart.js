import React, { useRef } from "react";
import * as d3 from "d3";

export const RadialStackedChart = (props) => {
  const svgData = useRef(null);

  React.useEffect(() => {
    const width = 928;
    const height = width;
    const innerRadius = 180;
    const outerRadius = Math.min(width, height) * 0.67;

    const series = d3
      .stack()
      .keys(d3.union(props.data.map((d) => d.age)))
      .value(([, D], key) => D.get(key).Monthly_Income)(
      d3.index(
        props.data,
        (d) => d.Department,
        (d) => d.age
      )
    );
    console.log(series);

    const arc = d3
      .arc()
      .innerRadius((d) => y(d[0]))
      .outerRadius((d) => y(d[1]))
      .startAngle((d) => x(d.data[0]))
      .endAngle((d) => x(d.data[0]) + x.bandwidth())
      .padAngle(1.5 / innerRadius)
      .padRadius(innerRadius);

    const x = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          props.data,
          (D) => -d3.sum(D, (d) => d.Monthly_Income),
          (d) => d.Department
        )
      )
      .range([0, 2 * Math.PI])
      .align(0);

    const y = d3
      .scaleRadial()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .range([innerRadius, outerRadius]);

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");

    const formatValue = (x) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

    const svg = d3
      .select(".svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height * 0.69, width, height])
      .attr(
        "style",
        "width: 100%; height: auto; font: 10px sans-serif; position:relative "
      );

      svg
      .append("g")
      .selectAll()
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("path")
      .data((D) => D.map((d) => { return ((d.key = D.key), d)}))
      .join("path")
      .attr("d", arc)
      .append("title")
      .text(
        (d) =>
          `${d.data[0]} ${d.key}\n${formatValue(
            d.data[1].get(d.key).Monthly_Income
          )}`
      );

    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(x.domain())
      .join("g")
      .attr(
        "transform",
        (d) => `
        rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
        translate(${innerRadius},0)
      `
      )
      .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000"))
      .call((g) =>
        g
          .append("text")
          .attr("transform", (d) =>
            (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)"
          )
          .text((d) => d)
      );

    svg
      .append("g")
      .attr("text-anchor", "end")
      .call((g) =>
        g
          .append("text")
          .attr("x", -6)
          .attr("y", (d) => -y(y.ticks(10).pop()))
          .attr("dy", "-1em")
          .text("Population")
      )
      .call((g) =>
        g
          .selectAll("g")
          .data(y.ticks(10).slice(1))
          .join("g")
          .attr("fill", "none")
          .call((g) =>
            g
              .append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.5)
              .attr("r", y)
          )
          .call((g) =>
            g
              .append("text")
              .attr("x", -6)
              .attr("y", (d) => -y(d))
              .attr("dy", "0.35em")
              .attr("stroke", "#fff")
              .attr("stroke-width", 5)
              .text(y.tickFormat(10, "s"))
              .clone(true)
              .attr("fill", "#000")
              .attr("stroke", "none")
          )
      );

    svg
      .append("g")
      .selectAll()
      .data(color.domain())
      .join("g")
      .attr(
        "transform",
        (d, i, nodes) => `translate(-40,${(nodes.length / 2 - i - 1) * 20})`
      )
      .call((g) =>
        g
          .append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", color)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text((d) => d)
      );
    svgData.current = svg;
  }, [props.data]);

  return (
    <div
      style={{
        width: "60%",
        display: "block",
        margin: "auto",
        position: "relative"
      }}
    >
      <div id="chartid" ref={svgData}>
        <svg className="svg" />
      </div>
    </div>
  );
};
