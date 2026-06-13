import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary.component.html',
})
export class SummaryComponent {}
