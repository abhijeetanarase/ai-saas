import { NextFunction, Request , Response } from "express";
import { Blog } from "../models/blogModel";
import asyncHandler from "../utils/asyncHandler";
import { makeRequest } from "../utils/gmini";


export const createBlogs =  asyncHandler(async (req: Request, res: Response , next :NextFunction) => {
     const { topic  , tone , length  } : { topic : string , type : string , tone : string , length : number} = req.body;
     if(!topic || !tone || !length) return next({message : "All fileds required" , statusCode : 400})
     const systemPrompt:string  = `Create the blog about following topic with tone ${tone} and with the length ${length}`
     const text = await makeRequest(systemPrompt ,topic);
     const blog =  await Blog.create({content : text , tone , length , topic :topic});
     res.status(201).json({message : "Blog created successfully" , topic ,  blog });
})


export const publishBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const {
    template,
    coverImage,
    accentColor,
    customCSS,
    author,
  } = req.body;
  const blog = await Blog.findById(id);
  if (!blog) return next({ message: "No blog found", statusCode: 404 });
  blog.isPublic = true;
  if (template) blog.template = template;
  if (coverImage) blog.coverImage = coverImage;
  if (accentColor) blog.accentColor = accentColor;
  if (customCSS) blog.customCSS = customCSS;
  if (author) blog.author = author;
  blog.publishedAt = new Date();
  // Slugify utility
  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  const authorSlug = blog.author?.name ? slugify(blog.author.name) : 'author';
  const topicSlug = blog.topic ? slugify(blog.topic) : 'blog';
  blog.publicPath = `/public/blog/${authorSlug}/${topicSlug}`;
  await blog.save();
  res.status(200).json({ message: "Blog published", data: blog });
});


export const updateBlogs = asyncHandler(async(req :Request , res :Response , next:NextFunction)=>{
     const {content, topic, template, coverImage, accentColor, customCSS, author, isPublic} = req.body;
     const id = req.params.id;
     const blog = await Blog.findById(id);
     if(!blog) return next({message : "No blog found"})
     if(content)  blog.content = content;
     if(topic) blog.topic = topic;
     if(template) blog.template = template;
     if(coverImage) blog.coverImage = coverImage;
     if(accentColor) blog.accentColor = accentColor;
     if(customCSS) blog.customCSS = customCSS;
     if(author) blog.author = author;
     if(typeof isPublic === 'boolean') blog.isPublic = isPublic;
     await blog.save();
     res.status(200).json({message : "Saved"});
})


export const getAllBlogs = asyncHandler(async(req:Request , res :Response , next :NextFunction)=>{
     const {p = 1 , n = 10 , search = ""  , sortBy = "" , order = '' } = req.query;
     let filter:any  = { };
     if(search) {
          filter["topic"] =  {$regex : search , $options : "i"};
     }
     const sortField = typeof sortBy === "string" && sortBy ? sortBy : "createdAt";
     const sortOrder = order === "desc" ? -1 : 1;
     const sortObj:any = { [sortField]: sortOrder };
     const blogs = await Blog.find(filter , "-content")
       .sort(sortObj)
       .skip((Number(p)-1)*Number(n))
       .limit(Number(n));
     const total = await Blog.countDocuments(filter);
     res.json({data : blogs , total})
})


export const getBlog = asyncHandler(async(req:Request , res :Response , next :NextFunction)=>{
    const id = req.params.id;
     const blog = await Blog.findById(id).populate("template");
     res.json({data : blog})
})


export const getBlogByPublicPath = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { author, topic } = req.params;
  // Convert dashes to spaces for matching
  const authorName = author.replace(/-/g, ' ');
  const topicName = topic.replace(/-/g, ' ');
  const blog = await Blog.findOne({
    isPublic: true,
    'author.name': new RegExp('^' + authorName + '$', 'i'),
    topic: new RegExp('^' + topicName + '$', 'i'),
  }).populate('template');
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ data: blog });
});




