#! /usr/bin/env node
import figlet from "figlet"
import inquirer from "inquirer"
import chalk from "chalk"
import axios from "axios"
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';

class User {
    personalizedCurrencies: string[] = [];
    constructor(){
        this.personalizedCurrencies = [];
    }	
    addCurrency(currency: string) {
        this.personalizedCurrencies.push(currency);
    }
    removeCurrency(currency: string) {
        this.personalizedCurrencies = this.personalizedCurrencies.filter((c) => c !== currency);
    }
}

abstract class ApiHandler {
    async fetchCurrencyRates(basecurrency: string = 'USD') {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${basecurrency}`);
            const rates = response.data.rates;
            await writeFile('currencyRates.json', JSON.stringify(rates));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(chalk.red('There was an error fetching the currency rates:', error.message));
            } else {
                console.error(chalk.red('An unexpected error occurred:', error));
            }
        }
    }
};

class InquiryHandler extends ApiHandler{
    public basecurrency: string = ''; 
    protected currenyToConvert: string = '';
    protected amount: number = 0;
    private user : User;
    private currencyConverter : CurrencyConverter;	
    constructor() {
        super()
        this.user = new User();
        this.currencyConverter = new CurrencyConverter();
    }
   public async UserInquiry() {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Set Base Currency','Refresh currency rates', 'Convert currency','Favourite Currencies','Add Favourite Currency','Remove Favourite Currency','Exit']
            }
        ]).then((answers) => {
            switch (answers.action) {
                case 'Set Base Currency':
                    this.setBaseCurrency();
                    break;
                case 'Refresh currency rates':
                    this.refreshCurrencyRates();
                    break;
                case 'Convert currency':
                    this.askForCurrency();
                    break;
                case 'Favourite Currencies':
                    this.Favourite();
                    break;
                case 'Add Favourite Currency':
                    this.addFavourite();
                    break;
                case 'Remove Favourite Currency':
                    this.removeFavourite();
                    break;
                case 'Exit':
                    console.log(chalk.blue('Goodbye!'));
                    break;
                default:
                    console.error(chalk.red('Invalid action:', answers.action));
            } 
        }).catch((error) => {
            console.error(chalk.red('There was an error:', error));
        });
    }
    private async setBaseCurrency() {
        const response = await inquirer.prompt([
            {
            type: 'input',
            name: 'currency',
            message: 'What is your base currency? (e.g. USD, EUR, GBP, JPY, PKR, etc.)'
            }
        ]).then(async (answers) => {
            this.basecurrency = answers.currency.toUpperCase();
            console.log(chalk.green(`Base currency set to ${this.basecurrency}`));
            console.log(chalk.yellow('Fetching currency rates...'));
            await this.fetchCurrencyRates(this.basecurrency);
            console.log(chalk.green('Currency rates have been fetched!'));
            this.UserInquiry();
        }).catch((error) => {
            console.error(chalk.red('There was an error:', error));
        });
    }

    private async refreshCurrencyRates() {
        if (!this.basecurrency) {
            console.log(chalk.red('Please set a base currency before refreshing currency rates.'));
            return;
        }
        console.log(chalk.yellow('Fetching currency rates...'));
        await this.fetchCurrencyRates(this.basecurrency);
        console.log(chalk.green('Currency rates have been refreshed!'));
        this.UserInquiry();
    }

    private async askForCurrency() {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'convert to',
                message: 'What currency would you like to convert to? (e.g. USD, EUR, GBP, JPY,PKR, etc.)'
            },
            {
                type: 'input',
                name: 'amount',
                message: 'How much would you like to convert?'
            }
        ]).then((answers) => {
            this.currenyToConvert = answers['convert to'].toUpperCase();
            this.amount = parseInt(answers.amount);
    }).catch((error) => {
        console.error(chalk.red('There was an error:', error));
    });
    await this.currencyConverter.convertCurrency(this.basecurrency, this.currenyToConvert, this.amount);
    this.UserInquiry()
    }

    private async Favourite() {
        if (this.user.personalizedCurrencies.length === 0) {
            console.log(chalk.yellow('You have not added any currencies to your favourites yet.'));
            this.UserInquiry()
        } else {
            console.log(chalk.green('Your favourite currencies are:'));
            this.user.personalizedCurrencies.forEach((currency) => {
                console.log(chalk.green(currency));
            });
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'amount',
                    message: 'How much would you like to convert enter amount in numbers?'
                }
            ]).then((answers) => {
                this.amount = parseInt(answers.amount);
            }).catch((error) => {
                console.error(chalk.red('There was an error:', error));
            });
            await this.currencyConverter.FavouriteCurrencyConvertor(this.basecurrency, this.amount,this.user.personalizedCurrencies);
            this.UserInquiry()
        }}
        
    private async addFavourite() {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'currency',
                message: 'What currency would you like to add to your favourites? (e.g. USD, EUR, GBP, JPY, PKR, etc.)'
            }
        ]).then((answers) => {
            if (this.user.personalizedCurrencies.includes(answers.currency.toUpperCase())) {
                console.log(chalk.yellow('This currency is already in your favourites.'));
                return;
            } else {
                const currency : string = answers.currency.toUpperCase();
                this.user.addCurrency(currency)};
                console.log(chalk.green(`Currency ${answers.currency} has been added to your favourites.`));
        }).catch((error) => {
            console.error(chalk.red('There was an error:', error));
        });this.UserInquiry()
    } 
    private async removeFavourite() {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'currency',
                message: 'What currency would you like to remove from your favourites? (e.g. USD, EUR, GBP, JPY, PKR, etc.)'
            }
        ]).then((answers) => {
            if (!this.user.personalizedCurrencies.includes(answers.currency.toUpperCase())) {
                console.log(chalk.yellow('This currency is not in your favourites.'));
                return;
            } else {
                const currency : string = answers.currency.toUpperCase();
                this.user.removeCurrency(currency)};
                console.log(chalk.green(`Currency ${answers.currency} has been removed from your favourites.`));
        }).catch((error) => {
            console.error(chalk.red('There was an error:', error));
        });this.UserInquiry()
    }
};

class CurrencyConverter {
    async convertCurrency(basecurrency: string, currenyToConvert: string, amount: number){
        try {
            const currencyRates = JSON.parse(await readFile('currencyRates.json', 'utf-8'));
            const rate = currencyRates[currenyToConvert];
            if (rate) {
                const convertedAmount = Math.round(amount * rate * 100) / 100;
                console.log(chalk.greenBright(`${amount} ${basecurrency} is equal to ${convertedAmount} ${currenyToConvert}`));
            } else {
                console.log(chalk.red(`The currency ${basecurrency} is not supported.`));
            }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.error(chalk.red('Currency rates have not been fetched yet. Please refresh currency rates.'));
            } else {
                console.error(chalk.red('An unexpected error occurred:', error));
            }
        }
    }

    async FavouriteCurrencyConvertor(basecurrency: string, amount: number, personalizedCurrencies: string[]){
        try {
            const currencyRates = JSON.parse(await readFile('currencyRates.json', 'utf-8'));
            personalizedCurrencies.forEach((currency) => {
                const rate = currencyRates[currency];
                if (rate) {
                    const convertedAmount = Math.round(amount * rate * 100) / 100;
                    console.log(chalk.greenBright(`${amount} ${basecurrency} is equal to ${convertedAmount} ${currency}`));
                } else {
                    console.log(chalk.red(`The currency ${basecurrency} is not supported.`));
                }
            });
        } catch (error: any) {
            console.error(chalk.red('An unexpected error occurred:', error));
        }
    }

}

class App extends InquiryHandler {
    constructor() {
        super()
    }
    async start() {
        console.log(
            chalk.yellow(
                figlet.textSync('Currency Converter', { horizontalLayout: 'full' , font: 'Doom'})
            )
        );
        console.log(chalk.yellow('Welcome to the Currency Converter!'));
        console.log(chalk.yellow('Please set your base currency to get started.'));
        console.log(chalk.yellow('You can convert currencies, refresh currency rates, and add currencies to your favourites.'));
        await this.UserInquiry();
    }
}

const app = new App();
app.start();
