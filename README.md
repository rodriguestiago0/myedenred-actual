# My Edenred - actual

## Setup

-   Clone this repo!
-   Install dependencies: `npm ci`
-   Copy `.sample.env` to `.env` and fill in the blanks
-   Run `check`: `node index.js check`, this will check the balance between your Actual Budget account and the accounts setup on tink
-   Run `import`: `node index.js import`, this will import all transactions to Actual

## Some things worth noting

The intial transaction import does not have a starting balance, so you will need to manually add that to Actual Budget.

You need to manually create the accounts inside Actual, and then map them to the accounts you setup in Tink.

## Commands


```
  Usage
    $ myedenredactual <command> <flags>

  Commands & Options
    ls               List currently syncing accounts
    import           Sync bank accounts to Actual Budget
    config           Print the location of the config file

  Options for all commands
    --user, -u       Specify the user to load configs for
  Examples
    $ myedenredactual import
```
