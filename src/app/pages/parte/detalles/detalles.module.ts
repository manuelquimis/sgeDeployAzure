import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetallesComponent } from './detalles.component';
import { DetallesRoutingModule } from './detalles-routing.module';

import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { SliderModule } from 'primeng/slider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [DetallesComponent],
  imports: [
    CommonModule,
    DetallesRoutingModule,

    FormsModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    FieldsetModule,
    AutoCompleteModule,
    CalendarModule,
    InputNumberModule,
    ChipsModule,
    SliderModule,
    InputTextareaModule,
    DividerModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    TableModule,
    MultiSelectModule,
    DialogModule,
    DropdownModule,

    ToggleButtonModule,
    TooltipModule,
    InputMaskModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    
  ],
})
export class DetallesModule {}
