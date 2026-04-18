import fs from 'fs';
import https from 'https';

https.get('https://aircontrols.in/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('/index.html', data);
    console.log('Downloaded index.html');
  });
}).on('error', (err) => {
  console.error(err);
});
