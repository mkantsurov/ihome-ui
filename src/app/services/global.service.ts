import {EventEmitter, Injectable} from '@angular/core';
import {USER_ID, ACCESS_TOKEN, REFRESH_TOKEN} from '../domain/constant';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public loginEvent = new EventEmitter<boolean>();
  userId: Subject<number> = new Subject<number>();


  addToLocal(key: string, value) {
    localStorage.setItem(key, value == null ? 'null' : value.toString());
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

  setUserId(value: number): void {
    this.addToLocal(USER_ID, value);
    this.userId.next(value);
  }

  getUserId(): number {
    const usId = this.getFromLocal(USER_ID);
    if (usId == null || usId.length === 0) {
      return null;
    }
    return parseInt(usId, 10);
  }

  setAccessToken(accessToken: string): void {
    this.addToLocal(ACCESS_TOKEN, accessToken);
  }

  getAccessToken(): string {
    return this.getFromLocal(ACCESS_TOKEN);
  }

  setRefreshToken(refreshToken: string): void {
    this.addToLocal(REFRESH_TOKEN, refreshToken);
  }

  getRefreshToken(): string | null {
    return this.getFromLocal(REFRESH_TOKEN);
  }

}
