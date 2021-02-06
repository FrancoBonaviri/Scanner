import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { clearScreenDown } from 'readline';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  slideOpt = {
    allowSlidePrev: false,
    allowSlideNext: false,
  }
  constructor(private barcodeScaner: BarcodeScanner,
              private dataLocal: DataLocalService) {}
  
  ionViewWillEnter(){
    this.scan();
  }


  scan(){
    this.barcodeScaner.scan({
      "preferFrontCamera" : true,
      "showFlipCameraButton" : true,
      "prompt" : "zzzzzzzzzzzz", 
      "formats" : "PDF_417,QR_CODE"  
    })
    .then(barcodeData => {
      console.log("Barcode Data", barcodeData);
      if( !barcodeData.cancelled ){
        console.log(barcodeData);
        this.dataLocal.guardarRegistro( barcodeData.format, barcodeData.text );
      }
    }).catch(err => {
      // this.dataLocal.guardarRegistro( 'QRCode', 'https://Google.com' ); //registro Hardcodeado para poder ver un registro sin tener que correr la app en un andriod 
      // this.dataLocal.guardarRegistro( 'QRCode', 'geo:40.73151796986687,-74.06087294062502' ); //registro Hardcodeado para poder ver un registro sin tener que correr la app en un andriod 
      console.log('Ocurrio un error, no se puedo relizar el escaneo');
    })
  }
}
