# BCoin enterprise solution

Repositroty `bcoent` - simple NodeJS bitcoin solution based on [bcoin](https://github.com/bcoin-org/bcoin)

## Goal:

Create completed boilerplate solution wherewith we will be able to: 
listen for incoming transactions (and store them), withdraw funds (make transactions), generate addresses for user and fetch fees (priority, normal, economic)

## Usage:

To begin development:

```
docker-compose up --build
```

## Todo:

1) Implement [script](https://github.com/bpanel-org/bpanel/pull/167) to be able run `estimatesmartfee` with value. `fee: -1`
2) Fix issue where you need to reload app to make transaction. `Error: Not enough funds`
