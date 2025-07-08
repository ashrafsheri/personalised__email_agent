module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your allowed image domains
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api', // Replace with your API URL
  },
};