# Example Content Import

> This is an example of importing content into a Zesty.io instance using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


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

*Before running the example you will need to change the user, model and field references as noted in the example `index.js`.*
```
npm run start
```

If successful you should see output in terminal that looks like this;
```
{
  statusCode: 201,
  _meta: {
    timestamp: '2020-04-14T22:24:34.540432415Z',
    totalResults: 1,
    start: 0,
    offset: 0,
    limit: 1
  },
  data: { ZUID: '7-a8b49e9f88-6v6fw0' }
}
```

and there should be a new item shown in the model you setup on your instance.