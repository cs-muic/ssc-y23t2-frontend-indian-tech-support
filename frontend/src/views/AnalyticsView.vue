<template>
  <div class="analytics-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <div class="main-content">
      <!--        <BudgetDoughnutComponent />-->
      <!--      Sidebar for viewing income/expenditure by category-->
      <div class="sidebar">
        <div class="donut">
          <!--          Displays the donut chart-->
          <BudgetDoughnutComponent />
        </div>
        <div class="amount">
          <h2>Amount:</h2>
          <h2>{{ totalAmount }}</h2>
          <!--          Displays the amount-->
        </div>
        <div class="category">
          <button @click="toggleIncomeExpense">{{ incomeExpense }}</button>
          <select v-model="selectedMonth">
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="month"
            >
              {{ month }}
            </option>
          </select>
          <!--        Drop down for months, dropdown for Category-->
        </div>
        <div class="tag-stats">
          <h2>Tag Stats</h2>
          <!--          Lists down all the tags and how much income and expenditure has been done on them-->
          <!--          represented with a bar -->
          <ul>
            <li v-for="(value, key) in tagStats" :key="key">
              {{ findTag(value[0]) }}, ${{ value[1] }}
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ width: (value[1] / totalAmount) * 100 + '%' }"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--      Main content section-->
      <div class="content">
        <!-- Filters section -->
        <div class="filters">
          <h2>Filters</h2>
          <div class="top-row">
            <label>
              Start Date:
              <input type="date" v-model="startDate" placeholder="Start Date" />
            </label>
            <label>
              End Date:
              <input type="date" v-model="endDate" placeholder="End Date" />
            </label>
            <label>
              Chart Type:
              <select v-model="selectedChartType">
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </label>
          </div>
          <div class="bottom-row">
            <label>
              Transaction Type:
              <select v-model="transactionType">
                <option value="EXPENDITURE">Expenses</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label>
              Primary Tag:
              <select v-model="selectedTag1">
                <option value="0" selected>- None -</option>
                <option
                  v-for="(tag, index) in primaryTags"
                  :key="index"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </label>
            <label>
              Secondary Tag:
              <select v-model="selectedTag2">
                <option value="0" selected>- None -</option>
                <option
                  v-for="(tag, index) in secondaryTags"
                  :key="index"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </label>
            <label>
              Timeframe:
              <select v-model="timeframe">
                <option value="Day">Day</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </label>
          </div>
          <div class="third-row">
            <button @click="toggleCompare">{{ compareText }}</button>
            <button @click="createChart">Create</button>
          </div>
          <!-- Filters content... -->
        </div>
        <div v-if="showFilters">
          <h3>Compare With</h3>
          <div class="bottom-row">
            <label>
              Transaction Type:
              <select v-model="compareTransactionType">
                <option value="EXPENDITURE">Expenses</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label>
              Primary Tag:
              <select v-model="compareTag1">
                <option value="0" selected>- None -</option>
                <option
                  v-for="(tag, index) in primaryTags"
                  :key="index"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </label>
            <label>
              Secondary Tag:
              <select v-model="compareTag2">
                <option value="0" selected>- None -</option>
                <option
                  v-for="(tag, index) in secondaryTags"
                  :key="index"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </label>
          </div>
        </div>
        <!-- Graph section -->
        <div class="graph">
          <h2>Graph</h2>
          <Line
            v-if="chartType === 'line'"
            :data="lineChartData"
            :options="lineChartOptions"
          />
          <Bar v-else :data="barChartData" :options="barChartOptions" />
          <!-- Graph content... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import NavbarComponent from "@/components/NavbarComponent.vue";
import { Bar, Line } from "vue-chartjs";

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
import primaryTags from "@/assets/Tags.json";
import secondaryTags from "@/assets/Tags2.json";
import BudgetDoughnutComponent from "@/components/BudgetDoughnutComponent.vue";

const currentDate = new Date();
const startofYear = new Date(currentDate.getFullYear(), 0, 2);
const startDate = ref(startofYear.toISOString().split("T")[0]);
const endDate = ref(currentDate.toISOString().split("T")[0]);
const chartType = ref("bar");
const selectedChartType = ref("bar");
const selectedTag1 = ref("0");
const selectedTag2 = ref("0");
const compareTag1 = ref("0");
const compareTag2 = ref("0");
const timeframe = ref("Month");
const transactionType = ref("EXPENDITURE");
const compareTransactionType = ref("EXPENDITURE");
const showFilters = ref(false);
const graphData = ref(null);
const graphData2 = ref(null);
const graphLabels = ref([]);
const graphValues = ref([]);
const graphValues2 = ref([]);
const compareText = ref("+ Compare");

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

