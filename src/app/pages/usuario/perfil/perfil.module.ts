import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil-routing.module';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    PerfilRoutingModule,

    ButtonModule,
    FileUploadModule,
    ToastModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    ProgressSpinnerModule,
    
  ],
})
export class PerfilModule {}
