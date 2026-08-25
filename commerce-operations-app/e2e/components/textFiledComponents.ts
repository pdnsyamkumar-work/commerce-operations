import {Page, Locator} from "@playwright/test";
import { Labels } from "../enums/labels";

export class TextFieldsComponents{
    constructor (readonly page:Page){}

    getInputField(textFiledName:Labels){
         return this.page.getByTestId(`input-field-${textFiledName}`)
    }
}