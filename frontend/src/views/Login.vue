<template>
  <v-container>
    <template>
      <v-sheet class="mx-auto" width="300">
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <!--          TODO: figure out how to replicate ajarn's form as shown in the video-->
          <!--          <v-text-field-->
          <!--            v-model="state.email"-->
          <!--            :error-messages="v$.email.$errors.map((e) => e.$message)"-->
          <!--            label="E-mail"-->
          <!--            required-->
          <!--            @blur="v$.email.$touch"-->
          <!--            @input="v$.email.$touch"-->
          <!--          ></v-text-field>-->

          <v-select
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Item"
            required
          ></v-select>

          <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox>

          <div class="d-flex flex-column">
            <v-btn class="mt-4" color="success" block @click="validate">
              Validate
            </v-btn>

            <v-btn class="mt-4" color="error" block @click="reset">
              Reset Form
            </v-btn>

            <v-btn class="mt-4" color="warning" block @click="resetValidation">
              Reset Validation
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </template>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail must be valid",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
  }),

  methods: {
    validate() {
      this.$ref.form.validate();
    },
    reset() {
      this.$ref.form.reset();
    },
    resetValidation() {
      this.$ref.form.resetValidation();
    },
  },
};
</script>
