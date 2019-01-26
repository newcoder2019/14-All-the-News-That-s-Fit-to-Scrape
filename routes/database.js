const { Stack } = require('../models');
const cheerio = require('cheerio');
const axios = require('axios');

async function getStacks () {
  let stacks = await new Promise((resolve, reject) => {
    axios.get('https://stackoverflow.com')
      .then(r => r.data)
      .then(r => {
        let data = [];
        const $ = cheerio.load(r);
        $('div.summary').each((i, elem) => {
          let stack = {};
          stack = {
            title: $(elem).children('h3').children('a').text(),
            url: $(elem).children('h3').children('a').attr('href'),
            isSaved: false
          };
          $(elem).children('div.started').each((i, elem) => {
            if ($(elem).attr('class') !== 'started-link') {
              stack.author = $(elem).text();
            } else { stack.author = 'unknown'; }
          });
          data.push(stack);
        });
        resolve(data);
      });
  });
  return stacks;
}

module.exports = app => {
  app.put('/stack/:id', (req, res) => {
    Stack.findByIdAndUpdate(req.params.id, { isSaved: true })
      .then(r => res.sendStatus(200))
      .catch(res.sendStatus(404));
  });

  app.post('/scrape', (req, res) => {
    getStacks()
      .then(r => {
        Stack.deleteMany({ isSaved: false })
          .then(_ => {
            Stack.create(r)
              .then(_ => res.json(r));
          });
      })
      .catch(e => res.send(e));
  });
};