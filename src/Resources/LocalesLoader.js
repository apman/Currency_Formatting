import * as allLocales from '../../node_modules/i18n-locales';

export default function loadLocales(includeGeneric = false) {  // TODO:  simplify if filtering is done after formatting
    const locales = (includeGeneric) 
        ? allLocales
        // : allLocales.filter(locale => locale.indexOf('-') > -1);  // TEMP restrict to generic only
        : allLocales.filter(locale => (locale.indexOf('-') <= -1) && (locale.indexOf('a') > -1));  // TEMP restrict to small set
    return locales;
} 
