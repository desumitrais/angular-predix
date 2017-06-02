import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    templateUrl: './datapoint.component.html',
    styleUrls: ['./datapoint.component.css']
})
export class DataPointComponent {
    private baseUrl:string = 'https://tranquil-savannah-54974.herokuapp.com';
    //private baseUrl:string = 'http://localhost:9092';

    dataPoints:number[][];
    dataPointSearchForm:FormGroup;

    constructor(private http:Http) {}

    ngOnInit() {
        this.dataPoints = null;
        
        this.dataPointSearchForm = new FormGroup({
            tagName: new FormControl('Compressor-2015:CompressionRatio'),
            startNumber: new FormControl(1),
            startTime: new FormControl('y'),
            endNumber: new FormControl(1),
            endTime: new FormControl('s')
        });
        
        this.getAllDataPoints({tagName:'Compressor-2015:CompressionRatio', startNumber:1, startTime:'y', endNumber:1, endTime:'s'}).subscribe(
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
    
    getAllDataPoints(value:DataPointsSearch):Observable<number[][]> {
        //let urlPath:string = this.baseUrl + '/services/windservices/yearly_data/sensor_id/'+value.tagName;
        let urlPath:string = this.baseUrl + '/services/windservices/temperature?id='+value.tagName;

        if(value.startNumber > 0) {
            urlPath = urlPath + '&startDate='+value.startNumber+value.startTime+'-ago';
        } else {
            urlPath = urlPath + '&startDate=1y-ago';
        }

        if(value.endNumber > 0) {
            urlPath = urlPath + '&endDate='+value.endNumber+value.endTime+'-ago';
        } else {
            urlPath = urlPath + '&endDate=1s-ago';
        }

        return this.http.get(urlPath).map(this.mapDataPoints);
    }
    
    mapDataPoints(response:Response):number[][] {
        return response.json().tags[0].results[0].values;
    }
}

export class DataPointsSearch {
  tagName: string;
  startNumber: number;
  startTime: string;
  endNumber: number;
  endTime: string;
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