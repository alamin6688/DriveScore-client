module.exports = {
  apps: [
    {
      name: "driveScore-web-frontend", 
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 8024
      },
    }, 
  ],
};
