import express from 'express';
import {
  createTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController';

const router = express.Router();

router.post('/', createTemplate);
router.get('/', getAllTemplates);
router.get('/:id', getTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router; 