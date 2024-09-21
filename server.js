/*
 * EXAMPLE DB
 * userID - used to differenciate users' ratings
 * showID - id of the show being rated
 * rating - rating of the show (1-5 incl. halves)
 * review - (optional) written review of the series
 * timestamp - when the rating was submitted
*/

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = 3030

// Set up DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

app.use(express.json())  // To parse JSON bodies

// POST a rating
app.post('/rateShow', async (req, res) => {
  const { userId, showId, rating } = req.body

  const params = {
    TableName: 'Ratings',
    Item: {
      userId,
      showId,
      rating,
    },
  }

  try {
    const command = new PutCommand(params)
    await dynamoClient.send(command)
    res.status(200).send('Rating added!')
  } catch (error) {
    console.error('Error adding rating:', error)
    res.status(500).send('Error adding rating')
  }
})

// GET a specific user's ratings
app.get('/ratings/:userId', async (req, res) => {
  const userId = Number(req.params.userId)
  if (isNaN(userId)) {
    return res.status(400).send('Invalid userId');
  }
  const params = {
    TableName: 'Ratings',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }

  try {
    console.log("params: ", params)
    const command = new QueryCommand(params)
    const data = await dynamoClient.send(command)
    res.json(data.Items)
  } catch (error) {
    console.error('Error fetching ratings:', error)
    res.status(500).send('Error fetching ratings')
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})