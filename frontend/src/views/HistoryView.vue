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
        <tr v-for="(item, index) in historyData" :key="item.id">
          <template v-if="!item.editing">
            <td>{{ item.type }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.tagId }}</td>
            <td>{{ item.tagId2 }}</td>
            <td>{{ item.notes }}</td>
            <td>{{ item.timestamp }}</td>
            <td>
              <button class="action-button edit" @click="toggleEdit(index)">
                Edit
              </button>
              <button
                class="action-button delete"
                @click="deleteTransaction(item.id)"
              >
                Delete
              </button>
            </td>
          </template>
          <template v-else>
            <td><input v-model="item.type" /></td>
            <td><input v-model="item.value" /></td>
            <td><input v-model="item.tagId" /></td>
            <td><input v-model="item.tagId2" /></td>
            <td><input v-model="item.notes" /></td>
            <td><input v-model="item.timestamp" /></td>
            <td>
              <button
                class="action-button save"
                @click="saveTransaction(item, index)"
              >
                Save
              </button>
              <button class="action-button cancel" @click="toggleEdit(index)">
                Cancel
              </button>
            </td>
          </template>
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
        this.historyData = response.data.transactions.map((item) => ({
          ...item,
          editing: false,
        }));
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    },
    toggleEdit(index) {
      this.historyData[index].editing = !this.historyData[index].editing;
    },
    async saveTransaction(item, index) {
      try {
        var bodyFormData = new FormData();
        bodyFormData.append("id", item.id);
        bodyFormData.append("editType", "EDIT");
        bodyFormData.append("tagId", item.tagId);
        bodyFormData.append("tagId2", item.tagId2);
        bodyFormData.append("type", item.type);
        bodyFormData.append("notes", item.notes);
        bodyFormData.append("value", item.value);
        bodyFormData.append("timestamp", item.timestamp);

        const response = await axios({
          method: "post",
          url: "/api/history",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then(function (response) {
            //handle success
            console.log(response);
            parent.location.reload();
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });

        // Assuming the response contains updated transaction data
        this.historyData[index] = response.data.transactions;
        this.historyData[index].editing = false;
      } catch (error) {
        console.error("Error saving transaction:", error);
      }
    },
    async deleteTransaction(id) {
      // Handle delete action here
      console.log("Deleting transaction with ID:", id);
      var bodyFormData = new FormData();
      bodyFormData.append("id", id);
      bodyFormData.append("editType", "DELETE");
      await axios({
        method: "post",
        url: "/api/history",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          console.log(response);
          parent.location.reload();
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    },
  },
};
</script>

<style scoped>
/* Existing styles */

.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

.toggle-container button {
  flex: 1;
  padding: 10px 0;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: bold;
  outline: none;
}

.toggle-container button.active {
  box-shadow: 0 4px 2px -2px gray;
  border-color: #ccc;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 5px;
}

.custom-checkbox input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
  transform: scale(1.2); /* Make checkboxes slightly larger */
}

.recurring-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.recurring-table th,
.recurring-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.recurring-table th {
  background-color: #eee;
}

.action-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  cursor: pointer;
}

.action-button.save {
  background-color: #28a745;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.save:hover {
  background-color: #218838;
}

.action-button.edit {
  background-color: yellow;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.edit:hover {
  background-color: darkgoldenrod;
}

.action-button.delete {
  background-color: red;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.delete:hover {
  background-color: darkred;
}

.action-button.cancel {
  background-color: red;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.cancel:hover {
  background-color: darkred;
}
</style>
