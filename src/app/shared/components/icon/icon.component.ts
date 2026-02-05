import { Component, Input, OnInit } from '@angular/core';
import { Icons } from '../../../core/constants/icons';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  icons = Icons;
  @Input() iconName:string;
  @Input() iconWidth?:string = '24';
  @Input() iconHeight?:string = '24';

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  public transformSvg(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
