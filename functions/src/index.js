const elastic = require("./elastic");
const strapi  = require("./strapi");

async function main() {

  await elastic.checkConnection()

  const elasticIndex = await elastic.esclient.indices.exists({ index: elastic.index });

  if (!elasticIndex.body) {
    await elastic.createArticlesIndex(elastic.index);
    await elastic.setArticlesMapping();
  }
  
  strapi.articlesBulk();

}

main();

module.exports = main