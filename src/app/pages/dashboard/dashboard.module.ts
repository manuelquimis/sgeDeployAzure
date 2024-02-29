import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    DashboardsRoutingModule,
    PanelModule,
    DividerModule,
    SkeletonModule,
    ProgressSpinnerModule,
    CalendarModule,
    SplitButtonModule,
    SpeedDialModule,
    InputTextModule,
    ChipModule,
    TableModule,
  ],
  providers: [DatePipe],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
