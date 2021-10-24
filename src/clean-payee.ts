export const removeMonizzePrefix = (str: string) =>
  str.replace('Purchase at ', '')
export const replaceIssuingCompanyName = (str: string, companyName?: string) =>
  companyName == null
    ? str
    : str.replace('Issuing Monizze meal vouchers', companyName)
export const capitalizeFirstLetterOfEachWord = (str: string) =>
  str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
