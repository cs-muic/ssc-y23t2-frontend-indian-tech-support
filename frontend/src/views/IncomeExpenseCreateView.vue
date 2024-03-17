<template>
  <div class="income-expense-creation-view">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <!-- Toggle switch for the top half of the page -->
    <div class="toggle-container">
      <button
        :class="{ active: activeTab === 'shortcuts' }"
        @click="activeTab = 'shortcuts'"
      >
        Shortcuts
      </button>
      <button
        :class="{ active: activeTab === 'viewRecurring' }"
        @click="activeTab = 'viewRecurring'"
      >
        View Recurring
      </button>
    </div>

    <!-- Content for the top half of the page, changes based on active tab -->
    <div v-if="activeTab === 'shortcuts'" class="top-half-content">
      <!-- Sample shortcut buttons -->
      <button class="shortcut-button income">+ Income</button>
      <button class="shortcut-button expenditure">− Expenditure</button>
    </div>

    <div v-if="activeTab === 'viewRecurring'" class="top-half-content">
      <!-- Recurring data table -->
      <table class="recurring-table">
        <thead>
          <tr>
            <th>Name</th>
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
          <tr v-for="item in recurringData" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.tag }}</td>
            <td>{{ item.tag2 }}</td>
            <td>{{ item.notes }}</td>
            <td>{{ item.timestamp }}</td>
            <td>
              <button class="action-button edit">Edit</button>
              <button class="action-button delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form in the bottom half of the page -->
    <div class="form-container">
      <h2 class="form-title">Create New Transaction</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="type">Type</label>
          <select v-model="form.type" class="form-control" required>
            <option disabled value="">Select Type</option>
            <option value="INCOME">Income</option>
            <option value="EXPENDITURE">Expenditure</option>
          </select>
        </div>

        <div class="form-group">
          <label for="value">Amount</label>
          <input
            type="text"
            v-model="form.value"
            placeholder="e.g., 100.00"
            class="form-control"
            @blur="validateDecimal"
            required
          />
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input
            type="date"
            v-model="form.date"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="time">Time</label>
          <input type="time" v-model="form.time" class="form-control" />
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            v-model="form.notes"
            placeholder="Any relevant details"
            class="form-control"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="tag">Primary Tag</label>
          <select v-model="form.tagId" class="form-control" required>
            <option disabled value="">Select Primary Tag</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tag2">Secondary Tag</label>
          <select v-model="form.tagId2" class="form-control">
            <option disabled value="">Select Secondary Tag</option>
            <option v-for="tag in tags2" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
          </select>
        </div>

        <!-- Adjusted checkbox styling and layout -->
        <div class="checkbox-group">
          <label class="custom-checkbox">
            <input
              type="checkbox"
              id="recurring"
              v-model="form.recurring"
              :disabled="form.shortcut"
            />
            <span class="checkbox-label">Create as Recurring</span>
          </label>

          <label class="custom-checkbox">
            <input
              type="checkbox"
              id="shortcut"
              v-model="form.shortcut"
              :disabled="form.recurring"
            />
            <span class="checkbox-label">Create as Shortcut</span>
          </label>
        </div>

        <button type="submit" class="submit-button">Record Transaction</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Tags from "@/assets/Tags.json"; // Adjust the path as necessary
import Tags2 from "@/assets/Tags2.json"; // Adjust the path as necessary

export default {
  name: "IncomeExpenseCreationView",
  components: {
    NavbarComponent: () => import("@/components/NavbarComponent"),
  },
  data() {
    return {
      activeTab: "shortcuts",
      tags: Tags, // Initialize tags from the imported JSON file
      tags2: Tags2, // Initialize tags from the imported JSON file
      form: {
        type: "",
        value: "",
        notes: "",
        date: "", // Separated date
        time: "", // Separated time
        tagId: "",
        tagId2: "",
        recurring: false,
        shortcut: false,
      },
    };
  },
  methods: {
    validateDecimal() {
      // This regex allows up to 5 decimal places.
      const regex = /^\d+(\.\d{1,5})?$/;
      if (!regex.test(this.form.value)) {
        alert(
          "Please enter a valid decimal number with up to 5 decimal places."
        );
        // Optionally, reset the value or take other corrective action
        // this.form.value = "";
      }
    },
    async handleSubmit() {
      // Combine date and time into timestamp
      const timestamp = `${this.form.date}T${this.form.time}:00.000`;

      // Prepare data for logging or further processing
      const formData = {
        ...this.form,
        timestamp, // Use the combined timestamp
      };

      // Adjustments for omitting separate date, time, tag, and tag2
      delete formData.date;
      delete formData.time;

      console.log("Form submitted with the following data:", formData);

      // eslint-disable-next-line no-unused-vars
      const response = axios({
        method: "post",
        url: "/api/createTransactions",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          // Success handling
          this.$router.push("/history");
        })
        .catch((error) => {
          // Error handling
          console.error("Submission error:", error);
          alert("An error occurred. Please try again."); // Placeholder for error handling
        });
    },
  },
};
</script>

<style scoped>
/* Navigation bar styles */
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

.top-half-content {
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
}

/* Toggle container for switching between views */
.toggle-container {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  width: 50%;
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

/* Shortcut buttons styling */
.shortcut-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  height: 50px;
  padding: 0 20px;
  border-radius: 10px;
  margin: 10px;
  border: 2px solid;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.income {
  border-color: green;
  color: white;
  background-color: green;
}

.expenditure {
  border-color: red;
  color: white;
  background-color: red;
}

.shortcut-button:hover {
  transform: scale(1.05);
}

/* Form container styles */
.form-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 30px auto;
}

.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  color: black !important; /* Temporarily force text color */
}

.submit-button {
  width: 100%;
  padding: 15px 0;
  background-color: #28a745;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #218838;
}

.checkbox-group {
  margin-bottom: 20px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.custom-checkbox input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
  transform: scale(1.2);
}

.checkbox-label {
  cursor: pointer;
}

/* Styles for the recurring data table */
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

.action-button.edit {
  background-color: #ffc107;
}

.action-button.delete {
  background-color: #dc3545;
  color: white;
}
</style>
