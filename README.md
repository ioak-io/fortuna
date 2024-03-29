# Fortuna

The application aims to provide users with a robust and user-friendly financial management tool, enabling efficient tracking, analysis, and visualization of expenses. It seeks to empower users to make informed financial decisions by offering comprehensive insights into their spending habits and financial health.

## Overview

The web application offers a comprehensive financial management platform allowing users to record expenses and income, plan and track expenses against a budget, and categorize expenses into custom lists. It introduces a unique feature of mapping expense categories into Kakeibo quadrants for a distinct view of spending patterns. The application provides detailed visual charts, computes expected weekly spending based on historical data, enables balancing accounts, supports custom filters, and simplifies data export and import through CSV formats.

## Key Features
- Expense and Income Tracking: Record expenses and income seamlessly.
- Budget Planning and Tracking: Monitor expenses against a set budget.
- Custom Category Management: Categorize expenses using personalized lists.
- Kakeibo Quadrant Mapping: Unique visualization for spending patterns.
- Visual Charts: Comprehensive visual representations of spending data.
- Expected Weekly Spend: Intelligent computation based on spending history.
- Account Balancing: Declare opening and closing balances for various accounts.
- Custom Filters: Create, store, and reuse personalized views.
- Dynamic Dashboard: Charts adapt based on selected filters.
- Data Export/Import: Easy-to-use CSV format for managing data.

## Supported Node.js and npm Versions

This project is developed and tested with the following versions:

- Node.js: v20.0.0 or higher
- npm: v10.0.0 or higher

## Prerequisites and dependencies
- MongoDB on localhost:27017
- Fortuna REST API service module (https://github.com/ioak-io/fortuna-service)
- (Optional) For advanced local setup using a local instance of Authlite server,
    - Authlite web application module (https://github.com/ioak-io/authlite)
    - Authlite REST API service module (https://github.com/ioak-io/authlite-service)


## Installation

1. Clone the repository: `git clone https://github.com/ioak-io/fortuna.git`
2. Navigate to the project directory: `cd fortuna`
3. Install dependencies: `npm install`

## Usage

1. Run the development server: `npm start`
2. Open your browser and go to `http://localhost:3000` to view the app.
3. To simplify local development, the application is by default configured to connect to remote Authlite server for authentication. You may use below shared user credentials to sign in to the app. You can also choose to setup your own local version of Authlite by changing the configuration in .env files (but usually an overkill and unneccesary setup, if you are not making any changes to the authentication layer)
    - username: jane.doe@ioak.org
    - password: suddenlylastsummer
4. Create a new company to get started

## Dependency Updates

The dependencies in this project are regularly reviewed and updated. The last check for updated versions was performed on 29th Dec 2023.

To check for updates and update the dependencies, run the following command: `npm outdated`

## License

This project is licensed under the [MIT License](LICENSE).

The MIT License is a permissive open-source license that allows you to use, modify, and distribute the code, even for commercial purposes, provided you include the original copyright notice and the disclaimer of warranty.

For more information, see the [MIT License](LICENSE) file.
