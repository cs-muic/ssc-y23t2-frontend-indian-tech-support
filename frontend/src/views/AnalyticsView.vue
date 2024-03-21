<template>
  <div class="analytics-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <div class="main-content">
      <!--      Sidebar for viewing income/expenditure by category-->
      <div class="sidebar">
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
              Tag: {{ value[0] }}, Amount Spent: {{ value[1] }}
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
              <select v-model="chartType">
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
              Tag 1:
              <select v-model="selectedTag1">
                <option v-for="(value, key) in tags" :key="key" :value="key">
                  {{ key }}
                </option>
              </select>
            </label>
            <label>
              Tag 2:
              <select v-model="selectedTag2">
                <option v-for="(value, key) in tags" :key="key" :value="key">
                  {{ key }}
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
              <select v-model="transactionType">
                <option value="EXPENDITURE">Expenses</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label>
              Tag 1:
              <select v-model="selectedTag1">
                <option v-for="(value, key) in tags" :key="key" :value="key">
                  {{ key }}
                </option>
              </select>
            </label>
            <label>
              Tag 2:
              <select v-model="selectedTag2">
                <option v-for="(value, key) in tags" :key="key" :value="key">
                  {{ key }}
                </option>
              </select>
            </label>
          </div>
        </div>
        <!-- Graph section -->
        <div class="graph">
          <h2>Graph</h2>
          <Bar :data="chartData" :options="chartOptions" />
          <h1>{{ graphData }}</h1>
          <h1>{{ graphLabels }}</h1>
          <h1>{{ graphValues }}</h1>

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
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const currentDate = new Date();
const startOfYear = new Date(currentDate.getFullYear(), 0, 2);
const startDate = ref(startOfYear.toISOString().split("T")[0]);
const endDate = ref(currentDate.toISOString().split("T")[0]);
const chartType = ref("line");
// const selectedTag1 = ref("None");
// const selectedTag2 = ref("None");
const timeframe = ref("Day");
const transactionType = ref("EXPENDITURE");
const showFilters = ref(false);
const graphData = ref(null);
const graphLabels = ref([]);
const graphValues = ref([]);

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
    transactionType.value,
    timeframe.value
  );

  graphLabels.value = graphData.value.data.map((item) => item[0]);
  graphValues.value = graphData.value.data.map((item) => item[1]);
};

const chartData = computed(() => ({
  labels: graphLabels.value,
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: graphValues.value,
    },
  ],
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

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

const compareText = ref("+ Compare");

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
</style>
