# fnbr-stats
Stats ingester for fnbr.co

## What is this?

[fnbr.co](https://fnbr.co) is a popular Fortnite cosmetics directory. Every item has a page on the website, in the format `fnbr.co/type/slug` where `type` is the item type and `slug` is a url friendly version of the item name. For example [Reaper](https://fnbr.co/pickaxe/reaper) is at `https://fnbr.co/pickaxe/reaper`.

## What does this repo do?

There is a popularity graph on the item pages to let people know how and when an item was popular. It works by recording the page views and then calculating the most popular time in a 30 day period. The site is distributed around the world on servers in Sydney, Amsterdam, New York and San Francisco. However these replicas are read-only, meaning they cannot write any data to any of the site databases or caches, this job falls to the main servers in New York.

Static pages such as the [item shop](https://fnbr.co/shop), homepage and a few others are served from these replica servers as well as being cached using a [Cloudflare worker script](https://www.cloudflare.com/products/cloudflare-workers/).
Item pages have to be served from New York and not a server closer to the end user, otherwise we would be unable to record accurate stats.

This small node application allows the replica servers to 'report' their item views to the main cluster of servers in New York.

## Redis

The stats are cached in Redis, and read by the replicas when an item page is requested. A [sorted set](https://redis.io/topics/data-types#sorted-sets) is used so that the site can easily calculate and show the most popular items for that day.
As Redis isn't an ideal long-term data store, another server will 'process' the stats at regular intervals. It saves them in the main database for permanent storage and generating the graphs when required.
You could think of this node app as a 'proxy' to Redis as it has a simple function.
