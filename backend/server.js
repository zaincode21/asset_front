const express = require('express');
const cors = require('cors');
const organizationsRouter = require('./routes/organizations');
const usersRouter = require('./routes/users');
const assetCategoriesRouter = require('./routes/assetCategories');
const locationsRouter = require('./routes/locations');
const assetsRouter = require('./routes/assets');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/organizations', organizationsRouter);
app.use('/users', usersRouter);
app.use('/asset-categories', assetCategoriesRouter);
app.use('/locations', locationsRouter);
app.use('/assets', assetsRouter);

app.get('/', (req, res) => {
  res.send('Asset Management Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 