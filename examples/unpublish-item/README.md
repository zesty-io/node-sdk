# Example Content Import

> This is an example of unpublishing a content item in your Zesty.io instance using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


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

*Before running the example you will need to change the model and item references as noted in the example `index.js`.*
```
npm run start
```

If successful you should see output in terminal that looks like this;
```
{
  statusCode: 200,
  _meta: {
    timestamp: '2024-03-14T13:22:33.585368919Z',
    totalResults: 1,
    start: 0,
    offset: 0,
    limit: 1
  },
  data: { ZUID: '18-fac49c9bff-t354h5' }
}
```

and the published content item should be unpublished in the model you setup on your instance.