import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './components/layout/layout.module';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import localeEsEC from '@angular/common/locales/es-EC';
import { registerLocaleData } from '@angular/common';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [BrowserModule, AppRoutingModule, LayoutModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(){
    registerLocaleData(localeEsEC, 'es-EC')

  }
}
