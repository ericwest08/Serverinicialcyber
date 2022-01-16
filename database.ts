import mongoose from 'mongoose'

export async function startConnection() {
    await mongoose.connect('mongodb://localhost/safebuy');
    console.log('Database is connected');
}