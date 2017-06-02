import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arduino TimeSeries!';
  private baseUrl:string = 'https://tranquil-savannah-54974.herokuapp.com';
  //private baseUrl:string = 'http://localhost:9092';
  results:string[];
  dataPoints:number[][];
  dataPointSearchForm:FormGroup;

  constructor(private http:Http) {}

  ngOnInit() {
    this.dataPoints = null;

    this.dataPointSearchForm = new FormGroup({
      tagName: new FormControl('Compressor-2015:CompressionRatio'),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });

    this.getAll().subscribe(
      results => this.results = results,
      err => {
        console.log(err);
      }
    );

    this.getAllDataPoints({tagName:'Compressor-2015:CompressionRatio', startDate:'', endDate:''}).subscribe(
      dataPoints => this.dataPoints = dataPoints,
      err => {
        console.log(err);
      }
    );
  }

  onSubmit({value, valid}:{value:DataPointsSearch, valid:boolean}) {
    this.dataPoints = null;

    this.getAllDataPoints(value).subscribe(
      dataPoints => this.dataPoints = dataPoints,
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

  getAllDataPoints(value:DataPointsSearch):Observable<number[][]> {
    return this.http.get(this.baseUrl + '/services/windservices/yearly_data/sensor_id/'+value.tagName).map(this.mapDataPoints);
  }

  mapDataPoints(response:Response):number[][] {
    return response.json().tags[0].results[0].values;
  }
}

export class DataPointsSearch {
  tagName: string;
  startDate: string;
  endDate: string;
}

export class WindData {
  start:string;
  end:string;
  tags:[{
    name:string,
    results:[{
      groups:[{
        name:string,
        type:string
      }],
      attributes:{
        customer:string[],
        host:string[]
      },
      values:number[][]
    }

    ],
    stats:{
      rawCount:number
    }
  }]
}