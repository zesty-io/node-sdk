# Example for Zesty.io SDK

> Example of uploading media to a Zesty.io instance bin using the [`node-sdk`](https://github.com/zesty-io/node-sdk)


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

*Before running the example you will need to change any references noted in the example `index.js`.*
```
npm run start
```

If successful you should see output in terminal that looks like this;
```
{
  statusCode: 201,
  message: 'File uploaded',
  status: 'Created',
  data: [
    {
      id: '3-9f1ad3b-4488k',
      bin_id: '1-76a04cf-dgpem',
      group_id: '1-76a04cf-dgpem',
      filename: 'zesty-io-logo.svg',
      title: 'Zesty.io Logo',
      url: 'https://dg1wqtbj.media.zestyio.com/zesty-io-logo.svg',
      type: 'file'
    }
  ],
  code: 201
}
```

and there should be a new file located in your instances media bin.