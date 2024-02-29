import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespacharComponent } from './despachar.component';
import { DespacharRoutingModule } from './despachar-routing.module';
import { FormsModule } from '@angular/forms';

import { SplitterModule } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [DespacharComponent],
  imports: [
    CommonModule,
    DespacharRoutingModule,
    SplitterModule,
    FormsModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ToastModule,
    SpeedDialModule,
    SelectButtonModule,
    FieldsetModule,
    SplitButtonModule,
    TreeSelectModule,
    MultiSelectModule,
    DropdownModule,
    ProgressSpinnerModule,
  ],
})
export class DespacharModule {}
