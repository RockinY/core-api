// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { getPaymentPlanById } from '../../models/paymentPlans'
import { createInvoice } from '../../models/invoice'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'
import alipaySdk from '../../utils/alipay'
import AlipayFormData from 'alipay-sdk/lib/form'

type Input = {
  input: {
    paymentPlanId: string
  }
}

export default requireAuth(
  async (_: any, args: Input, { user }: GraphQLContext) => {
    if (!args.input.paymentPlanId) {
      return new UserError(
        'Missing payment plan Id. Please choose one payment plan.'
      )
    }

    const paymentPlan = await getPaymentPlanById(args.input.paymentPlanId)

    if (!paymentPlan || paymentPlan.deletedAt) {
      return new UserError(
        'Invalid payment plan. Please choose a correct one.'
      )
    }

    // create unpaid invoice
    const invoice = await createInvoice(paymentPlan, 'alipay', user.id)

    // Prepare the alipay form data
    const formData = new AlipayFormData()
    formData.setMethod('get')
    formData.addField('notifyUrl', 'https://dev.krae.cn')
    formData.addField('returnUrl', 'https://dev.krae.cn')
    formData.addField('bizContent', {
      outTradeNo: invoice.tradeNo,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: parseFloat(invoice.amount / 100).toFixed(2),
      subject: '云社会员订阅',
      body: paymentPlan.displayName,
    });

    const paymentUrl = await alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData }
    )

    return paymentUrl
  }
)