import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.css']
})
export class TagComponent {
    results:string[];
    private baseUrl:string = 'https://tranquil-savannah-54974.herokuapp.com';

    constructor(private http:Http) {}

    ngOnInit() {
        this.getAll().subscribe(
            results => this.results = results,
            err => {
                console.log(err);
            }
        );
    }

    getAll():Observable<string[]> {
        return this.http.get(this.baseUrl + '/services/windservices/tags').map(this.mapTags);
    }

    mapTags(response:Response):string[] {
        return response.json().results;
    }


 }