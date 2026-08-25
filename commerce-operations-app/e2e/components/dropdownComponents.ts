import{Page}from "@playwright/test";
import { dropdowns } from "../enums/dropdowns";

export class Dropdowns{
    constructor(readonly page:Page){}
     
    getDropdown(dropdownName:dropdowns){
        return this.page.getByTestId(`dropdown-${dropdownName}`);
    }
    
}