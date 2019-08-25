const util    = require('util')
const axios   = require("axios");
const elastic = require("./elastic");
                require("dotenv").config();

function getArticle(id) {
  return axios.get(`${process.env.STRAPI_ENDPOINT}/articles/${id}`);
}

async function articlesBulk() {

  for (let i = 1; i <= 30; i++) {

    try {

      // eslint-disable-next-line no-await-in-loop
      const { data } = await getArticle(i);

      // eslint-disable-next-line no-await-in-loop
      await elastic.insertArticle({
        id:           data.id,
        title:        data.title,
        subtitle:     data.subtitle,
        article_body: data.article_body
      });

      console.log(`Article ${i} successfully inserted`);

    } catch (err) {
      console.log(`An error occurred while inserting document: ${i}`);
      console.log(util.inspect(err.meta.body, false, null, true));
    }

  }

}

module.exports = {
  getArticle,
  articlesBulk
}