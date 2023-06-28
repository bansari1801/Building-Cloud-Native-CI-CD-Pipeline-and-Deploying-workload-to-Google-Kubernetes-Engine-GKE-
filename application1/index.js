const { default: axios } = require('axios');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const csvWriter = require('csv-writer').createArrayCsvWriter;

const PORT = process.env.PORT || 6000;

console.log("Hi Testiiiinggg")
const createJSON = (data) => {
  const rows = data.split('\n');
  const result = rows.map((row) => row.split(',').map((ele) => ele.trim()));
  return result;
};

app.post('/store-file', (req, res) => {
  if (req?.body?.file) {
    const filePath = `/Bansari_PV_dir/${req.body.file}`;
    const writer = csvWriter({
      path: filePath,
    });

    writer
      .writeRecords(createJSON(req.body.data))
      .then(() => {
        res.send({
          file: req.body.file,
          message: 'Success.',
        });
      })
      .catch((err) => {
        res.send({
          file: req.body.file,
          error: 'Error while storing the file to the storage.',
        });
      });
  } else {
    res.send({
      file: null,
      error: 'Invalid JSON input.',
    });
  }
});

app.post('/calculate', async (req, res) => {
  console.log('trying to call 2nd container');
  await axios
    .post('http://app2-service:6001/calculate', {
      file: req.body.file,
      product: req.body.product,
    })
    .then(({data}) => {
      console.log(data)
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
