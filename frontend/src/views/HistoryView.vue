<template>
  <div class="history-view">
    <nav class="navbar">
      <NavbarComponent />
    </nav>
    <!--    &lt;!&ndash; Filters section &ndash;&gt;-->
    <!--    <div class="filters">-->
    <!--      <h2>Filters</h2>-->
    <!--      <div class="top-row">-->
    <!--        <label>-->
    <!--          Start Date:-->
    <!--          <input type="date" v-model="startDate" placeholder="Start Date" />-->
    <!--        </label>-->
    <!--        <label>-->
    <!--          End Date:-->
    <!--          <input type="date" v-model="endDate" placeholder="End Date" />-->
    <!--        </label>-->
    <!--        <label>-->
    <!--          Chart Type:-->
    <!--          <select v-model="chartType">-->
    <!--            <option value="bar">Bar Chart</option>-->
    <!--            <option value="line">Line Chart</option>-->
    <!--          </select>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--      <div class="bottom-row">-->
    <!--        <label>-->
    <!--          Transaction Type:-->
    <!--          <select v-model="transactionType">-->
    <!--            <option value="EXPENDITURE">Expenses</option>-->
    <!--            <option value="INCOME">Income</option>-->
    <!--          </select>-->
    <!--        </label>-->
    <!--        <label>-->
    <!--          Tag 1:-->
    <!--          <select v-model="selectedTag1">-->
    <!--            <option v-for="(value, key) in tags" :key="key" :value="key">-->
    <!--              {{ key }}-->
    <!--            </option>-->
    <!--          </select>-->
    <!--        </label>-->
    <!--        <label>-->
    <!--          Tag 2:-->
    <!--          <select v-model="selectedTag2">-->
    <!--            <option v-for="(value, key) in tags" :key="key" :value="key">-->
    <!--              {{ key }}-->
    <!--            </option>-->
    <!--          </select>-->
    <!--        </label>-->
    <!--        <label>-->
    <!--          Timeframe:-->
    <!--          <select v-model="timeframe">-->
    <!--            <option value="Day">Day</option>-->
    <!--            <option value="Month">Month</option>-->
    <!--            <option value="Year">Year</option>-->
    <!--          </select>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--      <div class="third-row">-->
    <!--        <button @click="toggleCompare">{{ compareText }}</button>-->
    <!--        <button @click="createChart">Create</button>-->
    <!--      </div>-->
    <!--      &lt;!&ndash; Filters content... &ndash;&gt;-->
    <!--    </div>-->

    <!-- Recurring data table -->
    <div class="container">
      <table class="recurring-table">
        <thead>
          <tr>
            <th>#</th>
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
              <td>{{ index + 1 }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.value }}</td>
              <td>{{ getTagNameById(item.tagId) }}</td>
              <td>{{ getTag2NameById(item.tagId2) }}</td>
              <td>{{ item.notes }}</td>
              <td>{{ convertDate(item.timestamp) }}</td>
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
              <td>{{ index + 1 }}</td>
              <td><input v-model="item.type" /></td>
              <td><input v-model="item.value" /></td>
              <td>
                <select v-model="item.tagId">
                  <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                    {{ tag.name }}
                  </option>
                </select>
              </td>
              <td>
                <select v-model="item.tagId2">
                  <option
                    v-for="tag2 in dynamicTags2"
                    :key="tag2.id"
                    :value="tag2.id"
                  >
                    {{ tag2.name }}
                  </option>
                </select>
              </td>
              <td><input v-model="item.notes" /></td>
              <td>
                <!--                <input v-model="item.timestamp" />-->
                <!--                <div class="form-group">-->
                <!--                  <label for="date">Date </label>-->
                <!--                  <input-->
                <!--                    type="date"-->
                <!--                    :value="getDate(item.timestamp)"-->
                <!--                    class="form-control"-->
                <!--                    required-->
                <!--                  />-->
                <!--                </div>-->
                <!--                <div class="form-group">-->
                <!--                  <label for="time">Time </label>-->
                <!--                  <input-->
                <!--                    type="time"-->
                <!--                    :value="getTime(item.timestamp)"-->
                <!--                    class="form-control"-->
                <!--                  />-->
                <!--                </div>-->
                <div class="form-group">
                  <label for="date">Date </label>
                  <input
                    type="date"
                    :value="getDate()"
                    class="form-control"
                    @input="updateDate($event.target.value)"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="time">Time </label>
                  <input
                    type="time"
                    :value="getTime(item.timestamp)"
                    class="form-control"
                    @input="updateTime($event.target.value)"
                  />
                </div>
              </td>
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
  </div>
