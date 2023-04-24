module.exports = {
  apps : [{
    name   : "API",
    script : "./dist/index.js",
    instances : 2,
    exec_mode : "cluster",
    watch : true,
    env: {
      NODE_ENV: "production"
    },
  },
  {
    name: "SUB",
    script: "./dist/subcriber.js"
  }
]
}
