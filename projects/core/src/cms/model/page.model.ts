import { ContentSlotData } from './content-slot.model';

export interface Page {
  uuid?: string;
  pageId?: string;
  catalogUuid?: string;
  name?: string;
  template?: string;
  loadTime?: number;
  seen?: Array<string>;
  slots: { [key: string]: ContentSlotData };
}
