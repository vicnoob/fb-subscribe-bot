var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json')

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

var tableName = 'Users'

class UsersServices {
  getAllUsers () {
    let params = {
      TableName: tableName
    };
    return new Promise ((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data.Items)
        }
      });
    })
  }
  
  addNewUsers (userId) {
    let params = {
      TableName: tableName,
      Item: {
        'userId': userId
      }
    }

    return new Promise (function(resolve, reject) {
      docClient.put(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  
  deleteUsers (userId) {
    let params = {
      TableName: tableName,
      Key: {
        'userId': userId
      },
    }
    return new Promise (function(resolve, reject) {
      docClient.delete(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      });
    })
  }  
}

module.exports._UsersServices = new UsersServices()
