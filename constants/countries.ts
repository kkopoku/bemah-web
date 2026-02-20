import { getEmojiFlag, TCountryCode } from "countries-list";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export const countries = getCountries()
  .map((country) => ({
    code: country,
    name:
      new Intl.DisplayNames(["en"], { type: "region" }).of(country) || country,
    flag: getEmojiFlag(country as TCountryCode),
    dialCode: `+${getCountryCallingCode(country)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
