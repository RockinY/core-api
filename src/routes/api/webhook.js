// @flow
import { Router } from 'express'
import alipaySdk from '../../utils/alipay'
import { getInvoiceByTradeNo } from '../../models/invoice'
import { createMemberSubscription } from '../../models/memberSubscription'

const debug = require('debug')('api:webhook')

const webhookRouter = Router()

// $FlowFixMe
webhookRouter.post('/alipay', async (req, res) => {
  // 异步通知验签
  debug(JSON.stringify(req.query))

  const body = req.query
  
  if (!alipaySdk.checkNotifySign(body)) {
    debug('Alipay aign failed.')
    return res.status(400).send('FAILED');
  }

  // 商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号
  const invoice = await getInvoiceByTradeNo(body.out_trade_no)
  if (!invoice || invoice.paid) {
    debug('Invalid invoice.')
    return res.status(400).send('FAILED');
  }

  // 判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额）
  if (parseFloat(invoice.amount / 100).toFixed(2) !== body.total_fee) {
    debug('Invalid invoice amount.')
    return res.status(400).send('FAILED');
  }

  // 校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方
  if (body.seller_id !== process.env.ALIPAY_SELLER_ID) {
    debug('Invalid seller id.')
    return res.status(400).send('FAILED');
  }

  // 验证app_id是否为该商户本身
  if (body.app_id !== process.env.ALIPAY_OAUTH_CLIENT_ID) {
    debug('Invalid app_id.')
    return res.status(400).send('FAILED');
  }

  if (body.trade_status === 'TRADE_SUCCESS') {
    debug('Sign success.')
    createMemberSubscription(invoice)
      .then(() => {
        return res.status(200).send('success');
      })
  } else {
    return res.status(400).send('FAILED');
  }
})

export default webhookRouter;