async function fetchGraphDataWithTags(
  startDate,
  endDate,
  transactionType,
  timeframe,
  selectedTag1,
  selectedTag2
) {
  try {
    const response = await axios.get("/api/transactions/graph-data/tags", {
      params: {
        startDate: startDate,
        endDate: endDate,
        transactionType: transactionType,
        dateFormat: timeframe,
        primaryTag: selectedTag1,
        secondaryTag: selectedTag2,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return error.response.data;
  }
}

const findTag = (id) => {
  const tag = primaryTags.find((tag) => tag.id === id.toString());
  return tag ? tag.name : "Tag not found";
};

const createChart = async () => {
  if (selectedTag1.value === "0" && selectedTag2.value === "0") {
    graphData.value = await fetchGraphData(
      startDate.value,
      endDate.value,
      transactionType.value,
      timeframe.value
    );
  } else {
    graphData.value = await fetchGraphDataWithTags(
      startDate.value,
      endDate.value,
      transactionType.value,
      timeframe.value,
      selectedTag1.value,
      selectedTag2.value
    );
  }

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

  chartType.value = selectedChartType.value;

  if (compareText.value === "- Compare") {
    if (compareTag1.value === "0" && compareTag2.value === "0") {
      graphData2.value = await fetchGraphData(
        startDate.value,
        endDate.value,
        compareTransactionType.value,
        timeframe.value
      );
    } else {
      graphData2.value = await fetchGraphDataWithTags(
        startDate.value,
        endDate.value,
        compareTransactionType.value,
        timeframe.value,
        compareTag1.value,
        compareTag2.value
      );
    }
    graphValues2.value = graphLabels.value.map((label) => {
      const item = graphData2.value.data.find((item) => item[0] === label);
      return item ? item[1] : 0;
    });
  } else {
    graphValues2.value = [];
  }
};

const barChartData = computed(() => {
  let datasets = [
    {
      label: "Amount 1",
      backgroundColor: "#4605ea",
      data: graphValues.value,
    },
  ];

  if (graphValues2.value.length !== 0) {
    datasets.push({
      label: "Amount 2",
      backgroundColor: "#ff7400",
      data: graphValues2.value,
    });
  }

  return {
    labels: graphLabels.value,
    datasets: datasets,
  };
});

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

// const lineChartData = computed(() => ({
//   labels: graphLabels.value,
//   datasets: [
//     {
//       label: "Data One",
//       borderColor: "#4605ea",
//       data: graphValues.value,
//       fill: false,
//     },
//   ],
// }));
const lineChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      borderColor: "#4605ea",
      data: [40, 39, 10, 40, 39, 80, 40],
      fill: true,
    },
  ],
};

// const lineChartOptions = ref({
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     datalabels: {
//       color: "#FFFFFF",
//       display: function (context) {
//         return context.dataset.data[context.dataIndex] > 0;
//       },
//       font: {
//         weight: "bold",
//       },
//       formatter: Math.round,
//     },
//   },
// });

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const incomeExpense = ref("Income");
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const selectedMonth = ref(currentMonth);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toggleIncomeExpense = () => {
  incomeExpense.value =
    incomeExpense.value === "Income" ? "Expenses" : "Income";
};

const incomeExpenseMapped = computed(() => {
  return incomeExpense.value === "Income" ? "INCOME" : "EXPENDITURE";
});

function mapMonthsToNumbers(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.indexOf(month) + 1;
}

const totalAmount = ref(0);
const fetchAmount = async () => {
  try {
    const response = await axios.get(
      `/api/transactions/${incomeExpenseMapped.value}/${mapMonthsToNumbers(
        selectedMonth.value
      )}`
    );
    totalAmount.value = response.data.totalAmount;
  } catch (error) {
    return 0;
  }
};

const toggleCompare = () => {
  showFilters.value = !showFilters.value;
  compareText.value =
    compareText.value === "+ Compare" ? "- Compare" : "+ Compare";
};

const tagStats = ref({});
const fetchTagStats = async () => {
  try {
    const response = await axios.get(
      `/api/transactions/${incomeExpenseMapped.value}/${mapMonthsToNumbers(
        selectedMonth.value
      )}/tag-stats`
    );
    tagStats.value = response.data.tagStats;
  } catch (error) {
    return 0;
  }
};
// Fetch graph data when component is mounted
onMounted(async () => {
  await createChart();
});

watch([selectedMonth, incomeExpense], fetchAmount, { immediate: true });
watch([selectedMonth, incomeExpense], fetchTagStats, { immediate: true });
</script>
<style scoped>
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

.main-content {
  display: flex;
  height: 100%;
}

.sidebar {
  height: 100%;
  margin-top: 20px;
  margin-left: 20px;
  width: 20%; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 20px; /* Adjust as needed */
  background-color: #e9ecef; /* Placeholder color */
}

.amount {
  height: 100px; /* Adjust as needed */
  background-color: #ffffff; /* Placeholder color */
}

.donut {
  height: 200px; /* Adjust as needed */
  background-color: #ffffff; /* Placeholder color */
}

.category {
  height: 50px; /* Adjust as needed */
  background-color: #ffffff; /* Placeholder color */
}

.tag-stats {
  height: 390px;
  background-color: #ffffff; /* Placeholder color */
}

.content {
  width: 80%; /* Adjust as needed */
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 20px; /* Adjust as needed */
  padding: 5px;
  background-color: #e9ecef; /* Placeholder color */
}

.category {
  display: flex;
  justify-content: center;
  align-items: center;
}

.filters {
  align-items: center;
  height: 200px; /* Adjust as needed */
  background-color: #ffffff;
}

.top-row,
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.filters input[type="date"],
.filters select {
  flex: 1;
  margin: 0 10px;
}

.third-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.third-row button {
  flex: 1;
  margin: 0 10px;
}

.graph {
  height: 550px; /* Adjust as needed */
  background-color: #ffffff;
  margin-top: 10px;
  padding: 5px;
}

h2 {
  margin-top: 5px;
  text-align: center;
}

button {
  width: 100px;
  height: 30px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 5px;
}

select {
  text-align: center;
  width: 100px;
  height: 30px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 5px;
}

.bar-container {
  background-color: #ccc;
  height: 20px;
}

.bar {
  background-color: #05b2f6;
  height: 100%;
}
</style>
