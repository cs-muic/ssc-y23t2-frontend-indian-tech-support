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
            <p>{{ item.value }}</p>
          </div>
        </div>

        <!-- Budget Graph Section -->
        <div class="budget-graph">
          <h2>Budget: Graph</h2>
          <!-- Placeholder for budget graph -->
        </div>

        <!-- Categories with Biggest Expense Section -->
        <div class="categories-expense">
          <h2>Categories: Biggest Expenses</h2>
          <!-- Placeholders for categories -->
        </div>
      </div>

      <!-- Shortcuts Section -->
      <aside class="shortcuts-section">
        <h2>Shortcuts</h2>
        <!-- Placeholder for shortcuts -->
      </aside>
    </div>
  </div>
</template>

<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
import axios from "axios";
export default {
  name: "Home",
  components: {
    NavbarComponent,
  },
  data: () => ({
    userName: "",
    overviewItems: [
      { title: "Expenses", value: "$1,200" },
      { title: "Balance", value: "$5,000" },
      { title: "Revenues", value: "$6,200" },
    ],
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
  flex-grow: 1;
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

.overview-cards .card:hover {
  transform: translateY(-5px);
}

.budget-graph,
.categories-expense {
  background-color: #f7fafc; /* Slightly different shade for distinction */
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.shortcuts-section {
  width: 300px; /* Unchanged width */
  background-color: #e2e8f0; /* Softer shade */
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  margin-right: 20px; /* Add right margin */
  margin-bottom: 20px; /* Add right margin */
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