</template>

<script>
import axios from "axios";
import NavbarComponent from "@/components/NavbarComponent.vue";
import Tags from "@/assets/Tags.json";
import Tags2 from "@/assets/Tags2.json";
// eslint-disable-next-line no-unused-vars
import { ref } from "vue";

const currentDate = new Date();
const startOfYear = new Date(currentDate.getFullYear(), 0, 2);
// eslint-disable-next-line no-unused-vars
const startDate = ref(startOfYear.toISOString().split("T")[0]);
// eslint-disable-next-line no-unused-vars
const endDate = ref(currentDate.toISOString().split("T")[0]);
// eslint-disable-next-line no-unused-vars
const timeframe = ref("Day");
// eslint-disable-next-line no-unused-vars
const transactionType = ref("EXPENDITURE");
// eslint-disable-next-line no-unused-vars
const showFilters = ref(false);
// eslint-disable-next-line no-import-assign,no-redeclare
// eslint-disable-next-line no-unused-vars
const graphData = ref(null);
export default {
  components: {
    NavbarComponent,
  },
  data() {
    return {
      globalEditing: false,
      historyData: [],
      tags: Tags,
      tags2: Tags2,
      form: {
        date: "0000-00-00", // Initialize with current date
        time: "00:00:00.000", // Initialize with current time
      },
    };
  },
  mounted() {
    this.fetchTransactionData();
  },
  methods: {
    populateFormDate(dateString) {
      // var dateUpdated = new Date(dateString);
      var localeDate = this.convertDate(dateString).toLocaleDateString();
      var localeTime = this.convertDate(dateString).toLocaleTimeString();
      var dateUpdated = new Date(
        dateUpdated + new Date(dateString)
      ).toISOString();
      console.log("dateString: " + localeDate + localeTime);
      console.log("dateUpdated: " + dateUpdated);
      // Extract date components
      const dateParts = localeDate.split("/");
      const year = dateParts[2];
      const month = dateParts[0];
      const day = dateParts[1];
      this.form.date = year + "-" + month + "-" + day;

      // Extract time components
      const timeParts = localeTime.split(" ")[0].split(":");
      const hour = timeParts[0];
      const minute = timeParts[1];
      this.form.time = hour + ":" + minute + ":00.000";
      console.log("form date: " + this.form.date);
      console.log("form time: " + this.form.time);
    },
    updateDate(newDate) {
      // Update the date value in the item object
      this.form.date = newDate;
    },
    updateTime(newTime) {
      // Update the time value in the item object
      this.form.time = newTime + ":00.000";
    },
    getDate() {
      return this.form.date; // Formats the date as YYYY-MM-DD
    },
    getTime(timestamp) {
      const stamp = new Date(timestamp);
      return stamp.toTimeString().split(" ")[0].slice(0, 5); // Formats the time as HH:MM
    },
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
    convertDate(timeStamp) {
      return new Date(timeStamp);
    },
    toggleEdit(index) {
      if (!this.globalEditing) {
        const item = this.historyData[index];
        this.historyData[index].editing = !item.editing;
        if (item.editing) {
          // When we enter editing mode, update dynamic subcategories
          this.updateDynamicSubcategories(item.tagId);
          this.populateFormDate(item.timestamp);
        }
      } else {
        this.globalEditing = false;
        this.historyData[index].editing = false;
      }
    },
    updateDynamicSubcategories(mainCategoryId) {
      const startId = parseInt(mainCategoryId) * 3 - 2;
      const endId = startId + 2;
      this.dynamicTags2 = Tags2.filter((tag) => {
        const tagId = parseInt(tag.id);
        return tagId >= startId && tagId <= endId;
      });
    },
    formatDateToISOString(date) {
      console.log("format: " + date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      const millisecond = String(date.getMilliseconds()).padStart(3, "0");
      // const timezoneOffset = date.getTimezoneOffset();
      // const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60))
      //   .toString()
      //   .padStart(2, "0");
      // const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60)
      //   .toString()
      //   .padStart(2, "0");
      // const timezoneSign = timezoneOffset >= 0 ? "-" : "+";

      // return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}+00:00`;
    },
    addLeadingZeroIfNeeded(str) {
      // Split the time string into hours, minutes, and seconds
      var timeParts = str.split(":");

      // Add leading zero to hour if needed
      timeParts[0] = timeParts[0].padStart(2, "0");

      // Join the time parts back together
      return timeParts.join(":");
    },
    async saveTransaction(item, index) {
      try {
        var bodyFormData = new FormData();
        const isoDateTime = new Date(
          `${this.form.date}T${this.addLeadingZeroIfNeeded(this.form.time)}`
        ).toISOString();

        // Get the timezone offset in minutes
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();

        // Adjust the date and time to UTC by subtracting the timezone offset
        const utcDateTime = new Date(
          new Date(isoDateTime).getTime() -
            timezoneOffsetMinutes * 60 * 1000 -
            7 * 60 * 60000
        );

        // Format the adjusted date and time back to ISO format with explicit UTC timezone
        const outputTimeStamp = utcDateTime.toISOString();
        console.log("Form date" + this.form.date);
        console.log("Form time" + this.form.time);
        console.log("Output time stamp: " + outputTimeStamp);
        bodyFormData.append("timestamp", outputTimeStamp);
        bodyFormData.append("id", item.id);
        bodyFormData.append("editType", "EDIT");
        bodyFormData.append("tagId", item.tagId);
        bodyFormData.append("tagId2", item.tagId2);
        bodyFormData.append("type", item.type);
        bodyFormData.append("notes", item.notes);
        bodyFormData.append("value", item.value);

        console.log("outputTimeStamp: " + outputTimeStamp);
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

        // Assuming the response contains updated transaction data
        // this.historyData = response.data.transactions;
        this.historyData[index].editing = false;
        this.globalEditing = false;
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
    getTagNameById(tagId) {
      const tagIdStr = String(tagId);
      const tag = this.tags.find((tag) => tag.id === tagIdStr);
      return tag ? tag.name : "-";
    },
    getTag2NameById(tagId2) {
      const tagId2Str = String(tagId2);
      const tag2 = this.tags2.find((tag) => tag.id === tagId2Str);
      return tag2 ? tag2.name : "-";
    },
  },
};
</script>

<style>
/* General container styling for refined look */
.container {
  width: 90% !important;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa; /* Subtle background color */
  border-radius: 10px; /* Rounded corners for a modern look */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adds depth with a soft shadow */
}

/* Navbar adjustments */
.navbar {
  padding: 20px;
  background-color: #f8f9fa; /* Light and neutral background color */
}

/* Styling for the recurring table */
.recurring-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  overflow: hidden; /* Ensures the shadow isn't cut off */
}

.recurring-table th,
.recurring-table td {
  padding: 15px; /* Comfortable padding for better readability */
  border: 1px solid #dee2e6; /* Light border for a soft look */
  text-align: left; /* Text aligned to the left for a cleaner look */
}

.recurring-table th {
  background-color: #007bff; /* Vibrant header background */
  color: #ffffff; /* Contrast text color */
  font-size: 16px; /* Slightly larger font size for emphasis */
  text-transform: uppercase; /* Uppercase text for a formal appearance */
  letter-spacing: 0.05em; /* Spaced letters for improved readability */
}

.recurring-table tr:hover {
  background-color: #f5f5f5; /* Highlight rows on hover for interactivity */
}

/* Odd and even row styling for improved readability */
.recurring-table tbody tr:nth-child(odd) {
  background-color: #f8f9fa;
}

.recurring-table tbody tr:nth-child(even) {
  background-color: #e9ecef;
}

/* Action button styling for a uniform look and feel */
.action-button {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px; /* Rounded corners for a modern touch */
  transition: all 0.2s ease-in-out; /* Smooth transition for hover effects */
}

.action-button.save {
  background-color: #28a745; /* Success green */
  color: white;
}

.action-button.edit,
.action-button.cancel {
  background-color: #17a2b8; /* Info blue for a cohesive look */
  color: white;
}

.action-button.delete {
  background-color: #dc3545; /* Danger red */
  color: white;
}

.action-button:hover {
  filter: brightness(90%); /* Slightly darken button on hover for feedback */
}

/* Input styling for when in editing state */
input[type="text"],
input[type="datetime-local"],
input[type="number"] {
  width: 100%;
  padding: 10px; /* Ample padding for ease of use */
  margin-bottom: 5px; /* Spacing below inputs */
  border: 1px solid #ced4da;
  border-radius: 4px; /* Rounded corners for a consistent look */
  box-sizing: border-box; /* Ensures padding does not affect overall width */
  transition: border 0.2s ease-in-out; /* Smooth transition for focus */
}

input[type="text"]:focus,
input[type="datetime-local"]:focus,
input[type="number"]:focus {
  border-color: #007bff; /* Highlight color for focused input */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Subtle glow effect */
}
</style>
