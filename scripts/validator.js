 //form & Regex Validation 
 export const PATTERNS = { 
    title:/^\S(?:.*\S)?$/,
    author:/^[A-Za-z]+(?:[ .'-]+[A-Za-z]+)*\.?$/,
    pages :/^[1-9]\d*$/,
    date :/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

 };
 //back reference to detect duplicate consecutive words 
export function findDuplicateWord(text) {
   const match = String(text ?? '').match(/\b(\w+)\s+\1\b/i);
  return match ? match[1] : null;

    
 }