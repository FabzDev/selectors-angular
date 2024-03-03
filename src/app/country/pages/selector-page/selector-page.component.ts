import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Region } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'country-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent {

  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required],[]],
    country: ['', [Validators.required],[]],
    borders: ['', [Validators.required],[]],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
    ){}

    get regions(): Region[] {
      return this.countriesService.regions;
    }

}
