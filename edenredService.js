const { getAppConfigFromEnv } = require("./config");
const crypto = require('crypto');

const appConfig = getAppConfigFromEnv();


const authenticate = async () => {
    u = {
      userId: appConfig.EDENRED_USERNAME,
      password: appConfig.EDENRED_PASSWORD
    };
    const token = await fetch('https://www.myedenred.pt/edenred-customer/v2/authenticate/default?appVersion=1.0&appType=PORTAL&channel=WEB', {
        method: 'POST',
        body: JSON.stringify(u),
        headers: {
            'Content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
    })
        .then((response) => response.json())
        .then((json) => json.data.token)
        .catch((err) => {
            console.error("error occured", err);
            return '';
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
        .then((json) => json.data.movementList)
        .catch((err) => {
            console.error("error occured", err);
        });

    return transactions;
}

async function getTransactions(accountId) {
    //authorizationToken = await authenticate()
    transactions = await getAllTransactions(appConfig.EDENRED_TOKEN, accountId)
    parsedTransactions = []
    transactions.forEach(transaction => {
        transactionID = crypto.createHash('sha256').update(transaction.transactionName+transaction.transactionDate+transaction.amount).digest('hex'); 

        date = transaction.transactionDate.split("T")[0]
        if (date < '2024-06-21') {
            return;
        }
        parsedTransactions.push({
            date: date,
            amount: Math.trunc(transaction.amount * 100),
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
