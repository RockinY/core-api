// @flow
import db from '../db'
import type { DBPaymentPlan, DBInvoice, paymentmethod } from '../flowTypes'

const generateTradeNo = (): string => {
  const date = new Date();
  const rand = Math.floor(Math.random() * 8999) + 1000
  return `${date.getTime()}${rand}`
}

export const createInvoice = (
  plan: DBPaymentPlan,
  paymentMethod: paymentmethod,
  customerId: string
): Promise<DBInvoice> => {
  const date = new Date();
  const tradeNo = ``
  return db
    .table('invoices')
    .insert(
      {
        amount: plan.price,
        paymentMethod: paymentMethod,
        customerId: customerId,
        paymentPlanId: plan.id,
        tradeNo: generateTradeNo(),
        paid: false
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}