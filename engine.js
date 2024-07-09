const { getAppConfigFromEnv, getConf } = require("./config");
const { getTransactions } = require("./edenredService.js");
const { initialize, importTransactions, finalize, listAccounts  } = require("./actual.js");

const appConfig = getAppConfigFromEnv();
config = getConf("default")

async function importMyEdenredTransactions() {
    const actual = await initialize(config);
    edenredMapping = appConfig.EDENRED_ACCOUNT_MAPPING
    for (let [edenredAccountId, actualAccountID] of Object.entries(edenredMapping)) {
        console.info("Importing transactions for account ", edenredAccountId)
        var mappedtransactions = await getTransactions(edenredAccountId)
        if (mappedtransactions.length == 0) {
            console.info("No imported transactions");
            continue;
        }
        await importTransactions(actual, actualAccountID, mappedtransactions);
    };
   
    await finalize(actual);
}


async function init () {
    const accountsInTheActualBudget = await listAccounts(await initialize(config));
    actualMapping = appConfig.ACTUAL_ACCOUNT_MAPPING
    accountsInTheActualBudget.forEach(actualAccount => {
        myEdenredAccount = actualMapping[actualAccount.id]
        if (myEdenredAccount != undefined) {
            config.set(`actualSync.${actualAccount.id}`, {
                actualName: actualAccount.name,
                actualAccountId: actualAccount.id,
                myEdenredAccountId: myEdenredAccount,
            });
        }
    });
}


module.exports = {
    importMyEdenredTransactions,
    init
}
