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
          <div class="expense-items" v-if="topExpenditures.length > 0">
            <div
              class="expense-item"
              v-for="expense in topExpenditures"
              :key="expense.tagId"
            >
              <div class="category-name">{{ expense.tagName }}</div>
              <div class="category-value">
                ${{ expense.totalExpenditure.toFixed(2) }}
              </div>
            </div>
          </div>
          <!-- Message displayed when there are no biggest expenses -->
          <div v-else class="no-data-message">Wow, you sure save a lot!</div>
        </div>
      </div>

      <!-- Favourites Section -->
      <aside class="favorites-section">
        <h2>Favorites</h2>
        <div class="favorites-container" v-if="favoritesData.length > 0">
          <button
            v-for="favorite in favoritesData"
            :key="favorite.id"
            :class="{
              'favorite-button': true,
              income: favorite.transactionType === 'INCOME',
              expenditure: favorite.transactionType === 'EXPENDITURE',
            }"
            :style="{
              backgroundImage: favorite.resourceURI
                ? `url(${favorite.resourceURI})`
                : '',
            }"
            @click="navigateWithFavorite(favorite)"
          >
            {{ favorite.notes }}
          </button>
        </div>
        <!-- Message displayed when there are no favorites -->
        <div v-else class="no-data-message">No shortcuts yet.</div>
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
    topExpenditures: [],
    favoritesData: [],
  }),
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    },
  },
  async mounted() {
    await axios
      .get("/api/whoami")
      .then((response) => {
        this.userName = response.data.displayName;
      })
      .catch((error) => {
        console.error("Error fetching user info:", error.message);
      });
    await axios
      .get("/api/user/weekly-finance-summary")
      .then((response) => {
        const data = response.data;
        this.overviewItems = [
          { title: "Expenses", value: data.totalExpenditure || 0 },
          { title: "Balance", value: data.balance || 0 },
          { title: "Revenues", value: data.totalIncome || 0 },
        ];
      })
      .catch((error) => {
        console.error("Error fetching financial summary:", error.message);
      });
    await axios
      .get("/api/user/top-expenditures")
      .then((response) => {
        this.topExpenditures = response.data.data || [];
      })
      .catch((error) => {
        console.error("Error fetching top expenditures:", error.message);
      });
    await axios
      .get("/api/transaction-blueprints/get-transaction-blueprints/favorites")
      .then((response) => {
        this.favoritesData = response.data.transactionBlueprintsList || [];
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        alert("Failed to fetch favorites.");
      });
  },
  methods: {
    // In a method within your Vue component
    navigateWithFavorite(favorite) {
      this.$router.push({
        path: "/income-expense-creation",
        query: { favoriteData: JSON.stringify(favorite) },
      });
    },
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

.categories-expense {
  background-color: #f7fafc;
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.expense-items {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(220px, 1fr)
  ); /* Responsive grid */
  gap: 20px; /* Consistent spacing */
  padding: 20px 0; /* Extra vertical spacing */
}

.expense-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.expense-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.category-name {
  font-size: 1rem; /* Increased font size for better readability */
  color: #333;
  font-weight: 600;
  margin-bottom: 10px; /* Adjusted spacing */
}

.category-value {
  font-size: 1.25rem; /* Larger font size for emphasis */
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.favorites-section {
  padding: 20px;
  background-color: #e2e8f0; /* Soft background color for the section */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  margin: 20px; /* Ensure some spacing around the section */
  text-align: center; /* Center the title and content */
}

.favorites-container {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center buttons horizontally */
  gap: 10px; /* Space between buttons */
}

.favorite-button {
  padding: 10px 20px;
  color: white; /* Text color */
  border: none; /* Remove default border */
  border-radius: 4px; /* Rounded corners */
  cursor: pointer; /* Cursor indication for clickable elements */
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
  font-size: 0.9rem; /* Adjusted text size for better fit */
  background-size: cover; /* Cover background for images */
  background-position: center; /* Center background images */
  text-align: center; /* Ensure text is centered */
  width: 80%; /* Define a standard width for uniformity */
}

.income {
  background-color: #4caf50; /* Green background for income */
}

.expenditure {
  background-color: #f44336; /* Red background for expenditure */
}

.favorite-button:hover {
  opacity: 0.9; /* Slight opacity change on hover for feedback */
}

.budgetTarget > * {
  transform: scale(1); /* Adjust as needed */
}

.no-data-message {
  text-align: center;
  color: #777; /* Grey text */
  margin-top: 20px; /* Spacing from the title */
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
