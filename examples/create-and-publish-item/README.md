# Example Content Import

> This is an example of creating and publishing a content item into a Zesty.io instance using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


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
    timestamp: '2024-03-14T13:14:03.900224336Z',
    totalResults: 1,
    start: 0,
    offset: 0,
    limit: 1
  },
  data: {
    ZUID: '18-d8e4a6dcac-ghxzv3',
    itemZUID: '7-f29fe5d39c-szhrx6',
    version: 1,
    versionZUID: '9-80bee6dc9c-9krxlj',
    publishAt: '2024-03-14T13:14:03.890200458Z',
    unpublishAt: '2024-03-14T13:14:19Z',
    publishedByUserZUID: '5-a6f8ed9ba3-wd6jlj',
    message: null,
    createdAt: '2024-03-14T13:14:03.893761613Z',
    updatedAt: '2024-03-14T13:14:03.893763901Z'
  }
}
```

and there should be a new content item shown and published in the model you setup on your instance.