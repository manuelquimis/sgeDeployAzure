import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MenuComponent } from "../menu/menu.component";
import { FooterComponent } from "../footer/footer.component";
import { AppMenuitemComponent } from "../menu/app.menuitem.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';

import { AvatarModule } from 'primeng/avatar';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent, 
    MenuComponent,
    AppMenuitemComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule, 
    BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        
        AvatarModule,
        // AppConfigModule
  ],
  exports: [LayoutComponent]

})
export class LayoutModule { }
