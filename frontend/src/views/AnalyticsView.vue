<template>
  <div class="analytics-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <div class="main-content">
      <!--      Sidebar for viewing income/expenditure by category-->
      <div class="sidebar">
        <div class="amount">
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
          <ul>
            <li v-for="(value, key) in tagStats" :key="key">
              Tag: {{ key }}, Amount Spent: {{ value[1] }}
            </li>
          </ul>

          <!--          Lists down all the tags and how much income and expenditure has been done on them-->
          <!--          represented with a bar -->
        </div>
      </div>

      <!--      Main content section-->
      <div class="content">
        <!-- Filters section -->
        <div class="filters">
          <h2>Filters</h2>
          <!-- Filters content... -->
        </div>

        <!-- Graph section -->
        <div class="graph">
          <h2>Graph</h2>
          <!-- Graph content... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { computed, ref, watch } from "vue";
import axios from "axios";
// import axios from "axios";

const incomeExpense = ref("Income");
// eslint-disable-next-line no-unused-vars
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
  height: 100px; /* Adjust as needed */
  background-color: #ffffff;
}

.graph {
  height: 450px; /* Adjust as needed */
  background-color: #ffffff;
  margin-top: 10px;
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
