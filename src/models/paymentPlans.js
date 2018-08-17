// @flow
import db from '../db'
import type { DBPaymentPlan } from '../flowTypes'

export const getPaymentPlans = (): Promise<Array<DBPaymentPlan>> => {
  return db
    .table('paymentPlans')
    .orderBy('duration')
    .filter(plan => db.not(plan.hasFields('deletedAt')))
    .run()
}

export const getPaymentPlanById = (planId: string): Promise<DBPaymentPlan> => {
  return db
    .table('paymentPlans')
    .get(planId)
    .run()
}