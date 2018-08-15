// @flow
import db from '../db'
import type { DBPaymentPlan } from '../flowTypes'

export const getPaymentPlans = (): Array<DBPaymentPlan> => {
  return db
    .table('paymentPlans')
    .orderBy('duration')
    .filter(plan => db.not(plan.hasFields('deletedAt')))
    .run()
}