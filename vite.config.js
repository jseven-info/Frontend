export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    allowedHosts: ['d3c1-2409-40f3-101b-15e2-f845-21bc-7933-5f2d.ngrok-free.app']
  },
};
