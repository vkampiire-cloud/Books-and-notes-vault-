 export function compileRegex(query,caseInsesnsitive = true ){
    try{ 
        return query ? new RegExp ( query,caseInsensitive ? 'i' :''):null;
    } catch { return null; }
    }
 
 export function  highlight ( text,regex ) { 
    if (!regex || !text ) return String (text ?? '');
    return String(text).replace(regex,m=> '<mark>${m}</mark>');
 }