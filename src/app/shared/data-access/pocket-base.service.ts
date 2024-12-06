import { Injectable } from "@angular/core";
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseService {
  url = 'https://nbx.pockethost.io/';
  client = new PocketBase(this.url);
}