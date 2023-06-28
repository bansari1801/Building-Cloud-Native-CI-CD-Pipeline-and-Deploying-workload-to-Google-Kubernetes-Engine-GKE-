const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 6001;
console.log("Hiiiiiii")
app.post('/calculate', (req, res) => {
  const filePath = `../Bansari_PV_dir/${req.body.file}`;
  let sum = 0;

  if (req.body.file) {
    if (fs.existsSync(filePath)) {
      try {
        if (isValidCSV(filePath)) {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
              if (row.product === req.body.product) {
                sum = sum + parseInt(row.amount);
              }
            })
            .on('end', () => {
              res.json({
                file: req.body.file,
                sum: sum.toString(),
              });
            })
            .on('error', (error) => {
              console.error(error);
            });
        } else {
          res.send({
            file: req.body.file,
            error: 'Input file not in CSV format.',
          });
        }
      } catch (err) {
        res.send({
          file: req.body.file,
          error: 'Input file not in CSV format.',
        });
      }
    } else {
      res.send({
        file: req.body.file,
        error: 'File not found.',
      });
    }
  } else {
    res.send({
      file: null,
      error: 'Invalid JSON input.',
    });
  }
});

function isValidCSV(filePath) {

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const rows = fileContent.trim().split('\n');

    if (rows.length === 0) {
      return false;
    }

    const header = rows[0].split(',');

    if (header.length != 2) {
      return false;
    }

    const numColumns = rows[0].split(',').length;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.split(',').length !== numColumns) {
        return false;
      }
    }
    return true; 
  } catch (error) {
    console.error('Error reading file:', error);
    return false;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
