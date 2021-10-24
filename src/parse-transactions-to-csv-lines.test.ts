import { parse } from './parse-transactions-to-csv-lines'

const exampleOldInput = `{"data":{"emv":[{"amount":-7.73,"date":"2019-12-05 18:26:06","detail":"EXPRESS GENT ST LIEVENSPOGENT BE"},{"amount":-7.2,"date":"2019-12-05 12:32:55","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-6.32,"date":"2019-12-04 17:48:39","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-3.2,"date":"2019-12-04 12:41:35","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-10.8,"date":"2019-12-03 12:31:50","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-1.49,"date":"2019-12-02 17:52:20","detail":"RENMANS 2240 MERELBEKE MERELBEKE BE"},{"amount":-24.43,"date":"2019-12-02 17:48:23","detail":"ALDI 2081 MERELBEKE TIENEN BE"},{"amount":-5.28,"date":"2019-12-02 12:21:31","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-6.7,"date":"2019-11-28 12:24:53","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-21.75,"date":"2019-11-27 17:56:29","detail":"LEDEBERG RETAIL LEDEBERG BE"}]}}`
const exampleNewInput = `{"data":{"emv":[{"amount":-7.73,"date":"2019-12-05 18:26:06","detail":"Purchase at EXPRESS GENT ST LIEVENSPOGENT BE"},{"amount":-7.2,"date":"2019-12-05 12:32:55","detail":"Purchase at BON'AP MERELBEKE MERELBEKE BE"},{"amount":-6.32,"date":"2019-12-04 17:48:39","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-3.2,"date":"2019-12-04 12:41:35","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-10.8,"date":"2019-12-03 12:31:50","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-1.49,"date":"2019-12-02 17:52:20","detail":"RENMANS 2240 MERELBEKE MERELBEKE BE"},{"amount":-24.43,"date":"2019-12-02 17:48:23","detail":"ALDI 2081 MERELBEKE TIENEN BE"},{"amount":-5.28,"date":"2019-12-02 12:21:31","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":-6.7,"date":"2019-11-28 12:24:53","detail":"BON'AP MERELBEKE MERELBEKE BE"},{"amount":100.00,"date":"2019-11-27 17:56:29","detail":"Issuing Monizze meal vouchers"}]}}`

test('parse old style input', () => {
  expect(parse(JSON.parse(exampleOldInput).data.emv)).toMatchSnapshot()
})

test('parse new style input', () => {
  expect(
    parse(JSON.parse(exampleNewInput).data.emv, 'Some Company NV')
  ).toMatchSnapshot()
})
