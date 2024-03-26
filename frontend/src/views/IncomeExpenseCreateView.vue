<template>
  <div class="income-expense-creation-view">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <NavbarComponent />
    </nav>

    <!-- Toggle switch for the top half of the page -->
    <div class="toggle-container">
      <button
        :class="{ active: activeTab === 'favorites' }"
        @click="activeTab = 'favorites'"
      >
        Favorites
      </button>
      <button
        :class="{ active: activeTab === 'viewRecurring' }"
        @click="activeTab = 'viewRecurring'"
      >
        View Recurring
      </button>
    </div>

    <!-- Content for the top half of the page, changes based on active tab -->
    <div v-if="activeTab === 'favorites'" class="top-half-content">
      <button
        v-for="favorite in favoritesData"
        :key="favorite.id"
        :class="{
          'shortcut-button': true,
          income: favorite.transactionType === 'INCOME',
          expenditure: favorite.transactionType === 'EXPENDITURE',
        }"
        :style="{
          backgroundImage: favorite.resourceURI
            ? `url(${favorite.resourceURI})`
            : '',
        }"
        @click="populateFormWithFavorite(favorite)"
        style="position: relative"
      >
        {{ favorite.notes }}
        <span
          class="delete-cross"
          @click.stop="deleteFavorite(favorite.id)"
          style="position: absolute; top: 0; right: 0; cursor: pointer"
          >✕</span
        >
      </button>
    </div>

    <div v-if="activeTab === 'viewRecurring'" class="top-half-content">
      <!-- Recurring data table -->
      <table class="recurring-table">
        <thead>
          <tr>
            <th>Notes</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Primary Tag</th>
            <th>Secondary Tag</th>
            <th>Date of Month Recurring</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="recurringData.length === 0">
            <td colspan="7">No recurring transactions found.</td>
          </tr>
          <tr v-else v-for="item in recurringData" :key="item.id">
            <td>{{ item.notes }}</td>
            <td>{{ item.transactionType }}</td>
            <td>{{ item.value.toFixed(2) }}</td>
            <td>
              <!-- Display primary tag name using the main tags array -->
              {{ tags.find((tag) => tag.id === item.tagId)?.tagName || "N/A" }}
            </td>
            <td>
              {{ item.secondaryTagName || "N/A" }}
            </td>
            <td>{{ item.dateofMonthRecurring || "N/A" }}</td>
            <td>
              <button
                class="action-button edit"
                @click="editRecurringTransaction(item)"
              >
                Edit
              </button>
              <button
                class="action-button delete"
                @click="deleteRecurringTransaction(item.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form in the bottom half of the page -->
    <div class="form-container">
      <h2 class="form-title">Create New Transaction</h2>
      <form @submit.prevent="handleSubmit" class="form-horizontal">
        <div class="form-row checkbox-group">
          <label class="custom-checkbox">
            <input
              type="checkbox"
              id="recurring"
              v-model="form.recurring"
              @change="onRecurringChange"
            />
            <span class="checkbox-label">Create as Recurring</span>
          </label>

          <label class="custom-checkbox">
            <input
              type="checkbox"
              id="shortcut"
              v-model="form.shortcut"
              @change="onShortcutChange"
            />
            <span class="checkbox-label">Create as Favorite</span>
          </label>
        </div>

        <div class="form-row">
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
        </div>

        <div class="form-row">
          <div class="form-group" v-if="!form.recurring && !form.shortcut">
            <label for="date">Date</label>
            <input
              type="date"
              v-model="form.date"
              class="form-control"
              :disabled="form.recurring"
              required
            />
          </div>

          <div class="form-group" v-if="!form.recurring && !form.shortcut">
            <label for="time">Time</label>
            <input
              type="time"
              v-model="form.time"
              class="form-control"
              :disabled="form.recurring"
            />
          </div>

          <div class="form-group" v-if="form.recurring">
            <label for="dayOfMonth">Day of Month</label>
            <select
              v-model="form.dateofMonthRecurring"
              class="form-control"
              required
            >
              <option value="" disabled>Select Day</option>
              <option v-for="day in 31" :value="day" :key="day">
                {{ day }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="tag">Primary Tag</label>
            <select v-model="form.tagId" class="form-control" required>
              <option disabled value="">Select Primary Tag</option>
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.tagName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="tag2">Secondary Tag</label>
            <select v-model="form.tagId2" class="form-control">
              <option disabled value="" selected>Select Secondary Tag</option>
              <option
                v-for="tag in secondaryTags"
                :key="tag.id"
                :value="tag.id"
              >
                {{ tag.secondaryTagName }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="notes">Notes</label>
          <textarea
            v-model="form.notes"
            placeholder="Any relevant details"
            class="form-control"
          ></textarea>
        </div>

        <button type="submit" class="submit-button">Record Transaction</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "IncomeExpenseCreationView",
  components: {
    NavbarComponent: () => import("@/components/NavbarComponent"),
  },
  data() {
    return {
      activeTab: "favorites",
      tags: [], // Initialize tags from the imported JSON file
      secondaryTags: [], // Will be dynamically filled based on main category selection
      favoritesData: [], // Define the property here
      recurringData: [], // Define the property here
      form: {
        type: "",
        value: "",
        notes: "",
        date: this.getCurrentDate(), // Initialize with current date
        time: this.getCurrentTime(), // Initialize with current time
        tagId: "",
        tagId2: "",
        recurring: false,
        shortcut: false,
        dateofMonthRecurring: "",
      },
    };
  },
  watch: {
    "form.tagId": function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateSubcategories(newVal);
      }
    },
  },
  created() {
    this.fetchTags();
    this.fetchTransactionBlueprints();
    this.fetchFavorites();
  },
  methods: {
    async fetchTags() {
      try {
        const response = await axios.get("/api/tag");
        if (response.data && response.data.loggedIn) {
          // Assuming response.data.tags is the correct path
          const uniqueTags = Array.from(
            new Map(response.data.tags.map((tag) => [tag.id, tag])).values()
          );
          this.tags = uniqueTags;
        } else {
          console.error("Failed to fetch tags or user not logged in.");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },
    async updateSubcategories(mainCategoryId) {
      if (!mainCategoryId) return;
      try {
        const response = await axios.get("/api/secondary_tag", {
          params: { tagId: mainCategoryId },
        });
        if (response.data && response.data.loggedIn) {
          this.secondaryTags = response.data.secondaryTags;
        } else {
          console.error(
            "Failed to fetch secondary tags or user not logged in."
          );
          this.secondaryTags = []; // Reset secondary tags if fetch fails or not logged in
        }
      } catch (error) {
        console.error("Error fetching secondary tags:", error);
        this.secondaryTags = []; // Reset secondary tags in case of error
      }
    },
    async deleteFavorite(id) {
      try {
        // Make the API call to delete the favorite by ID
        await axios.post("/api/transaction-blueprints/delete-favorite", null, {
          params: {
            id: id,
          },
        });
        // Remove the deleted favorite from the favoritesData array
        this.favoritesData = this.favoritesData.filter(
          (favorite) => favorite.id !== id
        );
      } catch (error) {
        console.error("Error deleting favorite:", error);
        alert("Failed to delete favorite.");
      }
    },
    populateFormWithFavorite(favorite) {
      // Populate form data with selected favorite
      this.form.type = favorite.transactionType;
      this.form.value = favorite.value.toString();
      this.form.notes = favorite.notes;
      this.form.tagId = favorite.tagId || null;
      this.form.tagId2 = favorite.tagId2 || null;
      this.form.recurring = favorite.dateofMonthRecurring !== null;
      this.form.date = this.getCurrentDate();
      this.form.time = this.getCurrentTime();
    },
    fetchFavorites() {
      axios
        .get("/api/transaction-blueprints/get-transaction-blueprints/favorites")
        .then((response) => {
          this.favoritesData = response.data.transactionBlueprintsList;
          // Optionally, process the data if needed
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          alert("Failed to fetch favorites.");
        });
    },
    fetchTransactionBlueprints() {
      axios
        .get("/api/transaction-blueprints/get-transaction-blueprints/recurring")
        .then((response) => {
          this.recurringData = response.data.transactionBlueprintsList;
        })
        .catch((error) => {
          console.error("Error fetching transaction blueprints:", error);
          alert("Failed to fetch transaction blueprints.");
        });
    },
    onRecurringChange() {
      if (this.form.recurring) {
        this.form.shortcut = false; // Turn off 'Shortcut' if 'Recurring' is checked
      }
    },

    // Method to handle changes in the 'Shortcut' checkbox
    onShortcutChange() {
      if (this.form.shortcut) {
        this.form.recurring = false; // Turn off 'Recurring' if 'Shortcut' is checked
      }
    },
    getCurrentDate() {
      const today = new Date();
      return today.toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD
    },
    getCurrentTime() {
      const now = new Date();
      return now.toTimeString().split(" ")[0].slice(0, 5); // Formats the time as HH:MM
    },
    validateDecimal() {
      // This regex allows up to 5 decimal places.
      const regex = /^\d+(\.\d{1,5})?$/;
      if (!regex.test(this.form.value)) {
        alert(
          "Please enter a valid decimal number with up to 5 decimal places."
        );
        this.form.value = "";
      }
    },
    async handleSubmit() {
      // Combine date and time into timestamp
      const timestamp = `${this.form.date}T${this.form.time}:00.000`;

      let formData = {
        ...this.form,
        timestamp, // Use the combined timestamp
      };

      // Adjustments for omitting separate date, time, tag, and tag2
      delete formData.date;
      delete formData.time;

      if (this.form.recurring || this.form.shortcut) {
        formData.shortcutType = this.form.recurring ? "RECURRING" : "FAVORITES";
      }

      try {
        // Check if the transaction is recurring or a favorite
        if (this.form.recurring || this.form.shortcut) {
          axios({
            method: "post",
            url: "/api/transaction-blueprints/post-transaction-blueprints",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then((response) => {
              if (response.data) {
                this.activeTab = this.form.recurring
                  ? "viewRecurring"
                  : "favorites";
                alert(
                  "Submission for recurring/favorite transaction successful."
                );
                this.clearForm(); // Clear form after successful submission
                this.fetchTransactionBlueprints(); // Update recurring data
                this.fetchFavorites(); // Update favorites data
              } else {
                alert("Failed to update transaction. Please try again.");
              }
            })
            .catch((error) => {
              // Handle errors
              console.error("Error submitting transaction:", error);
              alert("Error submitting transaction. Please try again.");
            });
        } else {
          // Proceed with the normal submission if not recurring/favorite
          axios({
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
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred. Please try again.");
      }
    },
    clearForm() {
      // Reset form fields to their initial state
      this.form = {
        type: "",
        value: "",
        notes: "",
        date: this.getCurrentDate(),
        time: this.getCurrentTime(),
        tagId: "",
        tagId2: "",
        recurring: false,
        shortcut: false,
        dateofMonthRecurring: "",
      };
    },
  },
};
</script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

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
  border-color: #ccc;
  box-shadow: 0 4px 2px -2px gray;
}

.top-half-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 75%;
  margin: 30px auto;
  position: relative;
  z-index: 100;
}

.shortcut-button {
  position: relative; /* this ensures that the .delete-cross is positioned relative to the button */
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

.delete-cross {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  padding: 2px 5px; /* Slightly larger padding for easier clicking */
  border-radius: 0 0 0 5px; /* Rounded corner on the bottom left */
  /* Additional styling as needed */
}

.shortcut-button:hover .delete-cross {
  display: inline; /* or 'visibility: visible;' to match your initial hidden state */
}

.shortcut-button:hover {
  transform: scale(1.05);
}

.form-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 75%;
  margin: 30px auto;
  position: relative;
  z-index: 100;
}

.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-horizontal .form-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.form-horizontal .form-group {
  display: flex;
  flex-direction: column;
  flex-basis: 48%;
}

.form-horizontal .form-group.full-width {
  flex-basis: 100%;
}

.form-horizontal .form-group > label {
  margin-bottom: 5px;
}

.form-horizontal .form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 20px 0;
  background-color: #28a745;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.checkbox-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.custom-checkbox {
  flex-basis: 48%; /* Adjust to fit two checkboxes in one row */
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-checkbox input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
  accent-color: #28a745;
}

.checkbox-label {
  cursor: pointer;
  font-weight: 500;
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
