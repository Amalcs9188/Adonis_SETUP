module.exports = {
  apps: [
    {
      name: 'CyberFort-API',
      script: 'node',
      args: 'ace serve --production',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
