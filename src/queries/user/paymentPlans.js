// @flow
import type { DBPaymentPlan } from '../../flowTypes'
import { getPaymentPlans } from '../../models/paymentPlans'

export default (): Promise<Array<DBPaymentPlan>> => {
  return getPaymentPlans()
}

