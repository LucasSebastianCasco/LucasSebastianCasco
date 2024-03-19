

const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const tasks = sqlServer.loadDBPlugin(config.db);
      on('task', tasks);
    },
  },
  
  db: {
    userName: "sa",
    password: "TempDev123!",
    server: "34.232.76.77",
    options: {
      database: "paymentservicedb",
      encrypt: true,
      rowCollectionOnRequestCompletion: true,
      port: 60987
    }
  },

  env: {
    baseUrlAPI: 'https://broxel-dev.globalta.sk/',
    xApiKey: 123456,
    Email: "lcasco@globaltask.net",
    paytoken:"eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsY2FzY29AZ2xvYmFsdGFzay5uZXQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA5LzA5L2lkZW50aXR5L2NsYWltcy9hY3RvciI6IkJyb3hlbFY0IiwiZXhwIjoxNzQyMDU0ODM3LCJpc3MiOiIqIiwiYXVkIjoiKiJ9.rPYsT3iLkrIqCSeJToO9_GITydutKZi3XX2gAu1gFHI"
  }
});