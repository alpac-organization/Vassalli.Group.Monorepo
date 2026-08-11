import type { DocumentType } from "@app/core/enums/document.enum";

export interface GetMerchandiseResponse {
  data: MerchandiseRegisterItem[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
}

export interface MerchandiseRegisterItem {
  id: string;
  plate_number: string;
  driver_name: string;
  container_number: string | null;
  arrival_date: string;
  arrival_time: string;
  document_type: DocumentType;
  total_documents: number;
  completed_documents: number;
}
//test1: 000111
//test2: 11100
//test3: 00011100
function countBinaryStrings(s: string): number {
  let prevBlockLength = 0;
  let currBlockLength = 0;
  let count = 0;
  const size = s.length;
  const arrSplit = s.split("");
  let i = 0;
  while (i < size) {
    const current = arrSplit[i];
    const next = arrSplit[i + 1];
    if (current != next) {
      if (prevBlockLength == currBlockLength) {
        count += Math.min(prevBlockLength, currBlockLength);
      }
    } else {
      currBlockLength++;
      prevBlockLength++;
    }
    i++;
  }
  return count;
}
console.log(countBinaryStrings("ABC"));
