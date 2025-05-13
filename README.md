# sports-social-frontend
This is a Frontend for [sports-social-bff-api](https://github.com/aterna01/sports-social-bff-api)

It is built using [Next.js](https://nextjs.org), project is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

## Install all dependencies:
```
npm i
```

## Getting Started

Run the development server:

```
npm run dev
```

Now the application should be running on ```http://localhost:3000/```
Every change in the source code will automatically restart the server.

## Running tests
There are unit and E2E tests. For E2E tests we need BFF API & Front end app to be running. 

#### To run unit tests:
```npm test```

#### To run E2E tests:
Open terminal window 1 with front end src code and run
```npm run dev```

Open terminal window 2 with backend src code and run
```npm start```

Open terminal window 3 with front end src code and run
```npm run cypress:ui```
