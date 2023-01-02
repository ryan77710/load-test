window.addEventListener("DOMContentLoaded", (event) => {
  let second = 0;
  const labels = [];
  const dataValue = [];
  let myChartResult = "hhh";

  const maxScale = 110;
  const minScale = 0;

  let isGood = 0;
  let isBad = 6;
  let ismedium = 0;

  const connectButton = document.getElementById("start-load");
  const connected = document.getElementById("connected");
  const loader = document.getElementById("connect-loader");
  const linkContainer = document.getElementById("link-container");

  const classNameChange = (link) => {
    if (link.classList.contains("link-red")) {
      link.classList.remove("link-red");
      link.classList.add("link-orange");

      ismedium++;
      isBad--;
    } else if (link.classList.contains("link-orange")) {
      link.classList.remove("link-orange");
      link.classList.add("link-green");

      ismedium--;
      isGood++;
    } else {
      link.classList.remove("link-green");
      link.classList.add("link-red");

      isGood--;
      isBad++;
    }
  };

  const bef180 = document.getElementById("bef-180");
  const bef6 = document.getElementById("bef-6");
  const bef1 = document.getElementById("bef-1");
  const aft1 = document.getElementById("aft-1");
  const aft6 = document.getElementById("aft-6");
  const aft180 = document.getElementById("aft-180");

  const goodL = document.getElementById("good-l");
  const mediumL = document.getElementById("medium-l");
  const badL = document.getElementById("bad-l");
  const badR = document.getElementById("bad-r");
  const mediumR = document.getElementById("medium-r");
  const goodR = document.getElementById("good-r");

  const link1 = document.getElementById("link1");
  const link2 = document.getElementById("link2");
  const link3 = document.getElementById("link3");
  const link4 = document.getElementById("link4");
  const link5 = document.getElementById("link5");
  const link6 = document.getElementById("link6");

  link1.addEventListener("click", (e) => {
    classNameChange(link1);
    connectionGood();
  });

  link2.addEventListener("click", (e) => {
    classNameChange(link2);
    connectionGood();
  });

  link3.addEventListener("click", (e) => {
    classNameChange(link3);
    connectionGood();
  });

  link4.addEventListener("click", (e) => {
    classNameChange(link4);
    connectionGood();
  });

  link5.addEventListener("click", (e) => {
    classNameChange(link5);
    connectionGood();
  });

  link6.addEventListener("click", (e) => {
    classNameChange(link6);
    connectionGood();
  });

  const connectionGood = () => {
    if (isGood === 6) {
      connected.classList.remove("hide");
      loader.classList.add("hide");
    }
  };
  connectButton.addEventListener("click", () => {
    connectButton.classList.add("hide");
    loader.classList.remove("hide");
    linkContainer.classList.remove("hide");
  });

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
          xOffset: 150,
          yOffset: "50%",
          delay: 0,
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
            ttl: 5000,
            refresh: 4,
            onRefresh: (chart) => {
              chart.data.datasets.forEach((dataset) => {
                const quality = calcQuality(isBad, ismedium);

                if (myChart.options.plugins.streaming.pause === false) {
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
    const secondDuration = 20;
    const timeduration = secondDuration - 1;
    const dateStart = Date.now();

    const myInterval = setInterval(() => {
      if (second === timeduration) {
        myChart.options.plugins.streaming.pause = !myChart.options.plugins.streaming.pause;
        myChart.update();
        clearInterval(myInterval);
        // stop();
        chartResult(myChartResult);
      } else {
        second++;
      }
    }, 1000);
  };

  const calcQuality = (isBad, isMedium) => {
    if (isBad > 0) {
      return 1;
    } else if (isMedium > 0) {
      return 2;
    } else {
      return 3;
    }
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
      time: value.x,
      value: { value: value.y, q: quality },
    };
    dataValue.push(obj);
  };
  const actionButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");

  actionButton.addEventListener("click", (e) => {
    action(myChartResult);
  });

  const chartResult = (myChartResult) => {
    for (let i = 0; i < dataValue.length; i++) {
      dataValue[i].place = i;
    }
    const chartResultSection = document.getElementById("chart-result-section");
    chartResultSection.classList.remove("hide");
    const ctx2 = document.getElementById("myChartResult").getContext("2d");

    myChartResult = new Chart(ctx2, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "",
            data: dataValue,
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
        animation: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            align: "start",
          },
        },
        elements: {
          point: {
            hitRadius: 5,
          },
        },
        scales: {
          xAxis: {
            type: "linear",
            max: maxScale,
            min: minScale,
            autoSkip: false,
            tacked: false,
          },
        },
        parsing: {
          xAxisKey: "place",
          yAxisKey: "value.value",
        },
        responsive: true,
      },
    });

    bef180.addEventListener("click", (e) => {
      console.log(myChartResult);
      leftScroll(myChartResult, 198000);
    });

    bef6.addEventListener("click", (e) => {
      leftScroll(myChartResult, 72000);
    });

    bef1.addEventListener("click", (e) => {
      leftScroll(myChartResult, 120);
    });

    aft1.addEventListener("click", (e) => {
      rightScroll(myChartResult, 120);
    });

    aft6.addEventListener("click", (e) => {
      rightScroll(myChartResult, 72000);
    });

    aft180.addEventListener("click", (e) => {
      rightScroll(myChartResult, 198000);
    });

    goodL.addEventListener("click", (e) => {
      searchQuality(myChartResult, 3, false);
    });

    mediumL.addEventListener("click", (e) => {
      searchQuality(myChartResult, 2, false);
    });

    badL.addEventListener("click", (e) => {
      searchQuality(myChartResult, 1, false);
    });

    badR.addEventListener("click", (e) => {
      searchQuality(myChartResult, 1, true);
    });

    mediumR.addEventListener("click", (e) => {
      searchQuality(myChartResult, 2, true);
    });

    goodR.addEventListener("click", (e) => {
      searchQuality(myChartResult, 3, true);
    });
  };
  const searchQuality = (myChart, quality, increase) => {
    if (increase) {
      for (let i = myChart.options.scales.xAxis.min; i < dataValue.length; i++) {
        if (dataValue[i].value.q === quality) {
          myChart.options.scales.xAxis.min = dataValue[i].place;
          myChart.options.scales.xAxis.max = dataValue[i].place + 100;
          myChart.update();
          break;
        }
      }
    } else {
      for (let i = myChart.options.scales.xAxis.min; i > 0; i--) {
        if (dataValue[i].value.q === quality) {
          myChart.options.scales.xAxis.min = dataValue[i].place;
          myChart.options.scales.xAxis.max = dataValue[i].place + 100;
          myChart.update();
          break;
        }
      }
    }
  };

  const leftScroll = (myChart, maxScale) => {
    myChart.options.scales.xAxis.min -= maxScale;
    myChart.options.scales.xAxis.max -= maxScale;
    myChart.update();
  };

  const rightScroll = (myChart, maxScale) => {
    myChart.options.scales.xAxis.min += maxScale;
    myChart.options.scales.xAxis.max += maxScale;
    myChart.update();
  };
});
