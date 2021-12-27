import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../list/list.module';
import { LoadingModule } from '../loading/loading.module';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { VehiclesComponent } from './vehicles.component';
import { VehicleComponent } from './vehicle/vehicle.component';


@NgModule({
  declarations: [
    VehiclesComponent,
    VehicleComponent
  ],
  imports: [
    CommonModule,
    ListModule,
    LoadingModule,
    VehiclesRoutingModule
  ]
})
export class VehiclesModule { }
