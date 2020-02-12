import { NgModule } from '@angular/core';
import { SearchUsersPipe } from './pipes/search-users/search-users.pipe';

@NgModule({
	declarations: [SearchUsersPipe],
	imports: [],
	exports: [SearchUsersPipe]
})
export class PipesModule {}
