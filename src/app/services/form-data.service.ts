import { Injectable } from '@angular/core';
import { CsvInterface } from '../shared/interfaces/csv.interface';
import { LocalStorageKeys } from '../shared/literals';
import { FormDataInterfaceForLocalStorage } from '../shared/interfaces/form-data.interface';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor(private localStorage: LocalStorageService) {}

  setFormData(data: FormDataInterfaceForLocalStorage) {
    this.localStorage.set(LocalStorageKeys.FORM_DATA, JSON.stringify(data));
  }

  getFormData(): string | null {
    return this.localStorage.get(LocalStorageKeys.FORM_DATA);
  }

  setCSVData(data: CsvInterface) {
    this.localStorage.set(LocalStorageKeys.CSV_DATA, JSON.stringify(data));
  }

  getCSVData(): string | null {
    return this.localStorage.get(LocalStorageKeys.CSV_DATA);
  }
}
