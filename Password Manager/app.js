console.log('Password Manager');

var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
    .command('create', 'Create a new account', function(yargs) {
        yargs.options({
            website: {
                demand: true,
                alias: 'w',
                description: 'Website ( Facebook, Twitter, . . .)',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Username / Email',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Password',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master Password',
                type: 'string'
            }
        }).help('help');
    })
    .command('get', 'Retrieve an account', function(yargs) {
        yargs.options({
            website: {
                demand: true,
                alias: 'w',
                description: 'Website ( Facebook, Twitter, . . .)',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master Password',
                type: 'string'
            }
        }).help('help')
    })
    .help('help')
    .argv;

var command = argv._[0];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get accounts from 'accounts' using decryption
function getAccounts (masterPassword) {

    var encryptedAccounts = storage.getItemSync('accounts');
    var accounts = [];

    if (typeof encryptedAccounts !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    return accounts;
}

//save accounts to'accounts' using encryption
function saveAccounts (accounts, masterPassword) {

    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

    storage.setItemSync('accounts', encryptedAccounts.toString());

    return accounts;
}

//create an account
function createAccount (account, masterPassword) {
    var accounts = getAccounts(masterPassword);

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;
}

//get details of saved account
function getAccount (accountName, masterPassword) {

    var accounts = getAccounts(masterPassword);
    var matchedAccount;

    accounts.forEach(function(account) {
        if (account.website === accountName)
            matchedAccount = account;
    });

    return matchedAccount;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (command === 'create') {
    try {
        var createdAccount = createAccount({
            website: argv.website,
            username: argv.username,
            password: argv.password
        }, argv.masterPassword);
        console.log('Account created!');
        console.log(createdAccount);
    }catch (e){
        console.log('Something went wrong, unable to create account.');
    }

} else if (command === 'get') {
    try {
        var fetchedAccount = getAccount(argv.website, argv.masterPassword);

        if (typeof fetchedAccount === 'undefined') {
            console.log('Account not found');
        } else {
            console.log('Account found');
            console.log(fetchedAccount);
        }
    }catch (e){
        console.log('Something went wrong, account can\'t be fetched.');
    }
}

