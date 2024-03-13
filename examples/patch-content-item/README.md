# Example Content Import

> This is an example of updating a content item's in a Zesty.io instance using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


### Create an Environment File
*You can access the Instance ZUID from accounts, the ZUID should start with 8-XXXX. You can access your developer token from the content manager editor taken, under the external editing tab at the bottom of the code editor.*

filename: `.env`
```
ZESTY_INSTANCE_TOKEN=
ZESTY_INSTANCE_ZUID=
```

### Install Dependencies

For this example look at the `package.json` file to see the required dependencies. These can be installed with [NPM](https://www.npmjs.com/get-npm) and the following terminal command.

```
npm install
```

### Run Example

*Before running the example you will need to change the model and field references as noted in the example `index.js`.*
```
npm run start
```

If successful you should see output in terminal that looks like this;
```
{
  statusCode: 200,
  _meta: {
    timestamp: '2024-03-13T09:48:18.244392995Z',
    totalResults: 2,
    start: 0,
    offset: 0,
    limit: 2
  },
  data: { ZUID: '7-96e1c7efd2-sbjfjm', version_zuid: '9-ecaecca1cc-db45jm' }
}
```

and the data passed for the selected model item should be updated.