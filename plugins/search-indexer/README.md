# Strapi plugin search-indexer

This plugin is made for indexing content manually to Algolia.

In normal operation content is indexed automatically when it's updated in someway i.e. created, updated or deleted. With this plugin you can re-index all content from every type one-by-one or all together.

This plugin needs to know which content types to index, and they should be specified in `package.json`'s `indexableContent` field.


