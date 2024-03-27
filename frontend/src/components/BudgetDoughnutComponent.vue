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
    <button class="edit-button" @click="showFields = !showFields">
      {{ finalBudget !== 0 && finalTarget !== 0 ? "Edit" : "Create" }}
      Target/Budget
    </button>
    <div class="fields" v-if="showFields">
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
      <button class="submit-button" @click="submitTargetBudget">Submit</button>
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
      backgroundColor: ["#23ce0b", "#073301"],
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
  align-items: center;
}

.edit-button {
  margin-top: 10px; /* Adjust as needed */
  border: 2px solid #ffffff; /* Change border color to white and increase thickness */
  border-radius: 10px; /* Round the corners */
  padding: 2px; /* Add some padding to loosen the box */
  transition: transform 0.3s ease; /* Smooth transition for hover effect */
  background-color: #ffffff; /* Change background color to white */
  outline: 1px solid #000000; /* Add black outline */
}

.edit-button:hover {
  transform: scale(
    1.05
  ); /* Make the button slightly larger when hovering over it */
}

.fields {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 2px;
  margin: 5px;
  gap: 10px; /* Adjust as needed */
}

.fields label {
  font-weight: bold;
  margin-bottom: 3px; /* Adjust as needed */
}

.fields input {
  width: 100%;
  padding: 5px; /* Adjust as needed */
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  align-items: center;
  margin-top: 1px; /* Adjust as needed */
  border: 1px solid #ffffff; /* Change border color to white and increase thickness */
  border-radius: 10px; /* Round the corners */
  padding: 1px; /* Add some padding to loosen the box */
  transition: transform 0.3s ease; /* Smooth transition for hover effect */
  background-color: #ffffff; /* Change background color to white */
  outline: 1px solid #000000; /* Add black outline */
}
</style>
