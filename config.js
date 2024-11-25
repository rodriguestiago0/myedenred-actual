const Conf = require("conf");
const config = require("dotenv").config;
config();

const ACTUAL_SERVER_URL = process.env.ACTUAL_SERVER_URL || "";
const ACTUAL_SERVER_PASSWORD = process.env.ACTUAL_SERVER_PASSWORD || "";

const APP_PORT = process.env.APP_PORT || 3000;

const APP_URL = process.env.APP_URL || "http://localhost"
const EDENRED_VERSION = process.env.EDENRED_VERSION || "4.1.0";

const EDENRED_USERNAME = process.env.EDENRED_USERNAME || "";
const EDENRED_PIN = process.env.EDENRED_PIN || "";
const EDENRED_ACCOUNT = process.env.EDENRED_ACCOUNT || "";
const ACTUAL_ACCOUNT = process.env.ACTUAL_ACCOUNT || "";
const CRON_EXPRESSION = process.env.CRON_EXPRESSION || "";
const ACTUAL_SYNC_ID = process.env.ACTUAL_SYNC_ID || "";
const IMPORT_FROM = process.env.IMPORT_FROM || "";


function getAppConfigFromEnv() {
    var EDENRED_ACCOUNT_MAPPING = {}
    var ACTUAL_ACCOUNT_MAPPING = {}
    if (!EDENRED_ACCOUNT){
        throw new Error(`Missing environment variable: EDENRED_ACCOUNT`);
    }
    
    if (!ACTUAL_ACCOUNT){
        throw new Error(`Missing environment variable: ACTUAL_ACCOUNT`);
    }

    EDENRED_ACCOUNT_MAPPING[EDENRED_ACCOUNT] = ACTUAL_ACCOUNT
    ACTUAL_ACCOUNT_MAPPING[ACTUAL_ACCOUNT] = EDENRED_ACCOUNT

    var i = 1;
    while(true){
        edenred = process.env[`EDENRED_ACCOUNT_${i}`] || ""
        actualSplit = process.env[`ACTUAL_ACCOUNT_${i}`] || ""
        if (!edenred || !actualSplit) {
            break;
        }
        i++;
        EDENRED_ACCOUNT_MAPPING[edenred] = actualSplit;
        ACTUAL_ACCOUNT_MAPPING[actualSplit] = edenred;
    }
    if (IMPORT_FROM == "") {
        IMPORT_FROM = "1970-01-01"
    }
    const appConfig = {
        APP_PORT,
        APP_URL,
        EDENRED_USERNAME,
        EDENRED_PIN,
        EDENRED_VERSION,
        ACTUAL_ACCOUNT_MAPPING,
        EDENRED_ACCOUNT_MAPPING,
        ACTUAL_SERVER_URL,
        ACTUAL_SERVER_PASSWORD,
        ACTUAL_SYNC_ID,
        CRON_EXPRESSION,
        IMPORT_FROM
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
