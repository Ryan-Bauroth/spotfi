const AWS = require('aws-sdk');
const { add } = require('winston');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "spotfidata";

const getUsers = async() => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoClient.scan(params).promise();
}

const addOrUpdateUsers = async (token, username) => {
    const params = {
        TableName: TABLE_NAME,
        Item: token,
        Item: username
    }
    return await dynamoClient.put(params).promise();
}

const getUserById = async (id) =>{
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.get(params).promise();
}

const deleteUser = async (id) =>{
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.delete(params).promise();
}

//const countDatabase = async () =>{
 //   const params = {
   //     TableName: TABLE_NAME,
    //    Select: "COUNT",
   //   };
//return await dynamoClient.scan(params).promise();
//}

//deleteUser({id: 0});

module.exports = {
    dynamoClient,
    getUserById,
    getUsers,
    addOrUpdateUsers,
    deleteUser,
    //countDatabase
}