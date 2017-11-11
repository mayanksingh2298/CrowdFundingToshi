# Toshi CrowdFunding App
This app would best cater the needs of a society, where every person can have this app in their mobiles, and whenever they face a problem in their society, they can register their problem on the app. They can donate money to the Society Funding(Ethereum Wallet). In the same way they can delete a problem and withdraw the money from the Society Funding. To make it secure, every action gets stored in a history, or in other words, everyone knows what everyone did. So there's no cheating.

If it is used in the way it is intended, it is a stop solution for all society management problems.

### Prerequisites
Make sure you have Docker and Docker-compose

https://docs.docker.com/engine/installation/

https://docs.docker.com/compose/install/

Get the Toshi Dev app here

https://github.com/toshiapp/toshi-android-client/releases/tag/v1.0.7


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

```
docker-compose up
```

```
Open the Toshi dev app on your mobile
```

```
Go to scan, and scan the QR code in archerbot.png
```
Voila! You are ready to use the app

If any new depencies are added you can rebuild the project with

```
docker-compose build
```

To reset the postgres database in your dev environment you can use

```
docker-compose down -v
```
## How to use?

When you open the Toshi Dev app on your phone, the chatbot will provide the following commands

* *Add Problem* - This adds some problem to the society database
* *Delete Problem* - This deletes some problem from the society database
* *Donate* - used to donate some money to the Society Fund
* *Withdraw* - used to withdram some money from the Society Fund
* *View Problems* - used to view those problems which the society is facing 
* *History* - used to get a list of all activities that took place


## Built With

* [Toshi](https://www.toshi.org) - The main framework used
