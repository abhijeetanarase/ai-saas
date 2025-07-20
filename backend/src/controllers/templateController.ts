import { Request, Response, NextFunction } from 'express';
import { Template } from '../models/templateModel';
import asyncHandler from '../utils/asyncHandler';

// Create Template
export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await Template.create(req.body);
  res.status(201).json({ data: template });
});

// Get All Templates
export const getAllTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { p = 1, n = 10, search = '', sortBy = '', order = '' } = req.query;
  let filter: any = {};
  if (search) {
    filter["name"] = { $regex: search, $options: "i" };
  }
  // System template names
  const systemNames = [
    'Modern Glass', 'Classic News', 'Minimal Dark', 'Sunset Card', 'Emerald Note', 'Royal Purple', 'Oceanic', 'Paper Sheet', 'Cyber Night', 'Peachy', 'Slate Minimal', 'Sunrise', 'Aqua Card', 'Rose Elegant'
  ];
  // Custom sort: system templates first, then user templates
  const sortObj: any = {
    // System templates get 0, user templates get 1
    isSystem: {
      $cond: [{ $in: ["$name", systemNames] }, 0, 1]
    },
    createdAt: 1
  };
  // Use aggregation for custom sort
  const templates = await Template.aggregate([
    { $match: filter },
    {
      $addFields: {
        isSystem: { $cond: [{ $in: ["$name", systemNames] }, 0, 1] }
      }
    },
    { $sort: { isSystem: 1, createdAt: -1 } },
    { $skip: (Number(p) - 1) * Number(n) },
    { $limit: Number(n) },
  ]);
  const total = await Template.countDocuments(filter);
  res.json({ data: templates, total });
});

// Get Template by ID
export const getTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ data: template });
});

// Update Template
export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ data: template });
});

// Delete Template
export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await Template.findByIdAndDelete(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ message: 'Template deleted' });
}); 