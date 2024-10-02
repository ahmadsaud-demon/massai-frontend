// src/aws-exports.js
const awsConfig = {
  Auth: {
    Cognito:{
      region: 'ap-south-1', // e.g., 'us-east-1'
      userPoolId: 'ap-south-1_6otCpX4GV', // e.g., 'us-east-1_XXXXXX'
      userPoolClientId: '5eji07sfbqhi4ef4ola9hr20mo', // e.g., '25ddkmj4v6hfsd7example'
      // userPoolClientSecret: '167sugnk8j2bktishom8qad6pat5tu4e8kj4d60l6o5neq0vce87',
      loginWith: { // Optional
        // oauth: {
        //   domain: 'abcdefghij1234567890-29051e27.auth.us-east-1.amazoncognito.com',
        //   scopes: ['openid email phone profile aws.cognito.signin.user.admin '],
        //   redirectSignIn: ['http://localhost:3000/','https://example.com/'],
        //   redirectSignOut: ['http://localhost:3000/','https://example.com/'],
        //   responseType: 'code',
        // },
        },
        username: true,
        email: 'false', // Optional
        phone: 'false', // Optional
      }
    }
    
    
  };
  

export default awsConfig;
