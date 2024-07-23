# My Edenred - actual

This project will help you import transaction from your My Edenred prepaid card into actual budget app.

You need to provide your username and password and specified what the cadence you want to import transactions.

**Note**: Pending transaction are being imported as cleared. If the transaction is deleted after you need to delete manally from the actual budget.

# Get User ID
User ID now is a `GUID` and not your email address.

For `IOS` I used an app called `Proxyman` and checked the request to get the `UserID`. The `PIN` is your app `PIN`.

## Setup

-   Clone this repo!
-   Install dependencies: `npm ci`
-   Copy `.sample.env` to `.env` and fill in the blanks
-   Run `check`: `node index.js check`, this will check the balance between your Actual Budget account
-   Run `import`: `node index.js import`, this will import all transactions to Actual

## Some things worth noting

The intial transaction import does not have a starting balance, so you will need to manually add that to Actual Budget.

You need to manually create the accounts inside Actual, and then map them to the My Edenred accounts.

## Commands


```
  Usage
    $ myedenredactual <command> <flags>

  Commands & Options
    import           Sync bank accounts to Actual Budget
    config           Print the location of the config file

  Options for all commands
    --user, -u       Specify the user to load configs for
  Examples
    $ myedenredactual import
```
