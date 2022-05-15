function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const redColor = "rgb(255, 99, 132)";
const greenColor = "lightgreen";
const orangeColor = "hsl(17, 100%, 74%)";

let isGood = 0;
let isBad = 6;
let ismedium = 0;

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

const maxScale = 100;
const minScale = 0;

const leftScroll = (myChart, maxScale) => {
  myChart.options.scales.x.min -= maxScale;
  myChart.options.scales.x.max -= maxScale;
  myChart.update();
};
const rightScroll = (myChart, maxScale) => {
  myChart.options.scales.x.min += maxScale;
  myChart.options.scales.x.max += maxScale;
  myChart.update();
};

window.addEventListener("DOMContentLoaded", (event) => {
  const labels = [];
  const data = [];
  const connectButton = document.getElementById("start-load");
  const loader = document.getElementById("connect-loader");
  const linkContainer = document.getElementById("link-container");
  const connected = document.getElementById("connected");
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const updateButton = document.getElementById("update");

  const leftBtn = document.getElementById("left");
  const rightBtn = document.getElementById("right");

  const link1 = document.getElementById("link1");
  const link2 = document.getElementById("link2");
  const link3 = document.getElementById("link3");
  const link4 = document.getElementById("link4");
  const link5 = document.getElementById("link5");
  const link6 = document.getElementById("link6");

  leftBtn.addEventListener("click", () => {
    leftScroll(myChart, 50);
  });
  rightBtn.addEventListener("click", () => {
    rightScroll(myChart, 50);
  });

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

  let interval;
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

  stopButton.addEventListener("click", () => {
    console.log("stop");
    clearInterval(interval);
  });

  updateButton.addEventListener("click", () => {
    // updateConfigByMutating(myChart);
    // chart.update();
  });

  const addData = (chart, label, data) => {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  };

  startButton.addEventListener("click", () => {
    console.log("start");

    let second = 0;
    let scrollCounter = 0;

    interval = setInterval(() => {
      if (isBad > 0) {
        addData(myChart, String(second), { time: second, value: { value: getRandomIntInclusive(1, 20), q: 1 } });
      } else if (ismedium > 0) {
        addData(myChart, String(second), { time: second, value: { value: getRandomIntInclusive(1, 20), q: 2 } });
      } else {
        addData(myChart, String(second), { time: second, value: { value: getRandomIntInclusive(1, 20), q: 3 } });
      }
      // if (scrollCounter === 35) {
      //   rightScroll(myChart, maxScale);
      //   myChart.update();
      //   scrollCounter = 0;
      // }
      second++;
      // scrollCounter++;
    }, 300);
  });
  const ctx = document.getElementById("myChart").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "eeg marker",
          // data: [
          //   { time: "0", value: { value: 13, q: 2 } },
          //   { time: "1", value: { value: 6, q: 1 } },
          //   { time: "2", value: { value: 13, q: 2 } },
          //   { time: "3", value: { value: 6, q: 1 } },
          // ],
          // data: data,
          // spanGaps: false,
          segment: {
            borderColor: (context) => {
              console.log(context);
              if (context.p0.raw.value.q === 3) {
                return "lightgreen";
              } else if (context.p0.raw.value.q === 2) {
                return orangeColor;
              } else return "rgb(255, 99, 132)";
            },
          },
        },
      ],
    },
    options: {
      // animation: false,
      scales: {
        y: {
          beginAtZero: true,
        },
        // scales: {
        //   xAxes: [{
        //     stacked: false,
        //     ticks: {

        //     },
        //   }],
        x: {
          autoSkip: false,
          tacked: false,
          // max: maxScale,
          // min: minScale,
        },
      },
      parsing: {
        xAxisKey: "time",
        yAxisKey: "value.value",
      },
      // xAxes: [
      //   {
      //     stacked: false,
      //     min: 100,
      //     max: 200,
      //     ticks: {
      //       stacked: false,
      //       autoSkip: false,
      //     },
      //   },
      // ],
      responsive: true,
      // maintainAspectRatio: true,
      // bezierCurve: false,
      // scaleShowValues: true,
    },
  });
});
