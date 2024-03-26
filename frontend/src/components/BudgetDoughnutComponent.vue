<template>
  <div class="doughnut-container">
    <Doughnut
      v-if="finalBudget && finalTarget && !showFields && showBudget"
      :data="budgetData"
      :options="options"
    />
    <Doughnut
      v-else-if="finalBudget && finalTarget && !showFields && !showBudget"
      :data="targetData"
      :options="options"
    />
    <button @click="showFields = !showFields">
      {{ finalBudget !== 0 && finalTarget !== 0 ? "Edit" : "Create" }}
      Target/Budget
    </button>
    <div v-if="showFields">
      <label>Monthly Budget: </label>
      <input
        type="text"
        v-model="setBudget"
        :placeholder="1000"
        pattern="^\d*(\.\d{0,2})?$"
      />
      <label>Monthly Target: </label>
      <input
        type="text"
        v-model="setTarget"
        :placeholder="1000"
        pattern="^\d*(\.\d{0,2})?$"
      />
      <button @click="submitTargetBudget">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);
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
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip
);

const targetBudget = ref(null);
const showFields = ref(false);
let showBudget = ref(true);
const setBudget = ref("");
const setTarget = ref("");
const finalBudget = ref(0);
const finalTarget = ref(0);
const currentExpense = ref(0);
const currentIncome = ref(0);
const budgetLeft = computed(() =>
  Math.max(0, finalBudget.value - currentExpense.value)
);
const targetLeft = computed(() =>
  Math.max(0, finalTarget.value - currentIncome.value)
);
const currentMonth = new Date().getMonth() + 1;

const fetchIncomeAmount = async () => {
  try {
    const response = await axios.get(
      `/api/transactions/INCOME/${currentMonth}`
    );
    currentIncome.value = response.data.totalAmount;
  } catch (error) {
    currentIncome.value = 0;
  }
};

const fetchExpenditureAmount = async () => {
  try {
    const response = await axios.get(
      `/api/transactions/EXPENDITURE/${currentMonth}`
    );
    currentExpense.value = response.data.totalAmount;
  } catch (error) {
    currentExpense.value = 0;
  }
};

const fetchTargetBudget = async () => {
  try {
    const response = await axios.get("/api/targetBudget");
    targetBudget.value = response.data;
    finalBudget.value = targetBudget.value.budget;
    finalTarget.value = targetBudget.value.target;
  } catch (error) {
    targetBudget.value = error.response.data;
  }
};

const submitTargetBudget = async () => {
  try {
    finalBudget.value = parseFloat(setBudget.value);
    finalTarget.value = parseFloat(setTarget.value);
    showFields.value = false;
    await axios.post("/api/createTargetBudget", null, {
      params: {
        userBudget: finalBudget.value,
        userTarget: finalTarget.value,
      },
    });
    await fetchTargetBudget();
  } catch (error) {
    // handle error
  }
};

const budgetData = {
  labels: ["Expenses", "Budget Left"],
  datasets: [
    {
      backgroundColor: ["#cb3054", "#3f101b"],
      data: [currentExpense, budgetLeft],
      color: "#ffffff",
    },
  ],
};

const targetData = ref({
  labels: ["Incomes", "Target Left"],
  datasets: [
    {
      backgroundColor: ["#27f507", "#073301"],
      data: [currentIncome, targetLeft],
      color: "#ffffff",
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: "#ffffff",
      display: true,
      align: "center",
      anchor: "center",
      formatter: function (value, context) {
        return context.chart.data.datasets[0].data[context.dataIndex].value;
      },
    },
  },
  onClick: function () {
    showBudget.value = !showBudget.value;
  },
};

onMounted(async () => {
  await fetchIncomeAmount();
  await fetchExpenditureAmount();
  await fetchTargetBudget();
});
</script>
<style scoped>
.doughnut-container {
  max-width: 350px; /* Adjust as needed */
  max-height: 200px; /* Adjust as needed */
}
</style>
