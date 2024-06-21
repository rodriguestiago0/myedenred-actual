const Conf = require("conf");
const config = require("dotenv").config;
config();

const ACTUAL_SERVER_URL = process.env.ACTUAL_SERVER_URL || "";
const ACTUAL_SERVER_PASSWORD = process.env.ACTUAL_SERVER_PASSWORD || "";

const APP_PORT = process.env.APP_PORT || 3000;

const APP_URL = process.env.APP_URL || "http://localhost"

const EDENRED_USERNAME = process.env.EDENRED_USERNAME || "";
const EDENRED_PASSWORD = process.env.EDENRED_PASSWORD || "";
const EDENRED_ACCOUNT_MAP = process.env.EDENRED_ACCOUNT_MAP || "";
const ACTUAL_ACCOUNT_MAP = process.env.ACTUAL_ACCOUNT_MAP || "";
const CRON_EXPRESSION = process.env.CRON_EXPRESSION || "";
const ACTUAL_SYNC_ID = process.env.ACTUAL_SYNC_ID || "";


function getAppConfigFromEnv() {
    var EDENRED_ACCOUNT_MAPPING = {}
    var ACTUAL_ACCOUNT_MAPPING = {}
    var edenredSplit = EDENRED_ACCOUNT_MAP.split(',');
    var actualSplit = ACTUAL_ACCOUNT_MAP.split(',');
    if (edenredSplit.length != actualSplit.length) {
        throw new Error(`Invalid accounts configs`);
    }
    for (var i = 0; i < edenredSplit.length; i++) {
        EDENRED_ACCOUNT_MAPPING[edenredSplit[i]] = actualSplit[i];
        ACTUAL_ACCOUNT_MAPPING[actualSplit[i]] = edenredSplit[i];
    }
    const appConfig = {
        APP_PORT,
        APP_URL,
        EDENRED_USERNAME,
        EDENRED_PASSWORD,
        EDENRED_ACCOUNT_MAP,
        ACTUAL_ACCOUNT_MAPPING,
        EDENRED_ACCOUNT_MAPPING,
        ACTUAL_ACCOUNT_MAP,
        ACTUAL_SERVER_URL,
        ACTUAL_SERVER_PASSWORD,
        ACTUAL_SYNC_ID,
        CRON_EXPRESSION
    }

    // Assert that all required environment variables are set
    Object.entries(appConfig).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    })

    return appConfig
}


function getConf(username) {
    const appConfig = getAppConfigFromEnv();
    const key = `${username}`;

    const tmp = new Conf({
        configName: key
    });
    tmp.set("user", key);
    tmp.set("budget_id", appConfig.ACTUAL_SYNC_ID)
    return tmp;
}

module.exports = {
    getAppConfigFromEnv,
    getConf
}
