const { getAppConfigFromEnv } = require("./config");
const crypto = require('crypto');



const appConfig = getAppConfigFromEnv();

const login = async () => {
    u = {
      userId: appConfig.EDENRED_USERNAME,
      client_secret: appConfig.EDENRED_PASSWORD
    };
    const token = await fetch('https://www.myedenred.pt/edenred-customer/v2/authenticate/default?appVersion=1.0&appType=PORTAL&channel=WEB', {
        method: 'POST',
        body: JSON.stringify(u),
        headers: {
            'Content-type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((json) => json.data.token)
        .catch((err) => {
            console.error("error occured", err)
        });
    return token
}


const getAllTransactions = async (token, accountId) => {

    url = 'https://www.myedenred.pt/edenred-customer/v2/protected/card/' + accountId + '/accountmovement?appVersion=1.0&appType=PORTAL&channel=WEB'
    transactions = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        },
    })
        .then((response) => response.json())
        .then((json) => json.movementList)
        .catch((err) => {
            console.error("error occured", err)
        });

    return transactions;
}

async function getTransactions(accountId) {
    authorizationToken = await authenticate()
    transactions = await getAllTransactions(authorizationToken, accountId)
    parsedTransactions = []
    transactions.forEach(transaction => {
        transactionID = crypto.createHash('sha256').update(transaction.transactionName+transaction.transactionDate+transaction.amount).digest('hex'); 

        parsedTransactions.push({
            date: transaction.transactionDate,
            amount: transaction.amount,
            payee_name: transaction.transactionName,
            imported_payee: transaction.transactionName,
            imported_id: transactionID,
            cleared: true,
        })
    });
    

    return parsedTransactions
}

module.exports = {
    getTransactions
}
