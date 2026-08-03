import {Page, Locator} from "@playwright/test";

export class TextFieldsComponents{
    constructor (readonly page:Page){}

    getInputField(textFiledName:String){
         return this.page.getByTestId(`input-field-${textFiledName}`)
    }
}