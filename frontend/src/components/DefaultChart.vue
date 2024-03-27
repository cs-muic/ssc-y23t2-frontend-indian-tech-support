<template>
  <div class="graph">
    <Bar :data="barChartData" :options="barChartOptions" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";

import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  BarElement,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels,
  PointElement
);
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
  format,
} from "date-fns";
import { Bar } from "vue-chartjs";

const currentDate = new Date();
const startofYear = new Date(currentDate.getFullYear(), 0, 2);
const startDate = ref(startofYear.toISOString().split("T")[0]);
const endDate = ref(currentDate.toISOString().split("T")[0]);
const timeframe = ref("Month");
const graphData = ref(null);
const graphData2 = ref(null);
const graphLabels = ref([]);
const graphValues = ref([]);
const graphValues2 = ref([]);

async function fetchGraphData(startDate, endDate, transactionType, timeframe) {
  try {
    const response = await axios.get("/api/transactions/graph-data/no-tags", {
      params: {
        startDate: startDate,
        endDate: endDate,
        transactionType: transactionType,
        dateFormat: timeframe,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return error.response.data;
  }
}

const createChart = async () => {
  graphData.value = await fetchGraphData(
    startDate.value,
    endDate.value,
    "EXPENDITURE",
    timeframe.value
  );

  graphData2.value = await fetchGraphData(
    startDate.value,
    endDate.value,
    "INCOME",
    timeframe.value
  );

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  let labels = [];

  if (timeframe.value === "Day") {
    const days = eachDayOfInterval({ start, end });
    labels = days.map((day) => format(day, "yyyy-MM-dd"));
  } else if (timeframe.value === "Month") {
    const months = eachMonthOfInterval({
      start: startOfMonth(start),
      end: endOfMonth(end),
    });
    labels = months.map((month) => format(month, "yyyy-MM"));
  } else if (timeframe.value === "Year") {
    const years = eachYearOfInterval({
      start: startOfYear(start),
      end: endOfYear(end),
    });
    labels = years.map((year) => format(year, "yyyy"));
  }

  graphLabels.value = labels;

  graphValues.value = graphLabels.value.map((label) => {
    const item = graphData.value.data.find((item) => item[0] === label);
    return item ? item[1] : 0;
  });

  graphValues2.value = graphLabels.value.map((label) => {
    const item = graphData2.value.data.find((item) => item[0] === label);
    return item ? item[1] : 0;
  });
};

const barChartData = computed(() => ({
  labels: graphLabels.value,
  datasets: [
    {
      label: "Expense",
      backgroundColor: "#e03454",
      data: graphValues.value,
    },
    {
      label: "Income",
      backgroundColor: "#22c405",
      data: graphValues2.value,
    },
  ],
}));

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: "#ffffff",
      display: function (context) {
        return context.dataset.data[context.dataIndex] > 0;
      },
      font: {
        weight: "bold",
      },
      formatter: Math.round,
    },
  },
});

onMounted(async () => {
  await createChart();
});
</script>

<style scoped>
.graph {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>
