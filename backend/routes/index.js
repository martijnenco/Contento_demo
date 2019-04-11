/** Module imports **/
const express = require('express');
const fs = require('fs');
const router = express.Router();

/** Relative imports **/
const suggestionService = require('../service/suggestionService');

/**
 * api route that is required for the initial suggestions loading
 */
router.post('/api/getSuggestions', async function (req, res, next) {
  let items = {};
  let dataAlreadyExists = await fs.existsSync('./_resources/suggestions.json');

  if (dataAlreadyExists) {
    //If the data already exists then just return that.
    items = JSON.parse(fs.readFileSync('./_resources/suggestions.json'));
  } else {
    //Else then try and load new 'suggestions from the service'
    await suggestionService.getSuggestions()
      .then((response) => items = JSON.parse(response).map(item => {
        return {
          id: item.id,
          title: item.title,
          body: item.body,
          image: `http://placehold.it/120x120&text=image_of_${item.id}`,
          link: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
        }
      }))
      .catch((err) => console.error(err));
    //Save the new files to the directory
    fs.writeFileSync('./_resources/suggestions.json', JSON.stringify(items));
  }

  res.json({items: items});
});

/**
 * api route that is required for the suggestion dismissing
 */
router.post('/api/dismissSuggestion/:id', async function (req, res, next) {
  const dismissedId = parseInt(req.params.id);
  let dataAlreadyExists = await fs.existsSync('./_resources/suggestions.json');

  if (dataAlreadyExists) {
    const items = JSON.parse(fs.readFileSync('./_resources/suggestions.json'));

    //Search the data for the removed suggestion and get the index
    let index = -1;
    for (let i = 0; i < items.length; i++) {
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