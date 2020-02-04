const express = require('express');
const { promisify } = require('util');
const redis = require('redis');

const PORT = process.env.PORT || 3000;

const redisClient = redis.createClient();
const app = express();

let count = 0;

const get = promisify(redisClient.get).bind(redisClient);
const set = promisify(redisClient.set).bind(redisClient);
const expire = promisify(redisClient.expire).bind(redisClient);

const startRedis = () => {
  return new Promise((res, rej) => {
    redisClient.ping(e => {
      if (e) {
        console.error(e);
        rej(e);
      } else {
        console.log('PONG!');
        res();
      }
    });
  })
};

const startServer = () => {
  return new Promise((res) => {
    app.listen(PORT, () => {
      console.log('Express is listening.');
      res();
    })
  })
};

app.get('/name/:name', async (req, res, next) => {
  const { name } = req.params;

  const cacheResult = await get(name);

  if (cacheResult) {
    await expire(name, 10);
    res.status(200).send({
      response: cacheResult,
    });
    return;
  }

  await set(name, count);
  await expire(name, 10);

  ++count;
  res.sendStatus(200);
});

startRedis()
  .then(startServer)
  .catch(() => {
    console.log('Something went wrong!');
    process.exit(1);
  });
