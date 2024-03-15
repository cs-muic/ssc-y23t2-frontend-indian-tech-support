<template>
  <div class="analytics-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <div class="main-content">
      <!--      Sidebar for viewing income/expenditure by category-->
      <div class="sidebar">
        <div class="amount">
          <h2>Amount</h2>
          <!--          Displays the amount-->
        </div>
        <div class="category">
          <h2>Buttons</h2>
          <!--        Drop down for months, dropdown for Category-->
        </div>
        <div class="tag-stats">
          <h2>Tag Stats</h2>
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
</style>
