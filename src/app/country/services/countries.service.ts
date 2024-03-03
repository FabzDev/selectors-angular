import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {
  private _regions = [Region.Af, Region.Am, Region.As, Region.Eu, Region.Oc]

  constructor() { }

  get regions(){
    return this._regions;
  }
}
