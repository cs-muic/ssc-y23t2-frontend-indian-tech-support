<template>
  <div class="top-half-content">
    <nav class="navbar">
      <NavbarComponent />
    </nav>
    <!-- Recurring data table -->
    <table class="recurring-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Primary Tag</th>
          <th>Secondary Tag</th>
          <th>Notes</th>
          <th>Date & Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in historyData" :key="item.id">
          <td>{{ item.type }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.tagId }}</td>
          <td>{{ item.tagId2 }}</td>
          <td>{{ item.notes }}</td>
          <td>{{ item.timestamp }}</td>
          <td>
            <button class="action-button edit" @click="editTransaction(item)">
              Edit
            </button>
            <button
              class="action-button delete"
              @click="deleteTransaction(item.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<script>
import axios from "axios";

export default {
  data() {
    return {
      historyData: [],
    };
  },
  mounted() {
    this.fetchTransactionData();
  },
  methods: {
    async fetchTransactionData() {
      try {
        const response = await axios.get("/api/history");
        // Extract transactions from the response data
        this.historyData = response.data.transactions;
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    },
    async editTransaction(item) {
      // Handle edit action here
      console.log("Editing transaction:", item);
    },
    async deleteTransaction(id) {
      // Handle delete action here
      console.log("Deleting transaction with ID:", id);
    },
  },
};
</script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}
</style>
