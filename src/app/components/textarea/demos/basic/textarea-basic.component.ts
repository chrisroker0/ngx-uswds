import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LabelWrapper } from '@gsa-sam/ngx-uswds';

@Component({
  selector: 'usa-textarea-basic',
  templateUrl: './textarea-basic.component.html',
})
export class TextareaBasicComponent {
  constructor() {}
  value: string;
  textareaModel = '';
  description = `description test with link <a href="./">Goto Home</a>`;

  ngOnInit(): void {}

  updateValue(event) {
    this.value = event;
  }
}
