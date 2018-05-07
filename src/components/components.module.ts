import { NgModule } from '@angular/core';
import { SelectizePopoverPageComponent } from './selectize-popover-page/selectize-popover-page';
import { HighlightComponent } from './highlight/highlight';
import { GetFormPopoverComponent } from './get-form-popover/get-form-popover';
import { GuiderComponent } from './guider/guider';
import { HelpPopoverComponent } from './help-popover/help-popover';
import { TagsSelectorComponent } from './tags-selector/tags-selector';
import { ConlluEditorComponent } from './conllu-editor/conllu-editor';
@NgModule({
	declarations: [SelectizePopoverPageComponent,
    HighlightComponent,
    GetFormPopoverComponent,
    GuiderComponent,
    HelpPopoverComponent,
    TagsSelectorComponent,
    ConlluEditorComponent],
	imports: [],
	exports: [SelectizePopoverPageComponent,
    HighlightComponent,
    GetFormPopoverComponent,
    GuiderComponent,
    HelpPopoverComponent,
    TagsSelectorComponent,
    ConlluEditorComponent]
})
export class ComponentsModule {}
