/*
 * EXAMPLE DB
 * userID - used to differenciate users' ratings
 * showID - id of the show being rated
 * rating - rating of the show (1-5 incl. halves)
 * review - (optional) written review of the series
 * timestamp - when the rating was submitted
*/

import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb'
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb'
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

const docClient = DynamoDBDocumentClient.from(dynamoClient);

app.use(express.json())  // To parse JSON bodies

// POST a rating
app.post('/rateShow', async (req, res) => {
  const { userId, showId, rating } = req.body
  if (!userId || !showId || rating === undefined) {
    return res.status(400).send({
      error: 'Missing required parameters: userId, showId, and rating must be provided.'
    });
  }

  if (rating < 0.5 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 0.5 and 5.' });
  }

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
    await docClient.send(command)
    res.status(200).send('Rating added!')
  } catch (error) {
    console.error('Error adding rating:', error)
    res.status(500).send('Error adding rating')
  }
})

app.patch('/updateRating', async (req, res) => {
  const { userId, showId, rating } = req.body
  if (!userId || !showId || rating === undefined) {
    return res.status(400).send({
      error: 'Missing required parameters: userId, showId, and rating must be provided.'
    });
  }

  if (rating < 0.5 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 0.5 and 5.' });
  }

  const params = {
    TableName: 'Ratings',
    Key: {
      userId,
      showId,
    },
    UpdateExpression: 'set rating = :rating',
    ExpressionAttributeValues: {
      ':rating': rating
    },
    ReturnValues: 'UPDATED_NEW'
  }

  try {
    const command = new UpdateCommand(params)
    const data = await docClient.send(command);
    res.status(200).json({
      message: 'Rating updated!',
      updatedRating: data.Attributes,  
    })
  } catch (error) {
    console.error('Error adding rating:', error)
    res.status(500).send('Error adding rating')
  }
})

app.delete('/deleteRating/:userId/:showId', async (req, res) => {
  const { userId, showId } = req.params
  const params = {
    TableName: 'Ratings',
    Key: {
      userId: Number(userId),
      showId: Number(showId)
    }
  }

  try {
    const command = new DeleteCommand(params)
    await docClient.send(command)
    res.status(200).send('Deleted rating')

  } catch (error) {
    console.log('Error deleting rating: ', error)
    res.status(500).send('Error deleting rating')
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
    console.log('params: ', params)
    const command = new QueryCommand(params)
    const data = await docClient.send(command)
    res.json(data.Items || [])
  } catch (error) {
    console.error('Error fetching ratings:', error)
    res.status(500).send('Error fetching ratings')
  }
})

app.use('*', function (req, res, next) {
  res.status(404).send({
    error: `Requested resource '${req.originalUrl}' does not exist`
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})