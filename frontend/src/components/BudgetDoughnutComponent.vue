<template>
  <div class="doughnut-container">
    <Doughnut :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
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

const data = {
  labels: ["VueJs", "EmberJs"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#cb3054"],
      data: [40, 20],
      color: "#ffffff",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: "#ffffff",
    },
  },
};
</script>
<style scoped>
.doughnut-container {
  max-width: 350px; /* Adjust as needed */
  max-height: 200px; /* Adjust as needed */
}
</style>
