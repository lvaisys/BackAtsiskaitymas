import express from "express";
import { MongoClient } from "mongodb";
import cors from 'cors';
import 'dotenv/config';

const app = express();
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`
};
const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.CLUSTER_ID}.mongodb.net/`;

app.use(express.json());
app.use(cors(corsOptions));
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on PORT: ${process.env.SERVER_PORT}`);
});

// routes
/// get specific book
app.get('/books/:id', async (req, res) => {
  let client;
  try {
    const id = req.params.id;
    client = await MongoClient.connect(DB_CONNECTION_STRING);
    const result = await client.db('OneLibrary').collection('Books').findOne({ "_id": id });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching users');
  } finally {
    if (client) {
      await client.close();
    }
  }
});

/// get book count
app.get('/totalCount', async (req, res) => {
  const settings = extractSettings(req);
  let client;
  try {
    client = await MongoClient.connect(DB_CONNECTION_STRING);
    const data = await client.db('OneLibrary').collection('Books').aggregate([
      { $match: settings.filter },
      { $count: 'totalAmount' }
    ]).toArray();
    const response = data[0]? data[0] : { totalAmount: 0 };
    res.send(response);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching filtered movies' });
  }
  finally {
    if (client) {
      await client.close();
    }
  }
});

// get 10 books
app.get('/books', async (req, res) => {
  const settings = extractSettings(req);
  let client;
  try {
    client = await MongoClient.connect(DB_CONNECTION_STRING);
    const data = await client.db('OneLibrary').collection('Books').aggregate([
      { $match: settings.filter },
      Object.keys(settings.order).length ? { $sort: settings.order } : { $sort: { title: 1 } },
      { $skip: settings.skip },
      { $limit: settings.limit }
    ]).toArray();
    res.send(data);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching filtered movies' });
  }
  finally {
    if (client) {
      await client.close();
    }
  }
});

function extractSettings(req) {
  const settings = {
    filter: {},
    order: {},
    skip: 0,
    limit: 10
  };
  if (Object.keys(req.query).length) {
    settings.limit = Number(req.query.limit) ?? 0;
    settings.skip = Number(req.query.skip) ?? 10;
    Object.keys(req.query).forEach(key => {
      const keyValues = key.split('_');
      const keyValue0 = keyValues[0]; // sort and filter
      if (keyValue0 === 'sort') { 
        settings.order = { [keyValues[1]]: Number(req.query[key]) };
      } else if (keyValue0 === 'filter') {
        if (!keyValues[2]) { // look by title
          settings.filter[keyValues[1]] = { $regex: new RegExp(req.query[key], 'i') };
        } else { //lte/gte/lt/gt/in
          const option = '$' + keyValues[2]; // lte/gte/lt/gt
          if (!settings.filter[keyValues[1]]) { 
            if (key.split('_')[1] === 'genres') {
              settings.filter[keyValues[1]] = { [option]: req.query[key].split(',') };
            } else {
              if (keyValues[1] === 'publishDate') {
                settings.filter[keyValues[1]] = { [option]: `${req.query[key]}-01-01` };
              }
              else {
                settings.filter[keyValues[1]] = { [option]: Number(req.query[key]) };
              }
            }
          } else { 
            if (keyValues[1] === 'publishDate') {
              settings.filter[keyValues[1]][option] = `${req.query[key]}-01-01`;
            }
            else {
              settings.filter[keyValues[1]][option] = Number(req.query[key]);
            }
          }
        }
      }
    });
  }
  return settings;
}
