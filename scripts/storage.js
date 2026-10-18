 //Local storage & JSON handling 
 const KEY ='booknotes:data';
 export const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
export const save = data => localStorage.setItem(KEY, JSON.stringify(data));

 export function exportJSON(data) {
    const a = document.createElement('a');
    a.href = 'data;text/json;charset=utf-8' + encodeURIComponent(JSON.stringify(data,null,2));
    a.download= 'booknotes_backup.json';
    a.click();
 }
 export function importJSON (file,callback) { 
    const reader = new FileReader();
    reader.onload =e =>{
        try{
            const parsed =JSON.parse (e.target.result);
            if ( Array.isArray(parsed)) callback (parsed);
            else alert ('InvalidJSON: expected an array.');
        }catch { alert ('Could not parse Json File ');}
        };
        reader.readAsText(file);
    }
 