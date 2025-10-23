import { Router } from 'express';
import { tenantAdmin } from '@fortuna/middlewares';
import { migrateTenantSchema } from '@fortuna/db-migration';
import {
  ManageTeamsRequest,
  ManageTeamsResponse,
} from '../types/tenantTypes';

const router: Router = Router({ mergeParams: true });

router.post('/', tenantAdmin, async (req: ManageTeamsRequest, res: ManageTeamsResponse) => {
  const tenant = req.tenant;
  const realm = req.realm;
  await migrateTenantSchema(realm, tenant);
  res.send({ success: true });
});

export default router;
