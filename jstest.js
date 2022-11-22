window.addEventListener("DOMContentLoaded", (event) => {
  let second = 0;
  const labels = [];
  // const seconds = 0;
  const dataValue = [];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "streaming",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
        segment: {
          borderColor: (context) => {
            if (context.p0.raw.q === 3) {
              return "lightgreen";
            } else if (context.p0.raw.q === 2) {
              return "hsl(17, 100%, 74%)";
            } else return "rgb(255, 99, 132)";
          },
        },
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      plugins: {
        streaming: {
          duration: 20000,
          pause: true,
        },
        deferred: {
          xOffset: 150, // defer until 150px of the canvas width are inside the viewport
          yOffset: "50%", // defer until 50% of the canvas height are inside the viewport
          delay: 0, // delay of 500 ms after the canvas is considered inside the viewport
        },
      },
      scales: {
        x: {
          type: "realtime",
          realtime: {
            // duration: 20000,
            // delay: 2000,
            onRefresh: (chart) => {
              // console.log(chart);
              chart.data.datasets.forEach((dataset) => {
                const quality = randomIntFromInterval(1, 3);

                if (myChart.options.plugins.streaming.pause === false) {
                  // console.log("data added");
                  const obj = {
                    x: Date.now(),
                    y: Math.random() * 10,
                    q: quality,
                  };
                  addData(obj, second, quality, dataset.data);
                }
              });
            },
          },
        },
      },
    },
  };
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, config);
  const action = () => {
    myChart.options.plugins.streaming.pause = !myChart.options.plugins.streaming.pause;
    myChart.update();
    // let second = 0;
    const timeduration = 20;
    const myInterval = setInterval(() => {
      // console.log("second === > ", second);

      if (second === timeduration) {
        // myChart.options.plugins.streaming.pause === true;
        // myChart.update();
        // console.log(myChart.options.plugins.streaming.pause);
        clearInterval(myInterval);
        stop();
        chartResult();
      } else {
        second++;
      }
    }, 1000);

    // console.log(myChart.options.plugins.streaming.pause);
  };
  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const stop = () => {
    myChart.destroy();
  };

  const addData = (value, second, quality, tab) => {
    tab.push(value);
    const obj = {
      time: String(second),
      value: { value: value.y, q: quality },
    };
    dataValue.push(obj);
    // console.log("value ===> ", dataValue);
  };
  // const addSecond = (value, tab) => {
  //   tab.push(value);
  // };
  const actionButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");

  actionButton.addEventListener("click", action);
  // stopButton.addEventListener("click", stop);

  // my chart result

  const chartResult = () => {
    const ctx2 = document.getElementById("myChart").getContext("2d");

    const myChartResult = new Chart(ctx2, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "bug",
            // data: [
            //   { time: "0", value: { value: 13, q: 2 } },
            //   { time: "1", value: { value: 6, q: 1 } },
            //   { time: "2", value: { value: 13, q: 2 } },
            //   { time: "3", value: { value: 6, q: 1 } },
            // ],
            data: dataValue,
            // spanGaps: false,
            segment: {
              borderColor: (context) => {
                if (context.p0.raw.value.q === 3) {
                  return "lightgreen";
                } else if (context.p0.raw.value.q === 2) {
                  return "hsl(17, 100%, 74%)";
                } else return "rgb(255, 99, 132)";
              },
            },
          },
        ],
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            align: "start",
          },
        },
        // scales: {
        //   y: {
        //     beginAtZero: true,
        //   },
        //   x: {
        //     autoSkip: false,
        //     tacked: false,
        //     max: maxScale,
        //     min: minScale,
        //   },
        // },
        parsing: {
          xAxisKey: "time",
          yAxisKey: "value.value",
        },
        responsive: true,
      },
    });
    // console.log(myChartResult);
  };
});
