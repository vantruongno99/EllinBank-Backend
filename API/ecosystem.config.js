module.exports = {
  apps : [{
    name   : "API",
    script : "./dist/index.js",
    instances : 4,
    exec_mode : "cluster",
    watch : true
  },
  {
    name: "SUB",
    script: "./dist/subcriber.js"
  }
]
}
