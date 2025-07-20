import mongoose from "mongoose";

interface IBlog {
    content : string,
    length : number ,
    tone : string ,
    isPublic : boolean,
    topic : string,
    template?: mongoose.Schema.Types.ObjectId,
    coverImage?: string,
    accentColor?: string,
    customCSS?: string,
    author?: {
      name: string,
      image: string,
      id?: string,
    },
    publishedAt?: Date,
    publicPath?: string,
}

const blogSchema = new mongoose.Schema<IBlog>({
    content: {
        type: String,
        required: true,
    },
    length : {
        type :Number ,
        required :true
    },
    tone : {
        type :String,
        required :true
    },
    topic : {
        type :String,
        required :true
    },
   isPublic : {
        type: Boolean,
        default: false
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      default: null,
    },
    coverImage: String,
    accentColor: String,
    customCSS: String,
    author: {
      name: String,
      image: String,
      id: String,
    },
    publishedAt: Date,
    publicPath: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);