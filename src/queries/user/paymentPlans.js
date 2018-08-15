// @flow
import type { DBPaymentPlan } from '../../flowTypes'
import { getPaymentPlans } from '../../models/paymentPlans'

export default (): Array<DBPaymentPlan> => {
  return getPaymentPlans()
}

