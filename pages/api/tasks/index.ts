import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('todo-app'); 

    if (req.method === 'GET') {
      // Fetch all tasks
      const tasks = await db.collection('tasks').find({}).toArray();
      return res.status(200).json({ tasks });
    } 
    
    else if (req.method === 'POST') {
      // Add a new task with validation for empty or duplicate tasks
      const { taskText } = req.body;
      if (!taskText || taskText.trim() === '') {
        return res.status(400).json({ message: 'Task text is required' });
      }

      // Check for duplicate task
      const duplicate = await db.collection('tasks').findOne({ text: taskText });
      if (duplicate) {
        return res.status(400).json({ message: 'Task already exists' });
      }

      const result = await db.collection('tasks').insertOne({ text: taskText, completed: false });
      const newTask = await db.collection('tasks').findOne({ _id: result.insertedId });
      return res.status(201).json(newTask);
    } 
    
    else if (req.method === 'PUT') {
      // Update task (mark as completed/incomplete or edit the task)
      const { taskId, completed, taskText } = req.body;

      if (!taskId || (completed === undefined && !taskText)) {
        return res.status(400).json({ message: 'Task ID and either completed status or task text are required' });
      }

      // Check if the task exists
      const task = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      let updateData: { completed?: boolean; text?: string } = {};

      // Update completion status if provided
      if (typeof completed !== 'undefined') {
        updateData.completed = completed;
      }

      // Update task text (for editing) if provided
      if (taskText && taskText.trim() !== '') {
        updateData.text = taskText;
      }

      const result = await db.collection('tasks').updateOne(
        { _id: new ObjectId(taskId) },
        { $set: updateData }
      );

      // Return the updated task
      const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
      return res.status(200).json(updatedTask);
    } 
    
    else if (req.method === 'DELETE') {
      // Delete a task
      const { taskId } = req.body;
      if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required' });
      }
      await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
      return res.status(200).json({ message: 'Task deleted successfully' });
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
