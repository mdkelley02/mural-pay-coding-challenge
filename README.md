# Mural Pay Coding Challenge

## General Flow

1. User visits the home page and selects a product to purchase
2. User is redirected to the checkout page and confirms the purchase
3. Order is created in the database
4. User is redirected to the order page to provide the crypto payment details
5. Wagmi is used to connect to the user's wallet and sign the transaction
6. We handle the transaction receipt and create a payout request in Mural Pay
7. Mural Pay will observe the amount added to the user's account and send a webhook request to the server
8. The webhook request is handled and the order status is updated in the database

## Live Demo

https://mural-pay-coding-challenge-hvvl.vercel.app/

## Setup

### Install dependencies

```bash
npm install
```

### Setup Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Run the project

```bash
npm run dev
```

### Seed products

```bash
npm run seed-products
```
