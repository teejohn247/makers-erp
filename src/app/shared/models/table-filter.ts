export type FilterType = 'select' | 'multiselect' | 'date' | 'daterange' | 'text'; 

export interface FilterOption { 
    value: string | number; 
    label: string; 
} 

export interface FilterConfig { 
    key: string; // API param key, e.g. "department" 
    label: string; // UI label 
    type: FilterType; // 'select' | 'daterange' etc. 
    options?: any; // for select/multiselect 
    placeholder?: string; 
    multiple?: boolean; // for multiselect 
    includeIfEmpty?: boolean; // whether to include param when empty 
    default?: any; // default value 
}