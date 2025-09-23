import mongoose from "mongoose";

// create a schema
// model based off of that schema

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content:{
            type:String,
            required:true
        },
    },
    { timestamps: true } // createAt & updateAt
);

const Note = mongoose.model("Note", noteSchema)

export default Note;