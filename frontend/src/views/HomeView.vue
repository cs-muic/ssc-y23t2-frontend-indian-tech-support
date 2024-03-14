<template>
  <div class="home-view">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Center Content Section -->
      <div class="center-content">
        <!-- Overview Cards Section -->
        <div class="overview-cards">
          <div class="card">Expenses</div>
          <div class="card">Balance</div>
          <div class="card">Revenues</div>
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
import NavbarComponent from "../components/NavbarComponent.vue";
export default {
  name: "Home",
  components: {
    NavbarComponent,
  },
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.navbar {
  padding: 20px;
  background-color: #f8f9fa;
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
  background-color: #e9ecef;
  padding: 40px;
  text-align: center;
  font-size: 1.5rem;
}

.budget-graph,
.categories-expense {
  flex: 1;
  background-color: #f1f3f5;
  padding: 40px;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.shortcuts-section {
  width: 300px; /* Increased width */
  background-color: #e9ecef;
  padding: 40px;
  text-align: center;
  font-size: 1.5rem;
}
</style>
