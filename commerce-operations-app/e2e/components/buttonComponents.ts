import{Page}from '@playwright/test';

export class Button{
    constructor(readonly page:Page){}
     getButton(buttonName:String){
        return this.page.getByTestId(`button-${buttonName}`);
     }
}