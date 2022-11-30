window.addEventListener("DOMContentLoaded", (event) => {
  let second = 0;
  const labels = [];
  // const seconds = 0;
  const dataValue = [];
  let myChartResult = "hhh";

  const dateMax = 1000;
  const dateMin = 0;

  const bef180 = document.getElementById("bef-180");
  const bef6 = document.getElementById("bef-6");
  const bef1 = document.getElementById("bef-1");
  const aft1 = document.getElementById("aft-1");
  const aft6 = document.getElementById("aft-6");
  const aft180 = document.getElementById("aft-180");

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
      animation: false,
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        x: {
          type: "realtime",
          realtime: {
            duration: 5000,
            // delay: 2000,
            ttl: 5000,
            // refresh: 4, 1s / 250
            refresh: 4,
            // frameRate: 20,
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
  const action = (myChartResult) => {
    myChart.options.plugins.streaming.pause = !myChart.options.plugins.streaming.pause;
    myChart.update();
    // let second = 0;
    const secondDuration = 5;
    const timeduration = secondDuration - 1;
    const dateStart = Date.now();

    const myInterval = setInterval(() => {
      // console.log("second === > ", second);

      if (second === timeduration) {
        myChart.options.plugins.streaming.pause = !myChart.options.plugins.streaming.pause;
        myChart.update();
        console.log(myChart);
        clearInterval(myInterval);
        // stop();
        chartResult(dateStart, dateMin, dateMax, myChartResult);
      } else {
        second++;
      }
    }, 1000);
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
      // time: String(second),
      time: value.x,
      value: { value: value.y, q: quality },
    };
    dataValue.push(obj);
    // console.log("value ===> ", dataValue.length);
  };
  // const addSecond = (value, tab) => {
  //   tab.push(value);
  // };
  const actionButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");

  actionButton.addEventListener("click", (e) => {
    action(myChartResult);
  });
  // stopButton.addEventListener("click", stop);

  // my chart result

  const chartResult = (date, dateMin, dateMax, myChartResult) => {
    console.log(myChartResult);
    const ctx2 = document.getElementById("myChartResult").getContext("2d");

    myChartResult = new Chart(ctx2, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "bug",
            data: [
              // { time: Date.now(), value: { value: 13, q: 2 } },
              // { time: "1", value: { value: 6, q: 1 } },
              // { time: "2", value: { value: 13, q: 2 } },
              // { time: "3", value: { value: 6, q: 1 } },
            ],
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
        scales: {
          xAxis: {
            type: "time",
            distribution: "linear",
            max: Date.now() + dateMax,
            min: date + dateMin,

            // beginAtZero: false,
            // beginAt: Date.now(),
          },
        },
        // scales: {
        //   y: {
        //     beginAtZero: false,
        //   },
        //   x: {
        //     beginAtZero: false,
        //     autoSkip: false,
        //     tacked: false,
        //     max: 10,
        //     min: 0,
        //   },
        // },
        parsing: {
          xAxisKey: "time",
          yAxisKey: "value.value",
        },
        responsive: true,
      },
    });
    console.log(myChartResult);

    bef180.addEventListener("click", (e) => {
      addTime("min", 30, dateMin, dateMax, "-", myChartResult);
    });

    bef6.addEventListener("click", (e) => {
      addTime("min", 10, dateMin, dateMax, "-", myChartResult);
    });

    bef1.addEventListener("click", (e) => {
      addTime("sec", 1, dateMin, dateMax, "-", myChartResult);
    });

    aft1.addEventListener("click", (e) => {
      addTime("sec", 1, dateMin, dateMax, "+", myChartResult);
    });

    aft6.addEventListener("click", (e) => {
      addTime("min", 10, dateMin, dateMax, "+", myChartResult);
    });

    aft180.addEventListener("click", (e) => {
      addTime("min", 30, dateMin, dateMax, "+", myChartResult);
    });
  };

  const addTime = (type, nb, dateMin, dateMax, calc, chart) => {
    console.log(dateMin);
    console.log(dateMax);

    if (type === "sec") {
      second = nb * 1000;
      if (calc === "+") {
        dateMax = dateMax + second;
        dateMin = dateMin + second;
      } else {
        dateMax = dateMax - second;
        dateMin = dateMin - second;
      }
    } else if (type === "min") {
      minute = nb * 1000 * 60;
      if (calc === "+") {
        dateMax = dateMax + minute;
        dateMin = dateMin + minute;
      } else {
        dateMax = dateMax - minute;
        dateMin = dateMin - minute;
      }
    }
    chart.update();
    console.log(dateMin);
    console.log(dateMax);
  };
  // chartResult();

  // bef180.addEventListener("click", (e) => {
  //   console.log("180b");
  //   console.log(myChartResult);
  //   addTime("min", 30, dateMin, dateMax, "-");
  // });

  // bef6.addEventListener("click", (e) => {
  //   addTime("min", 10, dateMin, dateMax, "-");
  // });

  // bef1.addEventListener("click", (e) => {
  //   addTime("sec", 1, dateMin, dateMax, "-");
  // });

  // aft1.addEventListener("click", (e) => {
  //   addTime("sec", 1, dateMin, dateMax, "+");
  // });

  // aft6.addEventListener("click", (e) => {
  //   addTime("min", 10, dateMin, dateMax, "+");
  // });

  // aft180.addEventListener("click", (e) => {
  //   addTime("min", 30, dateMin, dateMax, "+");
  // });
});
