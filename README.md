## Lessons

1. Why caches? O(1) - as good as it gets
2. Tradeoffs:
    - Stale Data
    - Memory
3. Expiration of data is one solution for stale data.
4. Memory is very difficult in JS, because our solution to expire stale data does one of two things:
     - Blows up our event loop call stack
     - It takes an O(n) event driven sweep to clear out stale data
5. The solution is redis
6. `get`, `set`, `delete`, `expire` are the core four for cache functions in redis.
7. node-redis is cb hell, promisification is ugly and hard
8. so redis at the top level if for every single app on our entire machine.
9. `hget`, `hset` are a solvent for this.
10. Can't `expire` them. Can only expire hash keys.

Some afterthoughts:
 - scaling
 - all values are strings, or stringafyble
 - you can password lock redis
 - Any heavy request should generally be cached unless the data is time sensitive
 - **Requests that are otherwise high load**

Redis can be used in a variety of other ways, including as a literal database. The most common besides being a cache is a messaging system Pub/Sub.
