import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public loginEvent = new EventEmitter<boolean>();


  addToLocal(key: string, value) {
    localStorage.setItem(key, value == null ? "null" : value.toString());
  }

  getFromLocal(key: string) {
    return localStorage.getItem(key);
  }

  /**
   * Converts a JavaScript value to a JSON string and add to the local storage.
   */
  addToLocalAsObject(key: string, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Get a JavaScript value as string from the local storage and convert it to a JavaScript value.
   */
  getFromLocalAsObject(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}
