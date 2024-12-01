const countryCurrencyMap: { [countryCode: string]: string } = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  EU: "EUR",
  IN: "INR",
  AU: "AUD",
  NZ: "NZD",
  JP: "JPY",
  CN: "CNY",
  KR: "KRW",
  SG: "SGD",
  MY: "MYR",
  TH: "THB",
  ID: "IDR",
  VN: "VND",
  PH: "PHP",
  AE: "AED",
  SA: "SAR",
  RU: "RUB",
  ZA: "ZAR",
  NG: "NGN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  MX: "MXN",
  CO: "COP",
  PE: "PEN",
  TR: "TRY",
  IL: "ILS",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  HK: "HKD",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  EG: "EGP",
  KE: "KES",
  GH: "GHS",
  UG: "UGX",
  TZ: "TZS",
  MA: "MAD",
  DZ: "DZD",
  ET: "ETB",
  QA: "QAR",
  KW: "KWD",
  OM: "OMR",
  BH: "BHD",
  JO: "JOD",
  LB: "LBP",
  IR: "IRR",
  IQ: "IQD",
  AF: "AFN",
  UZ: "UZS",
  KZ: "KZT",
  UA: "UAH",
  BY: "BYN",
  GE: "GEL",
  AZ: "AZN",
};

export function getCurrencyByCountry(countryCode: string): string {
  return countryCurrencyMap[countryCode] || "USD";
}

export const remapFlightResponseToLegs = (flightResponse: any) => {
  return flightResponse.map((flight: any) => {
    const firstSegment = flight.segments[0];
    const leg = {
      origin: {
        city: flight.origin.city,
        displayCode: flight.origin.displayCode,
      },
      destination: {
        city: flight.destination.city,
        displayCode: flight.destination.displayCode,
      },
      date: firstSegment.departure.split("T")[0],
    };

    return leg;
  });
};
