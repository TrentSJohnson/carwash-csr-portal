import express from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMemberVehicles,
  getMemberSubscriptions,
  getMemberTransactions,
  getMemberActivities,
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getMembers);
router.get('/:id', getMember);
router.get('/:id/vehicles', getMemberVehicles);
router.get('/:id/subscriptions', getMemberSubscriptions);
router.get('/:id/transactions', getMemberTransactions);
router.get('/:id/activities', getMemberActivities);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
