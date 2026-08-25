import{Page}from '@playwright/test';
import { ErrorFields } from '../enums/inLineErrors';

export class errorMessages{
    constructor(readonly page:Page){}

    getErrorMessage(errorField:ErrorFields){
         return this.page.getByTestId(`error-field-${errorField}`);
    }
}