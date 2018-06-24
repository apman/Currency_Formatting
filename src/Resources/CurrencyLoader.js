
export default function loadCurrencies(handleResult) {
  fetch('./list_one.xml')
  .then(response => response.text())
  .then(str => {
    return (new DOMParser()).parseFromString(str, "text/xml")
  })
  .then(xmlDoc => {
    const elements = xmlDoc.getElementsByTagName("CcyNtry");
    let currencies = [];
    for (let i = 0; i < elements.length; i++) {
      const isCurrency = elements[i].getElementsByTagName("Ccy")[0] 
        && elements[i].getElementsByTagName("CtryNm")[0].innerHTML.indexOf("ZZ") === -1;
      if (isCurrency) {
        const currencyCode = elements[i].getElementsByTagName("Ccy")[0].childNodes[0].nodeValue;
        const existingEntry = currencies.find(currency => currency.code === currencyCode);
        if (existingEntry) {
          existingEntry.countries.push(elements[i].getElementsByTagName("CtryNm")[0].innerHTML);
        } else {
          let currency = {
            code: currencyCode, 
            name: elements[i].getElementsByTagName("CcyNm")[0].innerHTML,
            countries: [elements[i].getElementsByTagName("CtryNm")[0].innerHTML],
          };
          currencies.push(currency);
        }
      }
    } 
    currencies.sort((a, b) => (a.code < b.code) ? -1 : 1);
    console.log('%cDebug: %o %s', 'color: green', currencies[0], 'currencies[0]');      // TEMP ..
    handleResult(currencies);
    // return currencies;
    // return [currencies[0], 'test2'];
  })
}  
