# Currency Converter CLI

This is a simple command-line interface (CLI) application for converting currencies. It allows you to set a base currency, fetch currency rates, convert between currencies, manage favorite currencies, and more.

## Features

1. **Set Base Currency**: Choose a base currency (e.g., USD, EUR, GBP) to perform conversions.
2. **Refresh Currency Rates**: Fetch the latest currency exchange rates.
3. **Convert Currency**: Convert an amount from the base currency to another currency.
4. **Manage Favorite Currencies**:
   - Add currencies to your favorites.
   - Remove currencies from your favorites.
   - Convert an amount to multiple favorite currencies at once.

## Usage

1. **Installation**:
   - Clone this repository.
   - Run `npm install axios figlet inquirer chalk` to install dependencies.

2. **Run the CLI**:
   - Execute `node index.js` to start the Currency Converter CLI.
   - Follow the prompts to perform various actions.

3. **Available Commands**:
   - Set Base Currency
   - Refresh Currency Rates
   - Convert Currency
   - View Favorite Currencies
   - Add Favorite Currency
   - Remove Favorite Currency
   - Exit

4. **Currency Codes**:
   - Use standard currency codes (e.g., USD, EUR, GBP).
   - The CLI will fetch exchange rates based on the specified base currency.

5. **Notes**:
   - Currency rates are fetched from the ExchangeRate-API.
   - Favorite currencies are stored locally in a JSON file.

## Example Usage

1. Set Base Currency:
   - Choose your base currency (e.g., USD).
   - Fetch the latest currency rates.

2. Convert Currency:
   - Specify the currency to convert to (e.g., EUR).
   - Enter the amount to convert.
   - View the converted amount.

3. Manage Favorite Currencies:
   - Add currencies to your favorites.
   - Remove currencies from your favorites.
   - Convert an amount to multiple favorite currencies.

## Disclaimer

This CLI is for educational purposes only. Use real-world currency conversion services for accurate financial transactions.

---

Feel free to explore and enhance this Currency Converter CLI! 🚀
