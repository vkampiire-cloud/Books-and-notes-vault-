//Reactive Data STore & Calculation 
import { load ,save } from './storage.js ';
export  let books = load ();
export let sortField = 'date', sortAsc = false, query = '', caseIns = true;

export function setQuery (q) { query = q; }
export function  setCase(ci) { caseIns = ci;}
export function  setSort (field){
    sortAsc = sortField === field ? !sortAsc : true;
    sortField = field ;
}
export function addBook (book) { books.push(book); save(books); }
export function updateBook( id,book){
    const  idx = books.findIndex(b => b.id === id);
    if ( idx>=0) { books[idx] = { ...books[idx], ...book }; save(books);}

}
export function  deleteBook (id) { books = books.filter(b => b.id !== id); save(books);}
export function setBooks (newBooks) { books = newBooks; save(books);}

export  function getFilteredBooks(regex) {
    const list =  books.filter(b => !regex || [b.title, b.author, b.tag, b.pages, b.notes].some(f => regex.test(String(f ?? ''))));
    return list.sort ((a, b) => (sortField === 'pages' ? (a.pages - b.pages) : String(a[sortField]).localeCompare(String(b[sortField]))) * (sortAsc ? 1 : -1));

}
export function getStats (){
    const totalPages = books.reduce((s, b) => s + (Number(b.pages) || 0), 0);
    const tagCoUNTS={};
    books.forEach(b => { if (b.tag) tagCounts[b.tag] = (tagCounts[b.tag] || 0) + 1; });
    const topTag = Object.keys (tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a])[0] || '-';
    return{ totalBooks : books.length ,totalPages,topTag};
}
