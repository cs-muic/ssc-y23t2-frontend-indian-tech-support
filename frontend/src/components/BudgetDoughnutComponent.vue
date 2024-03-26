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
      <input
        type="text"
        v-model="setBudget"
        placeholder="Set Monthly Budget"
        pattern="^\d*(\.\d{0,2})?$"
      />
      <input
        type="text"
        v-model="setTarget"
        placeholder="Set Monthly Target"
        pattern="^\d*(\.\d{0,2})?$"
      />
      <button @click="submitTargetBudget">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { ref, onMounted } from "vue";
import axios from "axios";
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
// const currentExpense = ref(0);
// const currentIncome = ref(0);

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
  labels: ["Budget", "Target"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#cb3054"],
      data: [finalBudget, finalTarget],
      color: "#ffffff",
    },
  ],
};

const targetData = ref({
  labels: ["Alternate Target", "Alternate Budget"],
  datasets: [
    {
      backgroundColor: ["#ff7400", "#052eef"],
      data: [finalTarget, finalBudget],
      color: "#ffffff",
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: function () {
    showBudget.value = !showBudget.value;
  },
};

onMounted(fetchTargetBudget);
</script>
<style scoped>
.doughnut-container {
  max-width: 350px; /* Adjust as needed */
  max-height: 200px; /* Adjust as needed */
}
</style>
