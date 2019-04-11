const express = require('express');
const fs = require('fs');
const router = express.Router();

const suggestionService = require('../service/suggestionService');

router.post('/api/getSuggestions', async function (req, res, next) {
  let items = {};
  let dataAlreadyExists = await fs.existsSync('./_resources/suggestions.json');

  if (dataAlreadyExists) {
    items = JSON.parse(fs.readFileSync('./_resources/suggestions.json'));
  } else {
    await suggestionService.getSuggestions()
      .then((response) => items = JSON.parse(response))
      .catch((err) => console.error(err));
    fs.writeFileSync('./_resources/suggestions.json', JSON.stringify(items));
  }

  res.json({items: items});
});

router.post('/api/dismissSuggestion/:id', async function (req, res, next) {
  const dismissedId = parseInt(req.params.id);
  let dataAlreadyExists = await fs.existsSync('./_resources/suggestions.json');

  if (dataAlreadyExists) {
    const items = JSON.parse(fs.readFileSync('./_resources/suggestions.json'));

    //Search the data for the removed suggestion and get the index
    let index = -1;
    for (let i = 0; i < items.length; i++) {
      console.log(i + ' ' + items[i].id + ' ' + dismissedId);
      if (items[i].id === dismissedId) {
        index = i;
        break;
      }
    }

    //Remove the item from data if we have an index
    if (index => 0) {
      items.splice(index, 1);

      //Save the new data again
      fs.writeFileSync('./_resources/suggestions.json', JSON.stringify(items));

      //Send success
      res.json({success: true});
    } else {
      res.json({success: false, message: "Couldn't save the file"});
    }
  } else {
    res.json({success: false, message: "Couldn't find the file"});
  }
});

module.exports = router;