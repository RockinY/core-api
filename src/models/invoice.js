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
        paid: false,
        createdAt: new Date()
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

export const getInvoiceByTradeNo = (tradeNo: string) => {
  return db
    .table('invoices')
    .getAll(tradeNo, { index: 'tradeNo' })
    .run()
    .then(result => (result ? result[0] : null))
}

export const getInvoiceById = (id: string) => {
  return db
    .table('invoices')
    .get(id)
    .run()
}

export const invoicePaid = (invoiceId: string): Promise<DBInvoice> => {
  return db
    .table('invoices')
    .get(invoiceId)
    .update({
      paid: true
    })
    .run()
    .then(async () => {
      return getInvoiceById(invoiceId)
    })
}