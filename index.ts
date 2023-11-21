import http from 'http';
import app from './app'
import config from './src/utils/config';
const port = config.PORT||3001;
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const server = http.createServer(app)

  server.listen(port,()=>{
      console.log(`server is running on port ${port}`)
  })




