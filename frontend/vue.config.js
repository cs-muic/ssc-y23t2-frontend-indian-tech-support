module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    host: "localhost", // frontend hostname or ip
    allowedHosts: "all",
    port: 8080, // frontend port
    https: false, // no ssl
    proxy: {
      "/api": {
        // proxy everything from frontend http://localhost:8080/api/** to backend at http://localhost:8081/api/**
        // that is why all api path on backend should be gin with /api
        target: "http://localhost:8081",
      },
    },
    headers: {
      // typical header settings
      "Access-Control-Allow_Origin": "*",
      "Access-Control-Allow_Methods": "GET, POST, PUT, DELETE, PATCH, OPTION",
      "Access-Control-Allow_headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};
