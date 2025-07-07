import mongoose, {Document, Schema, model} from "mongoose";

export interface IUser extends Document { //this interface defines the structure of the user document in MongoDB
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>(
    { //this schema defines the structure of the user document in MongoDB
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    }, 
    {
        timestamps: true //this will add createdAt and updatedAt fields to the document
    }
); 
export const UserModel = model<IUser>('User', UserSchema); //this will create a model for the user document in MongoDB
