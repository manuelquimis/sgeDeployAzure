import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar.component';
import { ListarRoutingModule } from './listar-routing.module';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListarComponent],
  imports: [
    CommonModule,
    ListarRoutingModule,
    FormsModule,

    InputTextModule,
    CalendarModule,
    DividerModule,
    TableModule,
    MultiSelectModule,
    SliderModule,
    DropdownModule,
    TagModule,
    PaginatorModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule,
    ChipModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
})
export class ListarModule {}
