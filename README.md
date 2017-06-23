# webtask

This is a webtask implementation to receive requests by github webhook and storage the events in a MongoDB.

I'll give the steps to use this webtaks:

#### Register on webtask.io

Enter in https://webtask.io and sign up, after that follow the short example to understand how webtask work.

#### Create a webtask URL

Execute the command on terminal:

```console
  wt create --secret SECRET=123456 --secret MONGO_URL=mongodb://<user>:<password>@ds131782.mlab.com:31782/fmyfabio Webtask.js
```
Parameters:

  > **SECRET** is a key used to generate a token on github webhook.
  
  > **MONGO_URL** is a Mongo Database URL.

The result will be some thing like:

```console
  https://wt-6b7699b4c4a96482636e6273c85243f7-0.run.webtask.io/Webtask
```
Save a webtask url created.

*Note: You can also create a fast mongo database to test in https://mlab.com.*

#### Setup github webhook

1. Acess the settings of your repository on github
2. Go in **Webhooks** options and click in **Add webhook**
3. In **Payload URL** put the webtask url created, note that is requeired a parameter request in this url to work with github, then you have to fill the url like this: webtask_url + *'?origin=github'* 

> **Example:** https://wt-6b7699b4c4a96482636e6273c85243f7-0.run.webtask.io/Webtask?origin=github

4. Select the Content Type **application/json**
5. Fill the field **Secret** with the SECRET sent in webtask create in the first step.
6. Select the option **'Send me everything'**

Then your github is ready to send a request to webtask service every time when any action is made, make a test 'Unstar' and 'Star' your repository.

#### Checking the events history

Acess in any browser the following url: webtask_url + *'?origin=search'* 

> **Example:** https://wt-6b7699b4c4a96482636e6273c85243f7-0.run.webtask.io/Webtask?origin=search

#### Finish

I hope help you create a interesting integration of webtask.io ;)

