import {Component} from '@angular/core';
import {WebsiteDesignForm} from '../components/form/website-design.form';

@Component({
  standalone: true,
  selector: 'page-design',
  imports: [WebsiteDesignForm],
  template: `
    <website-design-form></website-design-form>
  `,
  styles: `
  `,
})
export class DesignPage {
}
