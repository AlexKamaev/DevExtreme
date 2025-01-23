import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(http: HttpClient) {
    http.get('../../../../data/diagram-flow.json').subscribe({
      next: (data) => { this.diagram.instance.import(JSON.stringify(data)); },
      error: (err) => { throw 'Data Loading Error'; },
    });
  }

  onCustomCommand(e) {
    if (e.name === 'clear') {
      const result = confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
      result.then(
        (dialogResult) => {
          if (dialogResult) {
            e.component.import('');
          }
        },
      );
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
