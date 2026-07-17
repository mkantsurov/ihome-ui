export interface SearchParam {
  key: string;       // 'USERNAME' | 'ROLE'
  predicat: string;  // 'ilike', '=', 'in', etc.
  values: string[];
}
