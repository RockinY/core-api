import AlipaySdk from 'alipay-sdk'

if (!process.env.ALIPAY_OAUTH_PRIVATE_KEY || !process.env.ALIPAY_OAUTH_PUBLIC_KEY) {
  throw new Error(
    'Looks like youre missing alipay auth keys!'
  )
}

const alipaySdk = new AlipaySdk(
  {
    appId: process.env.ALIPAY_OAUTH_CLIENT_ID,
    privateKey: process.env.ALIPAY_OAUTH_PRIVATE_KEY.replace(/\\n/g, "\n"),
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
    keyType: 'PKCS8'
  }
)

export default alipaySdk