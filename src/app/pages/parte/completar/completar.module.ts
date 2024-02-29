import { NgModule } from '@angular/core';
import { CompletarRoutingModule } from './completar-routing.module';
import { CommonModule } from '@angular/common';
import { CompletarComponent } from './completar.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [CompletarComponent],
  imports: [
    CommonModule,
    CompletarRoutingModule,

    TableModule,
    ButtonModule,
    DialogModule,
    CardModule,
    OverlayPanelModule,
    TagModule,
    DividerModule,
    TooltipModule,
    ProgressSpinnerModule,
    
  ],
})
export class CompletarModule {}
