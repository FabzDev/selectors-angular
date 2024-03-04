import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Country,
  Region,
  SmallCountry,
} from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { JsonPipe } from '@angular/common';

const baseURL = 'https://restcountries.com/v3.1/';

@Component({
  selector: 'country-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required], []],
    country: ['', [Validators.required], []],
    borders: ['', [Validators.required], []],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.getCountries().subscribe((countries) => {
      this.countriesService.countries = countries.sort((a, b) =>
        a.name.common > b.name.common ? 1 : -1
      );
    });

    this.getBorders().subscribe((borders) => this.countriesService.borders = borders);
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  get countries(): SmallCountry[] {
    return this.countriesService.countries;
  }

  get borders(): string[] {
    return this.countriesService.borders;
  }

  getCountries(): Observable<SmallCountry[]> {
    return this.myForm
      .get('region')!.valueChanges
      .pipe(
        switchMap((region) => this.countriesService.getCountriesByRegion(region))
      );
  }

  getBorders(): Observable<string[]> {
    return this.myForm.get('country')!.valueChanges
    .pipe(
      switchMap(cca3 => this.countriesService.countries.filter( (country) => country.cca3 == cca3)),
      map((country) => country.borders)
    );
  }
}
