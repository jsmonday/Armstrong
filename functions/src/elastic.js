const { Client } = require("@elastic/elasticsearch");
                   require("dotenv").config();

const elastic    = new Client({ node: process.env.ELASTIC_NODE });
const index      = "articles"
const type       = "article"

async function createArticlesIndex(index) {
  try {
    await elastic.indices.create({ index });
    console.log(`Created index ${index}`);
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);
  }
}

async function setArticlesMapping() {
  try {
    const schema = {
      id: {
        type: "integer"
      },
      title: {
        type: "text"
      },
      subtitle: {
        type: "text"
      },
      article_body: {
        type: "text"
      }
    }

    await elastic.indices.putMapping({ 
      index, 
      type,
      include_type_name: true,
      body: { 
        properties: schema 
      } 
    })

    console.log("Articles mapping created successfully");
  } catch (err) {
    console.error("An error occurred while setting the articles mapping:");
    console.error(err);
  }
}

function checkConnection() {
  return new Promise(async (resolve) => {
    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;
    while (!isConnected) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await elastic.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;
      // eslint-disable-next-line no-empty
      } catch (_) {
      }
    }
    resolve(true);
  });
}

function insertArticle(article) {
  return new Promise((resolve, reject) => {

    const body = [
      {
        index: {
          _index: index,
          _type:  type
        }
      },
      {
        id:           article.id,
        title:        article.title,
        subtitle:     article.subtitle,
        article_body: article.article_body
      }
    ];
    
    elastic.index({
      index,
      type,
      id: article.id,
      body
    }, (err, resp, status) => {
      return err 
           ? reject(err)
           : resolve({ resp, status })
    });
    
  })
}

module.exports = {
  elastic,
  index,
  type,
  setArticlesMapping,
  checkConnection,
  createArticlesIndex,
  insertArticle
}