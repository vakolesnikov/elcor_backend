const startApp = require('./app');
const {MongoClient} = require('mongodb');
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

mongoClient.connect((err, client) => {
   if (err) {
      throw new Error('DataBase connect Error')
   } else {
      startApp(client)
   }
});
