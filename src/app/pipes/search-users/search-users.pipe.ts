import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUsersPipe'
})
export class SearchUsersPipe implements PipeTransform {

	transform(value, term, test) {
		if (!term || !value) {
			return value;
		}
		return value.filter((item) => {
				return (((item.firstname.toUpperCase() + " " + item.lastname.toUpperCase()).includes(term.toUpperCase().replace(/\s+/g, " "))) ||
								((item.lastname.toUpperCase() + " " + item.firstname.toUpperCase()).includes(term.toUpperCase().replace(/\s+/g, " "))) ||
								(item.company.toUpperCase().includes(term.toUpperCase())))
		});
	}

}
