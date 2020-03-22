const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL ||'mongodb+srv://deepu9125:Policy@1234@mern-rla0x.mongodb.net/productdb?retryWrites=true&w=majority';

let db;
const port = process.env.API_SERVER_PORT || 3000;


let aboutMessage = "My Company Inventory";


function setAboutMessage(_, { message }) {
    aboutMessage = message;
    return aboutMessage;
}

async function ProductList() {
    //console.log("In product list");
    const products = await db.collection('products').find({}).toArray();
    return products;
}

    function issueValidate(product) {
        const errors = [];
        if (errors.length > 0) {
          throw new UserInputError('Invalid input(s)', { errors });
        }
      }

      async function ProductAdd(_, { product }) {
        issueValidate(product);
        const newProduct = Object.assign({}, product);
        const temp = await db.collection('products').find({}).toArray();
         newProduct.Product_id = temp.length+1;
         //newProduct.Product_id = this.state.products.length + 1;

        const result = await db.collection('products').insertOne(newProduct);
        const savedProduct = await db.collection('products')
        .findOne({ _id: result.insertedId });
        return savedProduct;
    }

    async function connectToDb() {
        const client = new MongoClient(url, { useNewUrlParser: true });
        await client.connect();
        console.log('Connected to MongoDB at', url);
        db = client.db();
    }


const resolvers = {
    Query: {
        about: () => aboutMessage,
        ProductList,
    },
    Mutation: {
        setAboutMessage,
        ProductAdd,
    },
};



const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,formatError: (error) => {
        console.log(error);
        return error;
      },
    });

const app = express();

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function start() {
    try {
      await connectToDb();
      app.listen(port, () => {
        console.log(`API server started on port ${port}`);
      });
    } catch (err) {
      console.log('ERROR:', err);
    }
  }());