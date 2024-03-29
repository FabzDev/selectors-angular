import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';

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
    this.myForm.get('region')?.setValue('def');
    this.myForm.get('country')?.setValue('def');
    this.myForm.get('borders')?.setValue('def');

    this.getCountries().subscribe((countries) => {
      this.countriesService.borders = [];
      this.myForm.get('borders')?.setValue('def');

      this.countriesService.countries = countries.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    });

    this.getBorders().subscribe((borders) => {
      this.myForm.get('borders')?.setValue('def');

      this.countriesService.borders = borders.sort();
    });
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
    return this.myForm.get('region')!.valueChanges.pipe(
      tap(() => this.myForm.get('country')!.setValue('def')),
      switchMap((region) => this.countriesService.getCountriesByRegion(region))
    );
  }

  // getBorders(): Observable<string[]> {
  //   return this.myForm.get('country')!.valueChanges.pipe(
  //     switchMap((cca3) =>
  //       this.countriesService.countries.filter(
  //         (country) => country.cca3 == cca3
  //       )
  //     ),
  //     map((country) => country.borders),
  //     map((borders) =>
  //       borders
  //         .map((borde) =>
  //           this.countries.find((country) => country.cca3 === borde)
  //         )
  //         .map((country) => {
  //           if (!country) return '';
  //           return country.name;
  //         })
  //     )
  //   );
  // }


  // myForm: reactive form
  // cca3: codigo de pais
  // this.countries: arreglo de paises
  // pais: {name:'',cca3:'',borders:[]}
  //
  getBorders(): Observable<string[]> {
    return this.myForm.get('country')!.valueChanges.pipe(
      map( cca3 => this.getSmallCountry(this.countries, cca3)),
      map( country => country.borders),
      map( borders => borders.map( border => this.getSmallCountry(this.countries, border))),
      map( countries => countries.map( country => country.name))
    )
  }

  getSmallCountry(listaDePaises: SmallCountry[], cca3: string): SmallCountry  {
    const country = listaDePaises.find( pais => pais.cca3 == cca3);
    if (!country) return {name:'',cca3:'',borders:[]}
    return country;
  }
}
