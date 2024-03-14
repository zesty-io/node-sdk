# Example Content Import

> This is an example of importing a redirect in a Zesty.io instance using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


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

*Before running the example you will need to change the redirect details in the request payload `index.js`.*
```
npm run start
```

If successful you should see output in terminal that looks like this;
```
{
  statusCode: 201,
  _meta: {
    timestamp: '2024-03-13T09:58:12.973453033Z',
    totalResults: 1,
    start: 0,
    offset: 0,
    limit: 1
  },
  data: {
    ZUID: '19-84a7bbb19b-wgkmd3',
    path: '/redirect-to-zesty',
    targetType: 'external',
    target: 'https://www.zesty.io/',
    code: 301,
    query_string: null,
    createdByUserZUID: '5-a6f8ed9ba3-wd6jlj',
    updatedByUserZUID: '5-a6f8ed9ba3-wd6jlj',
    createdAt: '2024-03-13T09:58:12.967545385Z',
    updatedAt: '2024-03-13T09:58:12.967550043Z'
  }
}
```

and there should be a new redirect on your instance.