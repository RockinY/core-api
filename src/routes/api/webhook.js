// @flow
import { Router } from 'express'
import alipaySdk from '../../utils/alipay'
import { getInvoiceByTradeNo } from '../../models/invoice'
import { createMemberSubscription } from '../../models/memberSubscription'

const webhookRouter = Router()

// $FlowFixMe
webhookRouter.post('/alipay', async (req, res) => {
  // 异步通知验签
  console.log(req.body);
  
  if (!alipaySdk.checkNotifySign(req.body)) {
    return
  }

  // 商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号
  const invoice = await getInvoiceByTradeNo(req.body.out_trade_no)
  if (!invoice || invoice.paid) {
    return
  }

  // 判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额）
  if (parseFloat(invoice.amount / 100).toFixed(2) !== req.body.total_fee) {
    return
  }

  // 校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方
  if (req.body.seller_id !== process.env.ALIPAY_SELLER_ID) {
    return
  }

  // 验证app_id是否为该商户本身
  if (req.body.app_id !== process.env.ALIPAY_OAUTH_CLIENT_ID) {
    return
  }

  if (req.body.trade_status === 'TRADE_SUCCESS') {
    createMemberSubscription(invoice)
      .then(() => {
        res.status(200).send('SUCCESS');
      })
  }
})

export default webhookRouter;