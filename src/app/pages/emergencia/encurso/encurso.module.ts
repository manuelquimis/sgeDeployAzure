import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncursoComponent } from './encurso.component';
import { EncursoRoutingModule } from './encurso-routing.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from "primeng/radiobutton";
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [EncursoComponent],
  imports: [
    CommonModule,
    EncursoRoutingModule,

    ButtonModule,
    DialogModule,
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,

    TableModule,
    FormsModule,
    DropdownModule,
    ChipModule,
    DividerModule,
    InputTextModule,
    TooltipModule,
    RadioButtonModule,
    InputMaskModule,

    SpeedDialModule,
    ProgressSpinnerModule,
    
  ],
})
export class EncursoModule {}
