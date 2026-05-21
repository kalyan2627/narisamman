const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8086, subdomain: 'salty-mice-mate' });
    console.log('Tunnel URL:', tunnel.url);
    fs.writeFileSync('tunnel.txt', tunnel.url);
    
    tunnel.on('close', () => {
      console.log('tunnel closed');
    });
  } catch (err) {
    console.error('Error starting tunnel:', err);
    fs.writeFileSync('tunnel.txt', 'Error: ' + err.message);
  }
})();
