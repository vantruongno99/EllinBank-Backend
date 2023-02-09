import cluster from 'node:cluster';
import process from 'node:process';
import http from 'http';
import app from './app'
import config from './src/utils/config';
const port = config.PORT||3001;

const totalCPUs = require("os").cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const server = http.createServer(app)

  server.listen(port,()=>{
      console.log(`server is running on port ${port}`)
  })
  console.log(`Worker ${process.pid} started`);
}

