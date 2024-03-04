import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

const baseURL = 'https://restcountries.com/v3.1'

@Injectable({providedIn: 'root'})
export class CountriesService {

  private _regions: Region[] = [Region.Af, Region.Am, Region.As, Region.Eu, Region.Oc]

  public countries: SmallCountry[] = []

  public borders: string[] = []

  constructor( private http: HttpClient ) {}

  get regions(): Region[] {
    return this._regions;
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]>{
    return this.http.get<Country[]>(`${baseURL}/region/${ region }?fields=cca3,name,borders`)
    .pipe(
      map(countries => countries.map( country => {
        return {
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders || []
          }
        }
      ))
    )
  }

}
