import express from "express";
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.get("/stocksNesr", async (req, res) => {
  const data = await getData();
  const cur = await getCurrentPrice();

  if (data) {
    const label = [];
    const ser = [];

    for (let item of data) {
      const time = formatDate(item.date);
      label.push(time);
      ser.push(item.close);
    }

    res.json({ label: label, data: ser });
  } else {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

async function getData() {
  try {
    const response = await fetch(
      "https://search.brave.com/api/rhfetch/stocks?symbol=NESR&range=ytd&exchange=NASDAQ"
    ); // Replace with your API URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.timeseries;
  } catch (error) {
    console.error("Fetch error:", error);
    return error;
  }
}

function formatDate(inputDate: any) {
  const date = new Date(inputDate);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

async function getCurrentPrice() {
  try {
    const response = await fetch(
      "https://search.brave.com/api/rhfetch/stocks?symbol=NESR&range=1d&exchange=NASDAQ"
    ); // Replace with your API URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return error;
  }
}

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
