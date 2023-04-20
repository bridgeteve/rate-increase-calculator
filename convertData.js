const csvFilePath = 'assets/rates.csv';
const csv = require('csvtojson');
const fs = require('fs');

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
      const jsonContent = JSON.stringify(jsonObj);
    
    fs.writeFile('data1.js', jsonContent, (err) => {
      if (err) throw err;
      console.log('Conversion complete!');
    });
  });

csv()