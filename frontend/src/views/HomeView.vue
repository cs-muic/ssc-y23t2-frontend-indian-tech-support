<template>
  <div class="home-view">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <NavbarComponent />
    </nav>
    <div class="user-greeting">
      <h1 class="greeting-text">
        {{ greeting }}, <span class="user-name">{{ userName }}</span
        >!
      </h1>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Center Content Section -->
      <div class="center-content">
        <!-- Overview Cards Section -->
        <div class="overview-cards">
          <div class="card" v-for="item in overviewItems" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p
              :class="{
                'positive-balance': item.title === 'Balance' && item.value >= 0,
                'negative-balance': item.title === 'Balance' && item.value < 0,
              }"
            >
              {{
                item.title === "Balance"
                  ? item.value >= 0
                    ? item.value.toFixed(2)
                    : "-" + Math.abs(item.value).toFixed(2)
                  : item.value
              }}
            </p>
          </div>
        </div>

        <!-- Budget Graph Section -->
        <div class="budget-graph">
          <div class="budgetTarget">
            <BudgetDoughnutComponent />
          </div>
          <div class="expenseGraph">
            <DefaultChart />
          </div>
        </div>

        <!-- Categories with Biggest Expense Section -->
        <div class="categories-expense">
          <h2>Categories: Biggest Expenses</h2>
        </div>
      </div>

      <!-- Shortcuts Section -->
      <aside class="shortcuts-section">
        <h2>Shortcuts</h2>
      </aside>
    </div>
  </div>
</template>

<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
import axios from "axios";
import BudgetDoughnutComponent from "@/components/BudgetDoughnutComponent.vue";
import DefaultChart from "@/components/DefaultChart.vue";

export default {
  name: "Home",
  components: {
    DefaultChart,
    BudgetDoughnutComponent,
    NavbarComponent,
  },
  data: () => ({
    userName: "",
    overviewItems: [],
  }),
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    },
  },
  mounted() {
    axios
      .get("/api/whoami")
      .then((response) => {
        this.userName = response.data.displayName;
      })
      .catch((error) => {
        console.error("Error fetching user info:", error.message);
      });
    axios
      .get("/api/user/weekly-finance-summary")
      .then((response) => {
        const data = response.data;
        this.overviewItems = [
          { title: "Expenses", value: data.totalExpenditure },
          { title: "Balance", value: data.balance },
          { title: "Revenues", value: data.totalIncome },
        ];
      })
      .catch((error) => {
        console.error("Error fetching financial summary:", error.message);
      });
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}

.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

.user-greeting .greeting-text {
  font-size: 2rem;
  text-align: center;
  animation: fadeIn 2s ease-in-out;
}

.user-name {
  color: #ffd700; /* Gold color for username */
}

.main-content {
  display: flex;
  flex-grow: 1;
}

.center-content {
  width: 90%;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.overview-cards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.overview-cards .card {
  flex: 1;
  margin: 0 10px;
  background-color: #f0f4f8; /* Lighter shade */
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.overview-cards .card p {
  font-size: 1.5rem; /* Increasing size to make text more pronounced */
  font-weight: 500; /* Slightly bolder text for better visibility */
  margin-top: 10px; /* Added space between title and value */
}

.overview-cards .card:hover {
  transform: translateY(-5px);
}

.categories-expense {
  background-color: #f7fafc; /* Slightly different shade for distinction */
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.shortcuts-section {
  width: 300px;
  background-color: #e2e8f0; /* Softer shade */
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  margin-right: 20px; /* Add right margin */
  margin-bottom: 20px; /* Add right margin */
}

.budget-graph {
  display: flex;
  padding: 10px;
  text-align: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-bottom: 20px;
}

.budgetTarget {
  padding-top: 10px;
  background-color: #f7fafc;
  width: 350px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Add shadow effect */ /* Prevents the div from shrinking */
  overflow: auto;
}

.expenseGraph {
  background-color: #f7fafc;
  height: 275px; /* Adjust as needed */
  width: 750px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Add shadow effect */
  margin-left: 20px;
}

.positive-balance {
  color: green;
}

.negative-balance {
  color: red;
}

.budgetTarget > * {
  transform: scale(1); /* Adjust as needed */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
