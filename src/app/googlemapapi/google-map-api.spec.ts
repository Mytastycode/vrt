/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Googlemapapi } from './google-map-api';

describe('Googlemapapi', () => {
  let component: Googlemapapi;
  let fixture: ComponentFixture<Googlemapapi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Googlemapapi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Googlemapapi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
