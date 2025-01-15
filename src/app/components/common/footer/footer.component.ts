import { Component } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { MatGridTile } from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatGridList, MatGridTile, TranslateModule, MatButtonModule],
  templateUrl: 'footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
