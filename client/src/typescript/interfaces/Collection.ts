import { Model } from '.';

export interface NewCollection {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface Collection extends Model, NewCollection {
  snippetCount?: number;
}
