// {
//   displayName: 'Cūḷadhammasamādāna Sutta',
//   search_field: 'Mn 45 Cūḷadhammasamādāna Sutta (Culadhammasamadana Sutta)',
//   textname: 'Mn 45',
//   filename: 'mn45',
//   category: 'mn',
//   available_lang: null
// }

export interface ApiLanguageMenuData {
  displayName: string;
  search_field: string;
  textname: string;
  filename: string;
  category: string;
  available_lang: null;
}

export interface APIResponse<T> {
  result: T;
}
