// @flow
import db from '../db'
import type { DBMemberSubscription, DBInvoice } from '../flowTypes'
import dayjs from 'dayjs'
import { getPaymentPlanById } from './paymentPlans';
import { invoicePaid } from './invoice'

export const createMemberSubscription = async (invoice: DBInvoice) => {
  if (invoice.paid) {
    return null
  }
  const memberSubscription = await getMemberSubscriptionByInvoiceId(invoice.id)
  if (memberSubscription) {
    return null
  }

  let startAt = dayjs().startOf('day')

  const userSubscriptions = await getMemberSubscriptionsByuserId(invoice.customerId)
  const latestSubscription = userSubscriptions[0]
  if (latestSubscription && dayjs(latestSubscription.endAt).isAfter(startAt)) {
    startAt = dayjs(latestSubscription.endAt)
  }

  const paymentPlan = await getPaymentPlanById(invoice.paymentPlanId)
  const endAt = startAt.add(paymentPlan.duration, 'day')
  await invoicePaid(invoice.id)

  return db
    .table('memberSubscriptions')
    .insert(
      {
        userId: invoice.customerId,
        invoiceId: invoice.id,
        startAt: startAt.toDate(),
        endAt: endAt.toDate(),
        createdAt: new Date()
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

export const getMemberSubscriptionByInvoiceId = (
  invoiceId: string
): Promise<DBMemberSubscription> => {
  return db
    .table('memberSubscriptions')
    .getAll(invoiceId, { index: 'invoiceId' })
    .run()
    .then(result => (result ? result[0] : null))
}

export const getMemberSubscriptionsByuserId = (
  userId: string
): Promise<Array<DBMemberSubscription>> => {
  return db
    .table('memberSubscriptions')
    .getAll(userId, { index: 'userId' })
    .orderBy(db.desc('endAt'))
    .run()
}