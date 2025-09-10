// PM2 Ecosystem Configuration for S-AMS Backend
// This file must use CommonJS format (not ES modules)

module.exports = {
  apps: [
    {
      name: 's-ams-backend',
      script: 'src/server.js',
      instances: 1, // Start with 1 instance for EC2
      exec_mode: 'fork', // Use fork mode for better compatibility
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart configuration
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Process management
      autorestart: true,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000
    }
  ]
}
