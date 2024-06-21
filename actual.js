const { getAppConfigFromEnv } = require("./config");
const actual = require("@actual-app/api");
const fs = require("fs");
const inquirer = require("inquirer");
let { q, runQuery } = require('@actual-app/api');


const appConfig = getAppConfigFromEnv();

/**
 * 
 * @returns {Promise<typeof actual>}
 */
async function initialize(config) {
    try {
        const tmp_dir = `./temp_data_actual/${config.get("user")}`
        fs.mkdirSync(tmp_dir, { recursive: true });
        await actual.init({
            serverURL: appConfig.ACTUAL_SERVER_URL,
            password: appConfig.ACTUAL_SERVER_PASSWORD,
            dataDir: tmp_dir
        });

        let id = config.get("budget_id")
        await actual.downloadBudget(id);
    } catch (e) {
        throw new Error(`Actual Budget Error: ${e.message}`);
    }

    return actual;
}

/**
 * 
 * @param {typeof actual} actualInstance 
 */
function listAccounts(actualInstance) {
    return actualInstance.getAccounts();
}

/**
 * Only works for the past month
 * @param {typeof actual} actualInstance 
 * @param {*} accountId 
 */
async function getLastTransactionDate(actualInstance, accountId) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() -3);

    const transactions = await actualInstance.getTransactions(accountId, monthAgo, new Date());

    if (transactions.length === 0) {
        return new Date(0);
    }

    // Transactions of the day are already imported, so start from the next day.
    const last = new Date(transactions[0].date);
    last.setDate(last.getDate() + 1);

    return last;
}


async function importTransactions(actualInstance, accountId, transactions) {
    console.info("Importing transactions raw data START:")
    console.debug(transactions)
    const actualResult = await actualInstance.importTransactions(
        accountId,
        transactions
    );
    console.info("Actual logs: ", actualResult);
}

async function getBalance(actualInstance, accountId) {
    const balance = await actualInstance.runQuery(q('transactions')
        .filter({ account: accountId })
        //.options({ splits: 'inline' })
        .calculate({ $sum: '$amount' }),)
    return balance.data;
}

/**
 * 
 * @param {typeof actual} actualInstance 
 */
async function finalize(actualInstance) {
    await actualInstance.sync()
    await actualInstance.shutdown();
}

module.exports = {
    initialize,
    listAccounts,
    getLastTransactionDate,
    importTransactions,
    finalize,
    getBalance
}
