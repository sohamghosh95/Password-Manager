# Password Manager

Password Manager that helps store and manage passwords locally using encryption.

>Technologies used : Node.JS, node-persist module, yards module and crypto-js module 

NPM Modules

  - node-persist
```sh
npm install node-persist@0.0.6 --save
```
  - yargs
```sh
npm install yargs@3.15.0 --save
```
  - crypto-js
```sh
npm install crypto-js@3.1.5 --save
```


To save account details, it aks the user for website name, username, password and a master key.
```sh
node app.js create -w twitter -u foobar@gmail.com -p foobar123 -m master123
```
Account details are stored locally on user's computer using AES encryption algorithm.

To fetch the details user needs to enter the website name and master key.
```sh
node app.js get -w twitter -m master123
```

