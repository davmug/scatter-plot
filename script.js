document.addEventListener("DOMContentLoaded", function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      visualizeData(data);
      console.log(data);
    })
    .catch((error) => console.error("Error loading data:", error));

  function visualizeData(data) {
    const w = 800;
    const h = 500;
    const padding = 60;

    const svg = d3.select("#chart").attr("width", w).attr("height", h);

    const parseTime = d3.timeParse("%M:%S");
    const formatTime = d3.timeFormat("%M:%S");
    const parseYear = d3.timeParse("%Y");
    const formatYear = d3.timeFormat("%Y");

    data.forEach((d) => {
      d.Time = parseTime(d.Time);
      d.Year = parseYear(d.Year);
    });

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Year))
      .range([padding, w - padding]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Time))
      .range([padding, h - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(formatYear);

    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    svg
      .append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${padding}, 0)`).attr("id", "y-axis").call(yAxis);

    const tooltip = d3.select("#tooltip");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", (d) => (d.Doping ? "dot doping" : "dot no-doping"))
      .attr("r", 6)
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("data-xvalue", (d) => formatYear(d.Year))
      .attr("data-yvalue", (d) => d.Time.toISOString())
      .on("mouseover", (event, d) => {
        tooltip.classed("show", true).attr("data-year", formatYear(d.Year)).html(`
                        Anno: ${formatYear(d.Year)}<br>
                        Tempo: ${formatTime(d.Time)}<br>
                        ${d.Doping ? `<p class="doping-alert">${d.Doping}</p>` : ""}
                        <p>${d.Name} (${d.Nationality})</p>
                    `);
      })
      .on("mouseout", () => {
        tooltip.classed("show", false);
      });
  }
});
